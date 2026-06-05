import { watchEffect, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Centralized SEO injection: title, description, canonical, robots,
 * Open Graph, Twitter card, hreflang alternates, and JSON-LD.
 *
 * Each call replaces previously-injected tags belonging to the same view
 * (tracked via a `data-seo` attribute). On unmount, all of this view's
 * injected tags are removed and document.title is reset to the site default.
 */

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://resumespy.feifeijin.com'

export const DEFAULT_TITLE = 'ResumeSpy — Your Dossier. Your Story.'

const LOCALE_HREFLANG: Record<string, string> = {
  en: 'en',
  zh: 'zh-Hans',
  ja: 'ja',
}

const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
}

const SUPPORTED_LOCALES = Object.keys(LOCALE_HREFLANG)

export interface SeoOptions {
  title: string
  description: string
  /** Path-only canonical (e.g. "/articles"). Falls back to the current route path. */
  canonicalPath?: string
  robots?: string
  /** Locale-specific page (alternates point to ?lang=...). Defaults to true. */
  localized?: boolean
  ogType?: 'website' | 'article'
  ogImage?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  /** Locale used for og:locale (e.g. 'en' | 'zh' | 'ja'). */
  locale?: string
  /** Optional JSON-LD blocks. Each one is injected as its own <script>. */
  jsonLd?: Record<string, unknown>[]
}

const SEO_ATTR = 'data-seo'

function clearInjected(scopeId: string) {
  document.head.querySelectorAll(`[${SEO_ATTR}="${scopeId}"]`).forEach((el) => el.remove())
}

function setMeta(scopeId: string, attr: 'name' | 'property', key: string, content: string) {
  if (!content) return
  const el = document.createElement('meta')
  el.setAttribute(attr, key)
  el.setAttribute('content', content)
  el.setAttribute(SEO_ATTR, scopeId)
  document.head.appendChild(el)
}

function setLink(scopeId: string, rel: string, href: string, extra: Record<string, string> = {}) {
  if (!href) return
  const el = document.createElement('link')
  el.setAttribute('rel', rel)
  el.setAttribute('href', href)
  for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v)
  el.setAttribute(SEO_ATTR, scopeId)
  document.head.appendChild(el)
}

function setJsonLd(scopeId: string, data: Record<string, unknown>) {
  const el = document.createElement('script')
  el.setAttribute('type', 'application/ld+json')
  el.setAttribute(SEO_ATTR, scopeId)
  el.textContent = JSON.stringify(data)
  document.head.appendChild(el)
}

let scopeCounter = 0

export function useSeo(getOptions: () => SeoOptions) {
  const route = useRoute()
  const scopeId = `seo-${++scopeCounter}`

  watchEffect(() => {
    const opts = getOptions()

    document.title = opts.title || DEFAULT_TITLE
    clearInjected(scopeId)

    const path = opts.canonicalPath ?? route.path
    const canonical = `${SITE_URL}${path}`

    setMeta(scopeId, 'name', 'description', opts.description)
    setMeta(scopeId, 'name', 'robots', opts.robots ?? 'index,follow')
    if (opts.author) setMeta(scopeId, 'name', 'author', opts.author)

    setLink(scopeId, 'canonical', canonical)

    // hreflang alternates (only for localized pages)
    if (opts.localized !== false) {
      for (const code of SUPPORTED_LOCALES) {
        const href =
          code === 'en'
            ? canonical
            : `${canonical}${canonical.includes('?') ? '&' : '?'}lang=${code}`
        setLink(scopeId, 'alternate', href, { hreflang: LOCALE_HREFLANG[code] })
      }
      setLink(scopeId, 'alternate', canonical, { hreflang: 'x-default' })
    }

    // Open Graph
    setMeta(scopeId, 'property', 'og:type', opts.ogType ?? 'website')
    setMeta(scopeId, 'property', 'og:site_name', 'ResumeSpy')
    setMeta(scopeId, 'property', 'og:title', opts.title)
    setMeta(scopeId, 'property', 'og:description', opts.description)
    setMeta(scopeId, 'property', 'og:url', canonical)
    setMeta(scopeId, 'property', 'og:image', opts.ogImage ?? `${SITE_URL}/og-image.png`)
    if (opts.locale) setMeta(scopeId, 'property', 'og:locale', OG_LOCALE[opts.locale] ?? 'en_US')
    if (opts.publishedTime)
      setMeta(scopeId, 'property', 'article:published_time', opts.publishedTime)
    if (opts.modifiedTime)
      setMeta(scopeId, 'property', 'article:modified_time', opts.modifiedTime)
    if (opts.author && opts.ogType === 'article')
      setMeta(scopeId, 'property', 'article:author', opts.author)
    for (const tag of opts.tags ?? []) setMeta(scopeId, 'property', 'article:tag', tag)

    // Twitter / X
    setMeta(scopeId, 'name', 'twitter:card', 'summary_large_image')
    setMeta(scopeId, 'name', 'twitter:title', opts.title)
    setMeta(scopeId, 'name', 'twitter:description', opts.description)
    setMeta(scopeId, 'name', 'twitter:image', opts.ogImage ?? `${SITE_URL}/og-image.png`)

    for (const block of opts.jsonLd ?? []) setJsonLd(scopeId, block)
  })

  onUnmounted(() => {
    clearInjected(scopeId)
    document.title = DEFAULT_TITLE
  })
}

export function siteUrl(path: string): string {
  return `${SITE_URL}${path}`
}
