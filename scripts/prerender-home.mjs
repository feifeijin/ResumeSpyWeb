#!/usr/bin/env node
/**
 * scripts/prerender-home.mjs
 *
 * Post-build: injects a static HTML snapshot of the landing page into
 * dist/index.html so non-JS crawlers (Bing, DuckDuckGo, social, AI bots)
 * see real content instead of an empty <div id="app"></div>.
 *
 * Vue mounts on top of this content at runtime — no hydration errors because
 * Vue replaces (not hydrates) the static markup.
 *
 * Usage (auto-run via postbuild npm hook):
 *   node scripts/prerender-home.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST_INDEX = join(ROOT, 'dist', 'index.html')

if (!existsSync(DIST_INDEX)) {
  console.warn('prerender-home: dist/index.html not found — skipping')
  process.exit(0)
}

// ── Translations ────────────────────────────────────────────────────────────

const en = JSON.parse(readFileSync(join(ROOT, 'src/locales/en.json'), 'utf8'))

function t(key) {
  const parts = key.split('.')
  let v = en
  for (const p of parts) v = v?.[p]
  return typeof v === 'string' ? v : ''
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Article extraction ───────────────────────────────────────────────────────

function extractEnArticles() {
  const src = readFileSync(join(ROOT, 'src/articles/articles.ts'), 'utf8')
  const year = new Date().getFullYear()

  // Isolate the en: [...] block — it comes before `zh:` or end of object
  const enMatch = src.match(/en:\s*\[([\s\S]*?)\],?\s*(?:zh:|ja:|}\s*$)/)
  if (!enMatch) return []

  // Resolve template literal year references before parsing so `${year}`
  // braces don't confuse the object-boundary regex below.
  const block = enMatch[1].replace(/\$\{year\}/g, String(year))
  const articles = []

  // Split on article object boundaries (no nested objects in ArticleMeta)
  const objectRe = /\{([\s\S]*?)\}/g
  let m
  while ((m = objectRe.exec(block)) !== null) {
    const obj = m[1]

    const slugMatch = obj.match(/slug:\s*['"`]([^'"`]+)['"`]/)
    const titleMatch = obj.match(/title:\s*(?:`([^`]*)`|'([^']*)'|"([^"]*)")/)
    const excerptMatch = obj.match(/excerpt:\s*\n?\s*(?:`([^`]*)`|'([^']*)'|"([^"]*)")/)

    if (!slugMatch) continue

    const slug = slugMatch[1]
    const title = titleMatch ? (titleMatch[1] ?? titleMatch[2] ?? titleMatch[3] ?? slug) : slug
    const excerpt = excerptMatch ? (excerptMatch[1] ?? excerptMatch[2] ?? excerptMatch[3] ?? '') : ''

    articles.push({ slug, title, excerpt })
  }

  return articles
}

// ── HTML generation ──────────────────────────────────────────────────────────

function buildPrerenderedHTML() {
  const articles = extractEnArticles()

  const featureCards = [
    { icon: '◈', title: t('home.features.versionControl'), desc: t('home.features.versionControlDesc') },
    { icon: '◆', title: t('home.features.aiTailoring'), desc: t('home.features.aiTailoringDesc') },
    { icon: '◇', title: t('home.features.manyTongues'), desc: t('home.features.manyTonguesDesc') },
  ]

  const steps = [
    { icon: '✒', title: t('home.process.step1Title'), desc: t('home.process.step1Desc') },
    { icon: '◆', title: t('home.process.step2Title'), desc: t('home.process.step2Desc') },
    { icon: '◈', title: t('home.process.step3Title'), desc: t('home.process.step3Desc') },
  ]

  return `<div class="noir-home" data-prerendered="1">
  <section class="hero">
    <div class="hero-inner">
      <p class="overline">${esc(t('home.overline'))}</p>
      <h1 class="hero-title">RESUME<span class="title-gold">SPY</span></h1>
      <p class="tagline">${esc(t('home.tagline'))}</p>
      <p class="hero-desc">${esc(t('home.description'))}</p>
      <div class="hero-cta">
        <a href="/create" class="btn-ink">${esc(t('home.cta'))}</a>
        <a href="/auth" class="btn-ghost">${esc(t('navigation.login'))}</a>
      </div>
    </div>
  </section>

  <section class="features">
    <h2 class="section-heading">${esc(t('home.sectionHeading'))}</h2>
    <div class="card-grid">
      ${featureCards.map(f => `<div class="case-card">
        <div class="card-header">
          <span class="card-icon" aria-hidden="true">${esc(f.icon)}</span>
          <h3 class="card-title">${esc(f.title)}</h3>
        </div>
        <p class="card-desc">${esc(f.desc)}</p>
      </div>`).join('\n      ')}
    </div>
  </section>

  <section class="how-it-works">
    <div class="how-inner">
      <p class="section-overline">${esc(t('home.process.title'))}</p>
      <h2 class="section-title">${esc(t('home.process.subtitle'))}</h2>
      <div class="steps">
        ${steps.map(s => `<div class="step">
          <div class="step-header">
            <span class="step-icon" aria-hidden="true">${esc(s.icon)}</span>
            <h3 class="step-title">${esc(s.title)}</h3>
          </div>
          <p class="step-desc">${esc(s.desc)}</p>
        </div>`).join('\n        ')}
      </div>
      <a href="/create" class="btn-ink">${esc(t('home.process.cta'))}</a>
    </div>
  </section>

  <section class="reading-room">
    <div class="reading-inner">
      <p class="section-overline">${esc(t('home.readingRoom.title'))}</p>
      <h2 class="section-title">${esc(t('home.readingRoom.subtitle'))}</h2>
      <p class="section-sub">${esc(t('home.readingRoom.description'))}</p>
      <div class="article-grid">
        ${articles.map(a => `<article class="article-card">
          <a href="/article/${esc(a.slug)}">
            <h3 class="card-title">${esc(a.title)}</h3>
            ${a.excerpt ? `<p class="card-excerpt">${esc(a.excerpt)}</p>` : ''}
          </a>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="manifesto">
    <p class="manifesto-label">${esc(t('home.manifesto.label'))}</p>
    <blockquote class="manifesto-quote">&ldquo;${esc(t('home.manifesto.quote'))}&rdquo;</blockquote>
    <p class="manifesto-sig">${esc(t('home.manifesto.author'))}</p>
    <p class="manifesto-note">${esc(t('home.manifesto.note'))}</p>
  </section>
</div>`
}

// ── Inject into dist/index.html ──────────────────────────────────────────────

const original = readFileSync(DIST_INDEX, 'utf8')
const prerendered = buildPrerenderedHTML()

// Replace the empty SPA mount point with the static snapshot.
// Capture any attributes on #app (e.g. v-cloak) so they are preserved in output.
const updated = original.replace(/<div id="app"([^>]*)><\/div>/, `<div id="app"$1>${prerendered}</div>`)

if (updated === original) {
  console.warn('prerender-home: <div id="app"></div> not found in dist/index.html — skipping injection')
  process.exit(0)
}

writeFileSync(DIST_INDEX, updated, 'utf8')

const articleCount = extractEnArticles().length
console.log('prerender-home: static landing page HTML injected into dist/index.html')
console.log(`  Sections: hero, features (3), process (3 steps), articles (${articleCount}), manifesto`)
