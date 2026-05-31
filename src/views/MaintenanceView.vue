<template>
  <div class="noir-maintenance">
    <div class="film-grain" aria-hidden="true" />

    <div class="case-closed">
      <p class="overline">— {{ t('maintenance.label') }} —</p>
      <h1 class="title">{{ t('maintenance.title') }}</h1>
      <p class="subtitle">{{ t('maintenance.subtitle') }}</p>
      <p class="desc">{{ t('maintenance.description') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()

useSeo(() => ({
  title: `${t('maintenance.title')} — ResumeSpy`,
  description: t('maintenance.description'),
  robots: 'noindex,nofollow',
  localized: false,
}))
</script>

<style scoped>
.noir-maintenance {
  --bg: #fafafa;
  --border: #d4d4d4;
  --text: #121212;
  --muted: #666666;
  --gold-dim: #888888;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
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

.case-closed {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 3rem 2rem;
  max-width: 540px;
}

.overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  color: var(--gold-dim);
  margin-bottom: 1.5rem;
}

.title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  line-height: 1.05;
  margin-bottom: 1rem;
}

.subtitle {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.desc {
  font-style: italic;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.7;
  border-left: 2px solid var(--border);
  padding-left: 1rem;
  text-align: left;
}
</style>
