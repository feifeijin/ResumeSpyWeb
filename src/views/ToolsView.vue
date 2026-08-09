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

        <!-- Introduction -->
        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.intro.heading') }}</h2>
          <div class="prose">
            <p>{{ t('tools.intro.p1') }}</p>
            <p>{{ t('tools.intro.p2') }}</p>
            <p>{{ t('tools.intro.p3') }}</p>
          </div>
        </section>

        <!-- Tool list — every tool is still in development, so the cards stay
             informational: the only links they carry point at parts of
             ResumeSpy that exist today. -->
        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.toolsHeading') }}</h2>
          <p class="section-intro">{{ t('tools.toolsIntro') }}</p>

          <div class="tool-grid">
            <article v-for="tool in tools" :key="tool.key" class="tool-card">
              <div class="tool-plate" aria-hidden="true">
                <span class="plate-glyph">{{ tool.glyph }}</span>
              </div>
              <span class="card-status">{{ t('tools.comingSoon') }}</span>
              <h3 class="card-title">{{ tool.name }}</h3>
              <p class="card-desc">{{ tool.desc }}</p>
              <p class="card-body">{{ tool.body }}</p>
              <p class="card-who">
                <span class="card-label">{{ t('tools.whoLabel') }}</span> {{ tool.who }}
              </p>
              <p class="card-meantime">
                <span class="meantime-label">{{ t('tools.meantimeLabel') }}</span>
                <router-link :to="tool.linkTo" class="inline-link">
                  {{ tool.linkText }} →
                </router-link>
              </p>
            </article>
          </div>
        </section>

        <!-- Where the toolkit sits in an actual job search -->
        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.workflow.heading') }}</h2>
          <p class="section-intro">{{ t('tools.workflow.intro') }}</p>

          <div class="stage-grid">
            <article v-for="stage in stages" :key="stage.key" class="stage">
              <h3 class="stage-title">{{ stage.heading }}</h3>
              <p class="stage-body">{{ stage.body }}</p>
              <router-link :to="stage.linkTo" class="inline-link">
                {{ stage.linkText }} →
              </router-link>
            </article>
          </div>
        </section>

        <!-- FAQ — rendered as plain text rather than an accordion so the
             answers are readable without interaction. -->
        <section class="tools-section">
          <h2 class="section-heading">{{ t('tools.faq.heading') }}</h2>
          <div class="faq-list">
            <div v-for="(item, i) in faqs" :key="i" class="faq-entry">
              <h3 class="faq-q">{{ item.q }}</h3>
              <p class="faq-a">{{ item.a }}</p>
            </div>
          </div>
        </section>

        <!-- Onward links -->
        <section class="tools-section tools-section-last">
          <h2 class="section-heading">{{ t('tools.next.heading') }}</h2>
          <ul class="next-list">
            <li v-for="link in nextLinks" :key="link.to">
              <router-link :to="link.to" class="inline-link">{{ link.label }} →</router-link>
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

const { t, locale } = useI18n()

const tools = computed(() => [
  {
    key: 'careerWorld',
    glyph: '◈',
    name: t('tools.careerWorld.name'),
    desc: t('tools.careerWorld.desc'),
    body: t('tools.careerWorld.body'),
    who: t('tools.careerWorld.who'),
    linkText: t('tools.careerWorld.linkText'),
    linkTo: '/articles',
  },
  {
    key: 'resumeConvert',
    glyph: '◆',
    name: t('tools.resumeConvert.name'),
    desc: t('tools.resumeConvert.desc'),
    body: t('tools.resumeConvert.body'),
    who: t('tools.resumeConvert.who'),
    linkText: t('tools.resumeConvert.linkText'),
    linkTo: '/myspy',
  },
  {
    key: 'japaneseResume',
    glyph: '◇',
    name: t('tools.japaneseResume.name'),
    desc: t('tools.japaneseResume.desc'),
    body: t('tools.japaneseResume.body'),
    who: t('tools.japaneseResume.who'),
    linkText: t('tools.japaneseResume.linkText'),
    linkTo: '/create',
  },
])

