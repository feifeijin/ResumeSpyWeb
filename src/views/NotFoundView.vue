<template>
  <div class="noir-404">
    <div class="film-grain" aria-hidden="true" />

    <div class="case-closed">
      <p class="overline">— {{ t('notFound.label') }} —</p>
      <h1 class="title">{{ t('notFound.title') }}</h1>
      <p class="subtitle">{{ t('notFound.subtitle') }}</p>

      <div class="flipbook" aria-hidden="true">
        <img :src="frame0" class="frame f0" alt="" />
        <img :src="frame1" class="frame f1" alt="" />
        <img :src="frame2" class="frame f2" alt="" />
      </div>

      <div class="actions">
        <router-link to="/" class="btn-ink">{{ t('notFound.goHome') }}</router-link>
        <router-link to="/myspy" v-if="isAuthenticated" class="btn-ghost">
          {{ t('notFound.goMyspy') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useSeo } from '@/composables/useSeo'
import frame0 from '@/assets/duskhotelBradly00.png'
import frame1 from '@/assets/duskhotelBradly01.png'
import frame2 from '@/assets/duskhotelBradly02.png'

const { t } = useI18n()
const { isAuthenticated } = storeToRefs(useAuthStore())

useSeo(() => ({
  title: `${t('notFound.title')} — ResumeSpy`,
  description: t('notFound.description'),
  robots: 'noindex,follow',
  localized: false,
}))
</script>

<style scoped>
.noir-404 {
  --bg:       #FAFAFA;
  --border:   #D4D4D4;
  --text:     #121212;
  --muted:    #666666;
  --gold-dim: #888888;
  --ink:      #FFFFFF;

  position: relative;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
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
  padding: 1.5rem 2rem;
  max-width: 540px;
}

.overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  color: var(--gold-dim);
  margin-bottom: 1rem;
}

.title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(3.5rem, 12vw, 7rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  line-height: 1;
  margin-bottom: 0.75rem;
}

.subtitle {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.flipbook {
  position: relative;
  /* Keep the 3:4 frame ratio while shrinking on short viewports. */
  height: min(256px, 32vh);
  aspect-ratio: 3 / 4;
  margin: 0 auto 1.5rem;
}

.frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  filter: grayscale(1) contrast(1.05);
  mix-blend-mode: multiply;
  /* Hand-drawn flipbook: hard cuts between frames, ping-pong loop
     (0 → 1 → 2 → 1 → …) so the reaching motion never jumps. */
  animation: flip 2s steps(1, end) infinite;
}

.f0 {
  animation-name: f0;
}
.f1 {
  animation-name: f1;
}
.f2 {
  animation-name: f2;
}

/* Cycle is split into 4 equal phases: [0]→[1]→[2]→[1] */
@keyframes f0 {
  0%,
  24.9% {
    opacity: 1;
  }
  25%,
  100% {
    opacity: 0;
  }
}

@keyframes f1 {
  0%,
  24.9% {
    opacity: 0;
  }
  25%,
  49.9% {
    opacity: 1;
  }
  50%,
  74.9% {
    opacity: 0;
  }
  75%,
  100% {
    opacity: 1;
  }
}

@keyframes f2 {
  0%,
  49.9% {
    opacity: 0;
  }
  50%,
  74.9% {
    opacity: 1;
  }
  75%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .frame {
    animation: none;
  }
  /* Hold the final reaching-hand frame for users who opt out of motion. */
  .f2 {
    opacity: 1;
  }
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

.btn-ink:hover {
  background: #2B2B2B;
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
  transition: border-color 0.25s, color 0.25s;
}

.btn-ghost:hover {
  border-color: #888888;
  color: var(--text);
}
</style>
