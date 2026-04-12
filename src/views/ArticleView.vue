<template>
  <div class="noir-article-wrap">
    <div class="film-grain" aria-hidden="true" />

    <!-- Loading -->
    <div v-if="!article" class="article-loading">
      <span class="loading-dots"><span /><span /><span /></span>
    </div>

    <!-- Not Found -->
    <div v-else-if="article.notFound" class="article-notfound">
      <p class="nf-overline">{{ t('articles.notFoundLabel') }}</p>
      <h1 class="nf-title">{{ t('articles.notFoundTitle') }}</h1>
      <p class="nf-desc">{{ t('articles.notFound') }}</p>
      <router-link to="/" class="btn-ghost">← {{ t('articles.backToArticles') }}</router-link>
    </div>

    <!-- Article -->
    <div v-else class="article-page">
      <div class="article-inner">

        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <router-link to="/">{{ t('navigation.home') }}</router-link>
          <span class="breadcrumb-sep">›</span>
          <span>{{ t('articles.backToArticles') }}</span>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">{{ article.title }}</span>
        </nav>

        <router-link to="/" class="back-link">← {{ t('articles.backToArticles') }}</router-link>

        <article>
          <header class="article-header">
            <p class="article-overline">{{ t('articles.readingRoom') }}</p>
            <h1 class="article-title">{{ article.title }}</h1>

            <!-- Meta row: author · date · read time -->
            <div class="article-meta">
              <span class="meta-author">{{ article.author }}</span>
              <span class="meta-sep">·</span>
              <time :datetime="article.date">{{ formatDate(article.date) }}</time>
              <span class="meta-sep">·</span>
              <span>{{ article.readTime }} {{ t('articles.minRead') }}</span>
            </div>

            <div class="article-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <!-- Excerpt / summary -->
            <p class="article-excerpt">{{ article.excerpt }}</p>
          </header>

          <!-- Table of Contents (auto-shown for articles > 800 words) -->
          <nav v-if="toc.length" class="article-toc" aria-label="Table of contents">
            <p class="toc-title">{{ t('articles.contents') }}</p>
            <ol>
              <li
                v-for="item in toc"
                :key="item.id"
                :class="{ 'toc-h3': item.level === 3 }"
              >
                <a :href="`#${item.id}`">{{ item.text }}</a>
              </li>
            </ol>
          </nav>

          <div class="article-body" v-html="article.content" />
        </article>

        <div class="article-footer-divider">
          <span /><span class="glyph">✦</span><span />
        </div>

        <router-link to="/" class="btn-ghost">← {{ t('articles.backToArticles') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleContent } from '@/composables/useArticleContent'
import { getArticleMetaBySlug } from '@/articles/articles'

const { t, locale } = useI18n()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getArticleBySlug } = useArticleContent()

interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  author: string
  date: string
  readTime: number
  metaDescription: string
}

interface ArticleWithContent extends ArticleMeta {
  content: string
  notFound: false
}

interface ArticleNotFound {
  notFound: true
}

type ArticleData = ArticleWithContent | ArticleNotFound

const articleMeta = computed<ArticleMeta | undefined>(() =>
  getArticleMetaBySlug(slug.value, locale.value),
)

const articleContent = computed(() => getArticleBySlug(slug.value))

// ── Inject heading IDs and build TOC in one pass ──────────────────────────
interface TocItem { id: string; text: string; level: number }

interface ProcessedContent {
  html: string
  toc: TocItem[]
  wordCount: number
}

function processContent(raw: string): ProcessedContent {
  const parser = new DOMParser()
  const doc = parser.parseFromString(raw, 'text/html')
  const headings = Array.from(doc.querySelectorAll('h2, h3'))
  const toc: TocItem[] = []

  headings.forEach((h, i) => {
    const id = `section-${i}`
    h.id = id
    toc.push({ id, text: h.textContent ?? '', level: parseInt(h.tagName[1]) })
  })

  const wordCount = doc.body.textContent?.trim().split(/\s+/).length ?? 0
  return { html: doc.body.innerHTML, toc, wordCount }
}

const processed = computed<ProcessedContent | null>(() => {
  const raw = articleContent.value
  if (!raw) return null
  return processContent(raw)
})

const article = computed<ArticleData | null>(() => {
  const meta = articleMeta.value
  if (!meta) return { notFound: true }
  const p = processed.value
  if (!p) return { notFound: true }
  return { ...meta, content: p.html, notFound: false }
})

const toc = computed<TocItem[]>(() => {
  const p = processed.value
  if (!p || p.wordCount < 800) return []
  return p.toc
})

// ── SEO: dynamic <title>, <meta description>, Schema.org JSON-LD ──────────
let injectedMeta: HTMLMetaElement | null = null
let injectedJsonLd: HTMLScriptElement | null = null

function injectSeo(a: ArticleWithContent) {
  document.title = `${a.title} — ResumeSpy`

  // meta description
  injectedMeta?.remove()
  injectedMeta = document.createElement('meta')
  injectedMeta.setAttribute('name', 'description')
  injectedMeta.setAttribute('content', a.metaDescription)
  document.head.appendChild(injectedMeta)

  // Schema.org Article JSON-LD
  injectedJsonLd?.remove()
  injectedJsonLd = document.createElement('script')
  injectedJsonLd.type = 'application/ld+json'
  injectedJsonLd.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.metaDescription,
    author: { '@type': 'Organization', name: a.author },
    datePublished: a.date,
    publisher: {
      '@type': 'Organization',
      name: 'ResumeSpy',
      logo: { '@type': 'ImageObject', url: `${window.location.origin}/favicon.ico` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': window.location.href },
  })
  document.head.appendChild(injectedJsonLd)
}

