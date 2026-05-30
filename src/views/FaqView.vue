<template>
  <div class="noir-faq">
    <div class="film-grain" aria-hidden="true" />

    <div class="faq-page">
      <div class="faq-inner">
        <nav class="breadcrumb" aria-label="breadcrumb">
          <router-link to="/">{{ t('navigation.home') }}</router-link>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">{{ t('faq.title') }}</span>
        </nav>

        <header class="faq-header">
          <p class="faq-overline">{{ t('faq.overline') }}</p>
          <h1 class="faq-title">{{ t('faq.title') }}</h1>
          <p class="faq-subtitle">{{ t('faq.subtitle') }}</p>
        </header>

        <section
          v-for="(item, i) in items"
          :key="i"
          class="faq-item"
          :class="{ open: openIndex === i }"
        >
          <button
            class="faq-question"
            :aria-expanded="openIndex === i"
            @click="toggle(i)"
          >
            <span>{{ item.q }}</span>
            <span class="faq-toggle" aria-hidden="true">{{ openIndex === i ? '−' : '+' }}</span>
          </button>
          <div v-show="openIndex === i" class="faq-answer">
            <p>{{ item.a }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'

const { t, locale, tm } = useI18n()

interface FaqItem {
  q: string
  a: string
}

const items = computed<FaqItem[]>(() => {
  const raw = tm('faq.items') as unknown
  if (!Array.isArray(raw)) return []
  return raw as FaqItem[]
})

const openIndex = ref<number | null>(0)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

useSeo(() => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.value.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return {
    title: `${t('faq.title')} — ResumeSpy`,
    description: t('faq.metaDesc'),
    canonicalPath: '/faq',
    locale: locale.value,
    jsonLd: [faqSchema],
  }
})
</script>

<style scoped>
.noir-faq {
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

.faq-page {
  position: relative;
  z-index: 10;
  padding: 3rem 2rem 6rem;
}

.faq-inner {
  max-width: 760px;
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

.faq-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.faq-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: var(--gold-dim);
  letter-spacing: 0.28em;
  margin-bottom: 1rem;
}

.faq-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.1em;
  margin: 0 0 0.75rem;
}

.faq-subtitle {
  font-style: italic;
  color: var(--muted);
  font-size: 1rem;
  max-width: 560px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid var(--border);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.02em;
  transition: color 0.2s;
}

.faq-question:hover { color: var(--gold-dim); }

.faq-toggle {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.1rem;
  color: var(--gold-dim);
  flex-shrink: 0;
}

.faq-answer {
  padding: 0 0 1.25rem;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.8;
}

.faq-answer p { margin: 0; }
</style>
