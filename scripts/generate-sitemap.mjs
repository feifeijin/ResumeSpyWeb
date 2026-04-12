#!/usr/bin/env node
/**
 * scripts/generate-sitemap.mjs
 *
 * Generates public/sitemap.xml from:
 *   - Static routes (/, /auth)
 *   - Article slugs from src/articles/articles.ts (read as text, not imported)
 *     across all supported locales using hreflang alternates
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 *   node scripts/generate-sitemap.mjs --base https://resumespy.com
 *
 * Output: public/sitemap.xml
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Config ─────────────────────────────────────────────────────────────────

const baseArg = process.argv.find(a => a.startsWith('--base='))
const BASE_URL = (baseArg ? baseArg.split('=')[1] : process.env.VITE_SITE_URL || 'https://resumespy.com').replace(/\/$/, '')

const LOCALES = ['en', 'zh', 'ja']
const LOCALE_HREFLANG = { en: 'en', zh: 'zh-Hans', ja: 'ja' }

// Static pages with their priorities and change frequency
const STATIC_ROUTES = [
  { path: '/',     changefreq: 'weekly',  priority: '1.0' },
  { path: '/auth', changefreq: 'monthly', priority: '0.3' },
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
 * For the default locale (en) we use the base path.
 * For other locales we use a query parameter: ?lang=zh
 * (matches how vue-i18n stores the locale in this SPA)
 */
function urlFor(path, locale) {
  const base = `${BASE_URL}${path}`
  return locale === 'en' ? base : `${base}${path.includes('?') ? '&' : '?'}lang=${locale}`
}

// ── XML helpers ────────────────────────────────────────────────────────────

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function urlEntry({ loc, lastmod, changefreq, priority, alternates = [] }) {
  const altTags = alternates.map(
    a => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escape(a.href)}"/>`
  ).join('\n')
  return [
    '  <url>',
    `    <loc>${escape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    altTags,
    '  </url>',
  ].filter(Boolean).join('\n')
}

// ── Main ───────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10)
const slugs = extractSlugs()

const entries = []

// Static routes (EN only — auth pages aren't locale-specific landing pages)
for (const route of STATIC_ROUTES) {
  const alternates = LOCALES.map(locale => ({
    hreflang: LOCALE_HREFLANG[locale],
    href: urlFor(route.path, locale),
  }))
  alternates.push({ hreflang: 'x-default', href: `${BASE_URL}${route.path}` })

  entries.push(urlEntry({
    loc: `${BASE_URL}${route.path}`,
    lastmod: today,
    changefreq: route.changefreq,
    priority: route.priority,
    alternates,
  }))
}

// Article pages — one entry per locale per slug
for (const slug of slugs) {
  for (const locale of LOCALES) {
    const path = `/article/${slug}`
    const loc = urlFor(path, locale)

    const alternates = LOCALES.map(l => ({
      hreflang: LOCALE_HREFLANG[l],
      href: urlFor(path, l),
    }))
    alternates.push({ hreflang: 'x-default', href: `${BASE_URL}${path}` })

    entries.push(urlEntry({
      loc,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
      alternates,
    }))
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset',
  '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '  xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  '</urlset>',
].join('\n')

const outPath = join(ROOT, 'public/sitemap.xml')
writeFileSync(outPath, xml, 'utf8')
console.log(`✅  Sitemap written to public/sitemap.xml`)
console.log(`    ${STATIC_ROUTES.length} static routes × ${LOCALES.length} locales`)
console.log(`    ${slugs.length} articles × ${LOCALES.length} locales`)
console.log(`    Total URLs: ${entries.length}`)
