<template>
  <div class="noir-503">
    <div class="film-grain" aria-hidden="true" />

    <div class="case-closed">
      <p class="overline">— {{ t('serviceUnavailable.label') }} —</p>
      <h1 class="title">{{ t('serviceUnavailable.title') }}</h1>
      <p class="subtitle">{{ t('serviceUnavailable.subtitle') }}</p>
      <p class="desc">{{ t('serviceUnavailable.description') }}</p>

      <div class="actions">
        <button type="button" class="btn-ink" :disabled="retrying" @click="handleRetry">
          {{ retrying ? t('serviceUnavailable.retrying') : t('serviceUnavailable.retry') }}
        </button>
        <router-link to="/" class="btn-ghost">{{ t('serviceUnavailable.goHome') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServiceStatusStore } from '@/stores/serviceStatus'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
const serviceStatus = useServiceStatusStore()
const retrying = ref(false)

useSeo(() => ({
  title: `${t('serviceUnavailable.title')} — ResumeSpy`,
  description: t('serviceUnavailable.description'),
  robots: 'noindex,follow',
  localized: false,
}))

const handleRetry = () => {
  retrying.value = true
  serviceStatus.markApiUp()
  // Force a fresh load so any in-flight stores reinitialize against the API.
  window.location.reload()
}
</script>

<style scoped>
.noir-503 {
  --bg: #fafafa;
  --border: #d4d4d4;
  --text: #121212;
  --muted: #666666;
  --gold-dim: #888888;
  --ink: #ffffff;

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
  margin-bottom: 2.5rem;
  text-align: left;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-ink {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  color: var(--ink);
  background: var(--text);
  border: none;
  padding: 0.75rem 2rem;
  cursor: pointer;
  text-decoration: none;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.25s;
}

.btn-ink:hover:not(:disabled) {
  background: #2b2b2b;
}

.btn-ink:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  color: var(--muted);
  background: transparent;
  border: 1.5px solid var(--border);
  padding: 0.75rem 2rem;
  cursor: pointer;
  text-decoration: none;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition:
    border-color 0.25s,
    color 0.25s;
}

.btn-ghost:hover {
  border-color: #888888;
  color: var(--text);
}
</style>
