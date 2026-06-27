<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="loadingStore.isGlobalLoading" class="noir-overlay" role="status" aria-live="polite">
        <!-- Film grain -->
        <div class="grain" aria-hidden="true" />

        <div class="detective-stage">
          <!-- Detective portrait -->
          <div class="detective-frame">
            <img
              class="detective-img"
              :src="detectiveImg"
              alt=""
              aria-hidden="true"
            />
          </div>

          <!-- Loading message -->
          <div class="detective-msg">
            <span class="msg-glyph">✦</span>
            <span class="msg-text">{{ currentMessage || t('loading.processing') }}</span>
            <span class="msg-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>

          <!-- Subline -->
          <p class="detective-sub">{{ t('common.pleaseWait') }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoadingStore } from '@/stores/loading'
import detectiveImg from '@/assets/loading-detective.png'

const { t } = useI18n()
const loadingStore = useLoadingStore()

const currentMessage = computed(() => loadingStore.currentLoadingState?.message)

defineOptions({ name: 'GlobalLoadingOverlay' })
</script>

<style scoped>
/* ── Overlay ───────────────────────────────────────────────── */
.noir-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(8, 8, 8, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
}

.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.1'/%3E%3C/svg%3E");
  opacity: 0.5;
  mix-blend-mode: overlay;
}

/* ── Detective stage ───────────────────────────────────────── */
.detective-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: stage-flicker 8s ease-in-out infinite;
}

/* ── Portrait frame (case-file photo) ──────────────────────── */
.detective-frame {
  width: 200px;
  height: 260px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid rgba(180, 200, 220, 0.18);
  box-shadow:
    0 0 22px rgba(180, 200, 220, 0.12),
    inset 0 0 40px rgba(0, 0, 0, 0.35);
  background: #d8d4cb;
}

.detective-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* noir grade: desaturated, punchy contrast */
  filter: grayscale(0.35) contrast(1.08) brightness(0.96) sepia(0.12);
  transform-origin: center 35%;
  /* breathing zoom — ~2s in/out loop */
  animation: breathe 4s ease-in-out infinite alternate;
}

@keyframes breathe {
  from { transform: scale(1); }
  to   { transform: scale(1.06); }
}

/* ── Whole stage subtle flicker ───────────────────────────── */
@keyframes stage-flicker {
  0%,100% { opacity: 1; }
  48%      { opacity: 1; }
  49%      { opacity: 0.92; }
  50%      { opacity: 1; }
  92%      { opacity: 1; }
  93%      { opacity: 0.95; }
  94%      { opacity: 1; }
}

/* ── Message ───────────────────────────────────────────────── */
.detective-msg {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.88rem;
  letter-spacing: 0.2em;
  color: #CCCCCC;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.msg-glyph {
  color: #888;
  font-size: 0.7rem;
}

.msg-text {
  text-transform: uppercase;
}

.msg-dots span {
  animation: blink 1.2s infinite;
  opacity: 0;
}
.msg-dots span:nth-child(1) { animation-delay: 0s;    }
.msg-dots span:nth-child(2) { animation-delay: 0.3s;  }
.msg-dots span:nth-child(3) { animation-delay: 0.6s;  }

@keyframes blink {
  0%, 60%, 100% { opacity: 0; }
  30%            { opacity: 1; }
}

.detective-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  font-style: italic;
  color: #555;
  margin: 0;
  letter-spacing: 0.05em;
}

/* ── Transition ────────────────────────────────────────────── */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
