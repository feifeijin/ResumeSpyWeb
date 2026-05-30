<template>
  <div class="noir-legal-wrap">
    <div class="film-grain" aria-hidden="true" />
    <div class="legal-page">
      <div class="legal-inner">
        <router-link to="/" class="back-link">{{ t('legal.backToHome') }}</router-link>

        <header class="legal-header">
          <p class="legal-overline">{{ t('legal.overline') }}</p>
          <h1 class="legal-title">{{ t('legal.commercial.title') }}</h1>
          <p class="legal-updated">{{ t('legal.lastUpdated') }}</p>
        </header>

        <p class="legal-note">{{ t('legal.commercial.note') }}</p>

        <table class="legal-table">
          <tbody>
            <tr v-for="key in itemKeys" :key="key">
              <th>{{ t(`legal.commercial.items.${key}.label`) }}</th>
              <td>{{ t(`legal.commercial.items.${key}.value`) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'

const { t, locale } = useI18n()

const itemKeys = [
  'businessName',
  'operator',
  'email',
  'address',
  'service',
  'pricing',
  'payment',
  'paymentTiming',
  'delivery',
  'refund',
] as const

useSeo(() => ({
  title: `${t('legal.commercial.title')} — ResumeSpy`,
  description: t('legal.commercial.metaDesc'),
  canonicalPath: '/commercial-transactions',
  locale: locale.value,
}))
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
  overflow: hidden;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
}

.film-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.legal-page {
  position: relative;
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
  margin-bottom: 2rem;
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
  font-size: clamp(1.4rem, 4vw, 2rem);
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

.legal-note {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: var(--gold-dim);
  letter-spacing: 0.08em;
  margin-bottom: 2rem;
  font-style: italic;
}

.legal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.legal-table tr {
  border-bottom: 1px solid var(--border);
}

.legal-table tr:first-child {
  border-top: 1px solid var(--border);
}

.legal-table th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--gold-dim);
  font-weight: 500;
  text-align: left;
  padding: 1rem 1rem 1rem 0;
  width: 30%;
  vertical-align: top;
  white-space: nowrap;
}

.legal-table td {
  color: var(--muted);
  line-height: 1.7;
  padding: 1rem 0 1rem 1rem;
  vertical-align: top;
}

@media (max-width: 540px) {
  .legal-table th,
  .legal-table td {
    display: block;
    width: 100%;
    padding: 0.5rem 0;
  }

  .legal-table th {
    padding-top: 1rem;
    white-space: normal;
  }

  .legal-table td {
    padding-bottom: 1rem;
  }
}
</style>
