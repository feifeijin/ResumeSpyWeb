<template>
  <div class="noir-legal-wrap">
    <div class="film-grain" aria-hidden="true" />
    <div class="legal-page">
      <div class="legal-inner">
        <router-link to="/" class="back-link">{{ t('legal.backToHome') }}</router-link>

        <header class="legal-header">
          <p class="legal-overline">{{ t('legal.overline') }}</p>
          <h1 class="legal-title">{{ t('legal.terms.title') }}</h1>
          <p class="legal-updated">{{ t('legal.lastUpdated') }}</p>
        </header>

        <section v-for="key in sections" :key="key" class="legal-section">
          <h2 class="section-heading">{{ t(`legal.terms.${key}.heading`) }}</h2>
          <p class="section-body">{{ t(`legal.terms.${key}.body`) }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sections = ['service', 'responsibilities', 'ip', 'disclaimer', 'interruption', 'liability', 'law'] as const

let metaEl: HTMLMetaElement | null = null

onMounted(() => {
  document.title = `${t('legal.terms.title')} — ResumeSpy`
  metaEl = document.createElement('meta')
  metaEl.setAttribute('name', 'description')
  metaEl.setAttribute('content', t('legal.terms.metaDesc'))
  document.head.appendChild(metaEl)
})

onUnmounted(() => {
  document.title = 'ResumeSpy — Your Dossier. Your Story.'
  metaEl?.remove()
  metaEl = null
})
</script>

<style scoped>
.noir-legal-wrap {
  --bg:       #FAFAFA;
  --surface:  #F0F0F0;
  --border:   #D4D4D4;
  --text:     #121212;
  --muted:    #666666;
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

.legal-page {
  position: relative;
  z-index: 10;
  padding: 3rem 2rem 6rem;
}

.legal-inner {
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

.back-link:hover { color: var(--text); }

.legal-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.legal-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--gold-dim);
  letter-spacing: 0.25em;
  margin-bottom: 1rem;
}

.legal-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.05em;
  line-height: 1.3;
  margin-bottom: 0.75rem;
}

.legal-updated {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: var(--gold-dim);
  letter-spacing: 0.12em;
}

.legal-section {
  margin-bottom: 2.5rem;
}

.section-heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.06em;
  margin-bottom: 0.75rem;
}

.section-body {
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--muted);
}
</style>
