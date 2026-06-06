/**
 * Analytics: PostHog (page views + product funnel events).
 *
 * Gated by env vars and silently no-ops when unset, so local dev, CI, and tests
 * never reach out to the network. PostHog gets the full event + properties for
 * funnel/retention queries plus SPA pageviews emitted from router.afterEach.
 */
import posthog from 'posthog-js'

let posthogReady = false

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
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (posthogReady) {
    posthog.capture(name, properties)
  }
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
