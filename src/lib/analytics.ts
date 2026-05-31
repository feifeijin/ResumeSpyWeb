/**
 * Analytics: Plausible (page views) + PostHog (product funnel events).
 *
 * Both providers are gated by env vars and silently no-op when unset, so local
 * dev, CI, and tests never reach out to the network. The single `trackEvent`
 * entry-point fans out to both: PostHog gets the full event + properties for
 * funnel/retention queries, Plausible gets a goal name for traffic-attribution
 * dashboards (Product Hunt / V2EX / X / RED launch channels).
 */
import posthog from 'posthog-js'

let posthogReady = false

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Record<string, unknown> }) => void) & {
      q?: unknown[]
    }
  }
}

export function initAnalytics(): void {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST

  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost || 'https://us.i.posthog.com',
      // SPA: we send pageviews from router.afterEach ourselves
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      autocapture: false,
    })
    posthogReady = true
  }
}

export function trackPageview(path: string): void {
  if (posthogReady) {
    posthog.capture('$pageview', { $current_url: window.location.origin + path })
  }
  // Plausible's manual script needs an explicit pageview ping per SPA route change
  window.plausible?.('pageview')
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (posthogReady) {
    posthog.capture(name, properties)
  }
  window.plausible?.(name, properties ? { props: properties } : undefined)
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (posthogReady && userId) {
    posthog.identify(userId, traits)
  }
}

export function resetAnalyticsUser(): void {
  if (posthogReady) {
    posthog.reset()
  }
}
