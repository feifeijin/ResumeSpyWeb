<template>
  <div class="noir-tools">
    <div class="film-grain" aria-hidden="true" />

    <div class="tools-page">
      <div class="tools-inner">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <router-link to="/">{{ t('navigation.home') }}</router-link>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">{{ t('navigation.tools') }}</span>
        </nav>

        <header class="tools-header">
          <p class="tools-overline">{{ t('tools.overline') }}</p>
          <h1 class="tools-title">{{ t('tools.title') }}</h1>
          <p class="tools-subtitle">{{ t('tools.subtitle') }}</p>
        </header>

        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.intro.heading') }}</h2>
          <p class="section-body">{{ t('tools.intro.p1') }}</p>
          <p class="section-body">{{ t('tools.intro.p2') }}</p>
        </section>

        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.toolsSection.heading') }}</h2>
          <p class="section-lede">{{ t('tools.toolsSection.lede') }}</p>

          <!-- Every tool is still in development, so the cards stay
               non-interactive rather than linking to routes that do not exist.
               The only links inside a card point at pages that are live. -->
          <div class="tool-grid">
            <article v-for="tool in tools" :key="tool.key" class="tool-card">
              <div class="tool-plate" aria-hidden="true">
                <span class="plate-glyph">{{ tool.glyph }}</span>
              </div>
              <h3 class="card-title">{{ tool.name }}</h3>
              <p class="card-desc">{{ tool.desc }}</p>
              <p class="card-body">{{ tool.body }}</p>
              <p class="card-audience">
                <span class="card-label">{{ t('tools.audienceLabel') }}</span>
                {{ tool.audience }}
              </p>
              <p class="card-meanwhile">
                {{ tool.meanwhile }}
                <router-link :to="tool.to">{{ tool.linkLabel }}</router-link>
              </p>
              <span class="card-status">{{ t('tools.comingSoon') }}</span>
            </article>
          </div>
        </section>

        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.workflow.heading') }}</h2>
          <p class="section-lede">{{ t('tools.workflow.lede') }}</p>
          <div class="step-list">
            <div v-for="step in workflow" :key="step.key" class="step">
              <h3 class="step-heading">{{ step.heading }}</h3>
              <p class="section-body">{{ step.body }}</p>
            </div>
          </div>
        </section>

        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.faq.heading') }}</h2>
          <div class="faq-list">
            <div v-for="(item, i) in faqItems" :key="i" class="faq-entry">
              <h3 class="faq-q">{{ item.q }}</h3>
              <p class="faq-a">{{ item.a }}</p>
            </div>
          </div>
        </section>

        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.explore.heading') }}</h2>
          <p class="section-lede">{{ t('tools.explore.lede') }}</p>
          <ul class="link-list">
            <li v-for="link in exploreLinks" :key="link.to" class="link-item">
              <router-link class="link-label" :to="link.to">{{ link.label }}</router-link>
              <p class="link-desc">{{ link.desc }}</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'

const { t, locale, tm } = useI18n()

/** Every `to` below is a route declared in src/router/index.ts — the tools
 *  themselves have no route yet, so nothing here points at one. */
const tools = computed(() => [
  {
    key: 'careerWorld',
    glyph: '◈',
    name: t('tools.careerWorld.name'),
    desc: t('tools.careerWorld.desc'),
    body: t('tools.careerWorld.body'),
    audience: t('tools.careerWorld.audience'),
    meanwhile: t('tools.careerWorld.meanwhile'),
    linkLabel: t('tools.careerWorld.linkLabel'),
    to: '/articles',
  },
  {
    key: 'resumeConvert',
    glyph: '◆',
    name: t('tools.resumeConvert.name'),
    desc: t('tools.resumeConvert.desc'),
    body: t('tools.resumeConvert.body'),
    audience: t('tools.resumeConvert.audience'),
    meanwhile: t('tools.resumeConvert.meanwhile'),
    linkLabel: t('tools.resumeConvert.linkLabel'),
    to: '/create',
  },
  {
    key: 'japaneseResume',
    glyph: '◇',
    name: t('tools.japaneseResume.name'),
    desc: t('tools.japaneseResume.desc'),
    body: t('tools.japaneseResume.body'),
    audience: t('tools.japaneseResume.audience'),
    meanwhile: t('tools.japaneseResume.meanwhile'),
    linkLabel: t('tools.japaneseResume.linkLabel'),
    to: '/faq',
  },
])

