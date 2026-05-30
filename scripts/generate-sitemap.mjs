#!/usr/bin/env node
/**
 * scripts/generate-sitemap.mjs
 *
 * Generates public/sitemap.xml from:
 *   - Static public routes
 *   - Article slugs from src/articles/articles.ts (read as text, not imported)
 *
 * Each canonical URL appears once in <loc>. Locale variants are emitted
 * only as <xhtml:link rel="alternate" hreflang="..."/> on that single entry.
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 *   node scripts/generate-sitemap.mjs --base=https://example.com
 *   VITE_SITE_URL=https://example.com node scripts/generate-sitemap.mjs
 *
 * Output: public/sitemap.xml
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Config ─────────────────────────────────────────────────────────────────

const baseArg = process.argv.find((a) => a.startsWith('--base='))
const BASE_URL = (
  baseArg
    ? baseArg.split('=')[1]
    : process.env.VITE_SITE_URL || 'https://resumespy.feifeijin.com'
).replace(/\/$/, '')

const LOCALES = ['en', 'zh', 'ja']
const LOCALE_HREFLANG = { en: 'en', zh: 'zh-Hans', ja: 'ja' }
const DEFAULT_LOCALE = 'en'

// Public, indexable routes
const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/articles', changefreq: 'weekly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.2' },
  { path: '/terms', changefreq: 'yearly', priority: '0.2' },
  { path: '/commercial-transactions', changefreq: 'yearly', priority: '0.2' },
]

// ── Extract article slugs from articles.ts source ──────────────────────────

function extractSlugs() {
  const source = readFileSync(join(ROOT, 'src/articles/articles.ts'), 'utf8')
  const slugs = []
  const re = /slug:\s*['"`]([^'"`]+)['"`]/g
  let m
  while ((m = re.exec(source)) !== null) {
    if (!slugs.includes(m[1])) slugs.push(m[1])
  }
  return slugs
}

// ── Build locale-aware URL ─────────────────────────────────────────────────

/**
 * The default locale lives at the bare path; other locales use a `?lang=`
 * query (matches how vue-i18n stores the locale in this SPA).
 */
function urlFor(path, locale) {
  const base = `${BASE_URL}${path}`
  if (locale === DEFAULT_LOCALE) return base
  return `${base}${path.includes('?') ? '&' : '?'}lang=${locale}`
}

// ── XML helpers ────────────────────────────────────────────────────────────

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function urlEntry({ loc, lastmod, changefreq, priority, alternates = [] }) {
  const altTags = alternates
    .map(
      (a) =>
        `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escape(a.href)}"/>`,
    )
    .join('\n')
  return [
    '  <url>',
    `    <loc>${escape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    altTags,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

function buildAlternates(path) {
  const alternates = LOCALES.map((locale) => ({
    hreflang: LOCALE_HREFLANG[locale],
    href: urlFor(path, locale),
  }))
  alternates.push({ hreflang: 'x-default', href: `${BASE_URL}${path}` })
  return alternates
}

// ── Main ───────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10)
const slugs = extractSlugs()

const entries = []

for (const route of STATIC_ROUTES) {
  entries.push(
    urlEntry({
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
      alternates: buildAlternates(route.path),
    }),
  )
}

for (const slug of slugs) {
  const path = `/article/${slug}`
  entries.push(
    urlEntry({
      loc: `${BASE_URL}${path}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
      alternates: buildAlternates(path),
    }),
  )
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset',
  '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '  xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  '</urlset>',
  '',
].join('\n')

const outPath = join(ROOT, 'public/sitemap.xml')
writeFileSync(outPath, xml, 'utf8')
console.log(`Sitemap written to public/sitemap.xml`)
console.log(`  Base URL:   ${BASE_URL}`)
console.log(`  Static:     ${STATIC_ROUTES.length} routes`)
console.log(`  Articles:   ${slugs.length} slugs`)
console.log(`  Total URLs: ${entries.length}`)
