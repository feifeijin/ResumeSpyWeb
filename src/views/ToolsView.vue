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

        <!-- Tool list — every tool is still in development, so the cards are
             non-interactive placeholders rather than links to empty routes. -->
        <div class="tool-grid">
          <article
            v-for="tool in tools"
            :key="tool.key"
            class="tool-card"
            aria-disabled="true"
          >
            <div class="tool-plate" aria-hidden="true">
              <span class="plate-glyph">{{ tool.glyph }}</span>
            </div>
            <h2 class="card-title">{{ tool.name }}</h2>
            <p class="card-desc">{{ tool.desc }}</p>
            <span class="card-status">{{ t('tools.comingSoon') }}</span>
          </article>
        </div>
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
  },
  {
    key: 'resumeConvert',
    glyph: '◆',
    name: t('tools.resumeConvert.name'),
    desc: t('tools.resumeConvert.desc'),
  },
  {
    key: 'japaneseResume',
    glyph: '◇',
    name: t('tools.japaneseResume.name'),
    desc: t('tools.japaneseResume.desc'),
  },
])

useSeo(() => ({
  title: `${t('tools.title')} — ResumeSpy`,
  description: t('tools.metaDesc'),
  canonicalPath: '/tools',
  locale: locale.value,
}))
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
</style>