const workflow = computed(() =>
  ['write', 'analyse', 'apply'].map((key) => ({
    key,
    heading: t(`tools.workflow.${key}.heading`),
    body: t(`tools.workflow.${key}.body`),
  })),
)

interface FaqItem {
  q: string
  a: string
}

const faqItems = computed<FaqItem[]>(() => {
  const raw = tm('tools.faq.items') as unknown
  if (!Array.isArray(raw)) return []
  return raw as FaqItem[]
})

const exploreLinks = computed(() =>
  (['create', 'myspy', 'articles', 'faq', 'home'] as const).map((key) => ({
    to: key === 'home' ? '/' : `/${key}`,
    label: t(`tools.explore.${key}.label`),
    desc: t(`tools.explore.${key}.desc`),
  })),
)

useSeo(() => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.value.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return {
    title: `${t('tools.title')} — ResumeSpy`,
    description: t('tools.metaDesc'),
    canonicalPath: '/tools',
    locale: locale.value,
    jsonLd: [faqSchema],
  }
})
</script>

<style scoped>
.noir-tools {
  --bg: #fafafa;
  --surface: #f0f0f0;
  --border: #d4d4d4;
  --text: #121212;
  --muted: #666666;
  --gold-dim: #888888;

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

.tools-page {
  position: relative;
  z-index: 10;
  padding: 3rem 2rem 6rem;
}

.tools-inner {
  max-width: 1100px;
  margin: 0 auto;
}

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
.breadcrumb a:hover { color: var(--text); }
.breadcrumb-sep { color: var(--gold-dim); }
.breadcrumb-current { color: var(--gold-dim); }

.tools-header {
  text-align: center;
  margin-bottom: 3rem;
}

.tools-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: var(--gold-dim);
  letter-spacing: 0.28em;
  margin-bottom: 1rem;
}

.tools-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.1em;
  margin: 0 0 0.75rem;
}

.tools-subtitle {
  font-style: italic;
  color: var(--muted);
  font-size: 1rem;
  max-width: 580px;
  margin: 0 auto;
}

.tools-section {
  margin-bottom: 3.5rem;
}
.tools-section:last-child { margin-bottom: 0; }

.section-heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.15rem, 2.2vw, 1.45rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.06em;
  margin: 0 0 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border);
}

.section-lede {
  font-style: italic;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 1.75rem;
}

.section-body {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.85;
  margin: 0 0 1rem;
}
.section-body:last-child { margin-bottom: 0; }

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  padding: 1.5rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 4px 4px 0 #aaa;
  opacity: 0.85;
}

/* Rectangular image placeholder — a blank contact sheet until the real
   artwork lands. */
.tool-plate {
  aspect-ratio: 16 / 10;
  border: 1px dashed var(--border);
  background-color: #e6e6e6;
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0 10px,
    rgba(0, 0, 0, 0.035) 10px 20px
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.plate-glyph {
  font-size: 1.8rem;
  color: var(--gold-dim);
}

.card-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.04em;
  margin: 0;
  line-height: 1.4;
}

.card-desc {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--muted);
  line-height: 1.65;
  margin: 0;
}

.card-body,
.card-audience {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.75;
  margin: 0;
}

.card-label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-dim);
  margin-bottom: 0.2rem;
}

.card-meanwhile {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.75;
  margin: 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border);
}

.card-status {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-dim);
  border: 1px solid var(--border);
  padding: 0.15rem 0.5rem;
  align-self: flex-start;
  margin-top: auto;
}

.step-list {
  display: grid;
  gap: 1.75rem;
}

.step-heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.03em;
  margin: 0 0 0.5rem;
}

.faq-entry {
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--border);
}
.faq-entry:first-child { padding-top: 0; }

.faq-q {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.02em;
  margin: 0 0 0.5rem;
}

.faq-a {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.8;
  margin: 0;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.link-item {
  border-left: 2px solid var(--border);
  padding-left: 0.9rem;
}

.link-desc {
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.7;
  margin: 0.4rem 0 0;
}

.card-meanwhile a,
.link-label {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--gold-dim);
  transition: color 0.2s;
}

.card-meanwhile a:hover,
.link-label:hover { color: var(--gold-dim); }

.link-label { font-size: 0.95rem; }
</style>