const stages = computed(() => [
  {
    key: 'create',
    heading: t('tools.workflow.createHeading'),
    body: t('tools.workflow.createBody'),
    linkText: t('tools.workflow.createLink'),
    linkTo: '/create',
  },
  {
    key: 'analysis',
    heading: t('tools.workflow.analysisHeading'),
    body: t('tools.workflow.analysisBody'),
    linkText: t('tools.workflow.analysisLink'),
    linkTo: '/faq',
  },
  {
    key: 'apply',
    heading: t('tools.workflow.applyHeading'),
    body: t('tools.workflow.applyBody'),
    linkText: t('tools.workflow.applyLink'),
    linkTo: '/myspy',
  },
  {
    key: 'growth',
    heading: t('tools.workflow.growthHeading'),
    body: t('tools.workflow.growthBody'),
    linkText: t('tools.workflow.growthLink'),
    linkTo: '/articles',
  },
])

const faqs = computed(() => [
  { q: t('tools.faq.q1'), a: t('tools.faq.a1') },
  { q: t('tools.faq.q2'), a: t('tools.faq.a2') },
  { q: t('tools.faq.q3'), a: t('tools.faq.a3') },
  { q: t('tools.faq.q4'), a: t('tools.faq.a4') },
  { q: t('tools.faq.q5'), a: t('tools.faq.a5') },
])

const nextLinks = computed(() => [
  { to: '/', label: t('tools.next.homeLink') },
  { to: '/create', label: t('tools.next.createLink') },
  { to: '/myspy', label: t('tools.next.myspyLink') },
  { to: '/articles', label: t('tools.next.articlesLink') },
  { to: '/faq', label: t('tools.next.faqLink') },
])

useSeo(() => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.value.map((it) => ({
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
  margin-bottom: 3.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
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
  max-width: 620px;
  margin: 0 auto;
}

/* ── Sections ─────────────────────────────────────────────── */
.tools-section {
  margin-bottom: 4rem;
}

.tools-section-last {
  margin-bottom: 0;
}

.section-heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.08em;
  margin: 0 0 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.section-intro {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.85;
  max-width: 70ch;
  margin: 0 0 2rem;
}

.prose p {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.9;
  max-width: 70ch;
  margin: 0 0 1.15rem;
}
.prose p:last-child { margin-bottom: 0; }

/* ── Links ────────────────────────────────────────────────── */
.inline-link {
  font-size: 0.85rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--gold-dim);
  transition: color 0.2s, border-color 0.2s;
}
.inline-link:hover {
  color: var(--gold-dim);
  border-color: var(--text);
}

/* ── Tool cards ───────────────────────────────────────────── */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
.card-who {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.8;
  margin: 0;
}

.card-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-dim);
}

.meantime-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--gold-dim);
}

.card-meantime {
  margin: auto 0 0;
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: flex-start;
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
}

/* ── Job-search stages ────────────────────────────────────── */
.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem 2.5rem;
}

.stage {
  border-left: 1.5px solid var(--border);
  padding-left: 1.25rem;
}

.stage-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.04em;
  margin: 0 0 0.6rem;
}

.stage-body {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.85;
  margin: 0 0 0.75rem;
}

/* ── FAQ ──────────────────────────────────────────────────── */
.faq-entry {
  border-bottom: 1px solid var(--border);
  padding: 0 0 1.25rem;
  margin-bottom: 1.25rem;
  max-width: 70ch;
}
.faq-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.faq-q {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.02em;
  margin: 0 0 0.5rem;
}

.faq-a {
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.85;
  margin: 0;
}

/* ── Onward links ─────────────────────────────────────────── */
.next-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  align-items: flex-start;
}
</style>