function cleanupSeo() {
  document.title = 'ResumeSpy — Your Dossier. Your Story.'
  injectedMeta?.remove()
  injectedJsonLd?.remove()
  injectedMeta = null
  injectedJsonLd = null
}

watch(
  article,
  (a) => {
    if (a && !(a as ArticleNotFound).notFound) injectSeo(a as ArticleWithContent)
    else cleanupSeo()
  },
  { immediate: true },
)

onUnmounted(cleanupSeo)

// ── Formatted date ────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>

<style scoped>
.noir-article-wrap {
  --bg:       #FAFAFA;
  --surface:  #F0F0F0;
  --border:   #D4D4D4;
  --text:     #121212;
  --muted:    #666666;
  --gold:     #121212;
  --gold-dim: #888888;
  --ink:      #FFFFFF;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
}

.film-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.4;
  mix-blend-mode: overlay;
}

/* ── Loading ─────────────────────────────────────────────── */
.article-loading {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: var(--muted);
  border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50%       { opacity: 1;   transform: scale(1.1); }
}

/* ── Not Found ───────────────────────────────────────────── */
.article-notfound {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 1rem;
  padding: 2rem;
}

.nf-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--gold-dim);
  letter-spacing: 0.25em;
}

.nf-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 2rem;
  color: var(--text);
  letter-spacing: 0.15em;
}

.nf-desc {
  font-style: italic;
  color: var(--muted);
}

/* ── Article Page ────────────────────────────────────────── */
.article-page {
  position: relative;
  z-index: 10;
  padding: 3rem 2rem 6rem;
}

.article-inner {
  max-width: 720px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  color: var(--muted);
  text-decoration: none;
  margin-bottom: 3rem;
  transition: color 0.2s;
}

.back-link:hover { color: var(--gold); }

/* ── Breadcrumb ──────────────────────────────────────────── */
.breadcrumb {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}
.breadcrumb a { color: var(--muted); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: var(--gold); }
.breadcrumb-sep { color: var(--gold-dim); }
.breadcrumb-current { color: var(--gold-dim); }

/* ── Article Header ──────────────────────────────────────── */
.article-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.article-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--gold-dim);
  letter-spacing: 0.25em;
  margin-bottom: 1rem;
}

.article-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.05em;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.article-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  margin-bottom: 1.25rem;
}
.meta-sep { color: var(--gold-dim); }

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--gold-dim);
  border: 1px solid var(--border);
  padding: 0.2rem 0.65rem;
}

.article-excerpt {
  font-family: 'Inter', system-ui, sans-serif;
  font-style: italic;
  font-size: 1rem;
  color: var(--muted);
  line-height: 1.7;
  border-left: 2px solid var(--gold-dim);
  padding-left: 1rem;
  margin: 0;
}

/* ── Table of Contents ───────────────────────────────────── */
.article-toc {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.5rem 1.75rem;
  margin-bottom: 2.5rem;
}
.toc-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--gold-dim);
  margin-bottom: 1rem;
}
.article-toc ol { list-style: decimal; padding-left: 1.25rem; margin: 0; }
.article-toc li {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.9rem;
  color: var(--muted);
  margin-bottom: 0.4rem;
}
.article-toc li.toc-h3 { padding-left: 1rem; font-size: 0.85rem; }
.article-toc a { color: var(--muted); text-decoration: none; transition: color 0.2s; }
.article-toc a:hover { color: var(--gold); }

/* ── Article Body ────────────────────────────────────────── */
.article-body {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--text);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4) {
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text);
  letter-spacing: 0.08em;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.article-body :deep(h1) { font-size: 1.8rem; }
.article-body :deep(h2) { font-size: 1.4rem; }
.article-body :deep(h3) { font-size: 1.15rem; }

.article-body :deep(p) { margin-bottom: 1.25rem; }

.article-body :deep(blockquote) {
  border-left: 2px solid var(--gold-dim);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--muted);
}

.article-body :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85em;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 0.15em 0.4em;
  color: var(--gold);
}

.article-body :deep(pre) {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.25rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.article-body :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.article-body :deep(li) {
  margin-bottom: 0.4rem;
  color: var(--text);
}

.article-body :deep(a) {
  color: var(--gold);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-body :deep(strong) { color: var(--text); font-weight: 600; }

/* ── Divider ─────────────────────────────────────────────── */
.article-footer-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0 2rem;
}

.article-footer-divider span:not(.glyph) {
  flex: 1;
  display: block;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border), transparent);
}

.glyph {
  font-size: 0.65rem;
  color: var(--gold-dim);
}

/* ── Buttons ─────────────────────────────────────────────── */
.btn-ghost {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  color: var(--muted);
  background: transparent;
  border: 1.5px solid var(--border);
  padding: 0.7rem 1.6rem;
  cursor: pointer;
  text-decoration: none;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: border-color 0.3s, color 0.3s;
}

.btn-ghost:hover {
  border-color: #888888;
  color: var(--text);
}
</style>
