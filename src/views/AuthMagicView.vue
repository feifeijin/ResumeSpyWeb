<template>
  <div class="noir-auth">
    <div class="film-grain" aria-hidden="true" />

    <div class="auth-card">
      <!-- Processing -->
      <div v-if="state === 'processing'" class="state-block">
        <div class="stamp-ring">
          <span class="stamp-dots">
            <span /><span /><span />
          </span>
        </div>
        <h2 class="state-title">{{ t('authMagic.processing') }}</h2>
        <p class="state-desc">{{ t('auth.magicProcessing') }}</p>
      </div>

      <!-- Success -->
      <div v-else-if="state === 'success'" class="state-block">
        <div class="stamp-ring stamp-ring--gold">
          <span class="stamp-glyph">✓</span>
        </div>
        <h2 class="state-title">{{ t('authMagic.success') }}</h2>
        <p class="state-desc">{{ t('auth.magicSuccess') }}</p>
        <button class="btn-ink" :disabled="isRedirecting" @click="goToDestination">
          {{ isRedirecting ? t('auth.magicContinue') : t('authMagic.continue') }}
        </button>
      </div>

      <!-- Error -->
      <div v-else class="state-block">
        <div class="stamp-ring stamp-ring--red">
          <span class="stamp-glyph">✕</span>
        </div>
        <h2 class="state-title">{{ t('authMagic.error') }}</h2>
        <p class="state-desc">{{ errorMessage }}</p>
        <button class="btn-ghost" @click="goToAuth">
          {{ t('auth.magicReturnToSignIn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const toast = useToast()

const state = ref<'processing' | 'success' | 'error'>('processing')
const errorMessage = ref('')
const isRedirecting = ref(false)

const redirectTarget = computed(() =>
  typeof route.query.redirect === 'string' && route.query.redirect.length > 0
    ? route.query.redirect
    : '/',
)

const goToDestination = async () => {
  if (state.value !== 'success') return
  isRedirecting.value = true
  await router.replace(redirectTarget.value)
}

const goToAuth = () => {
  router.replace({ name: 'auth' })
}

onMounted(async () => {
  try {
    await authStore.handleMagicLinkCallback()
    state.value = 'success'
    toast.success(t('auth.loginSuccess'))
    await goToDestination()
  } catch (error) {
    state.value = 'error'
    const msg = error instanceof Error ? error.message : ''
    errorMessage.value = msg.toLowerCase().includes('multiple accounts') || msg.toLowerCase().includes('same email')
      ? t('auth.duplicateAccountError')
      : (msg || t('auth.magicInvalidLink'))
    toast.error(errorMessage.value)
  }
})
</script>

<style scoped>
.noir-auth {
  --bg:       #FAFAFA;
  --surface:  #F0F0F0;
  --border:   #D4D4D4;
  --text:     #121212;
  --muted:    #666666;
  --gold:     #121212;
  --gold-dim: #888888;
  --red:      #8b2020;
  --ink:      #FFFFFF;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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

.auth-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  padding: 3.5rem 2.5rem;
  text-align: center;
  box-shadow: 6px 6px 0 #AAAAAA;
}

.auth-card::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid var(--border);
  pointer-events: none;
  opacity: 0.35;
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

/* Stamp ring */
.stamp-ring {
  width: 72px;
  height: 72px;
  border: 2px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stamp-ring--gold { border-color: var(--gold); }
.stamp-ring--red  { border-color: var(--red); }

.stamp-glyph {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.8rem;
  color: var(--gold);
}

.stamp-ring--red .stamp-glyph { color: var(--red); }

/* Animated dots for processing */
.stamp-dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

.stamp-dots span {
  width: 6px;
  height: 6px;
  background: var(--muted);
  border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}

.stamp-dots span:nth-child(2) { animation-delay: 0.2s; }
.stamp-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50%       { opacity: 1;   transform: scale(1); }
}

.state-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.12em;
  margin: 0;
}

.state-desc {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

.btn-ink {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  color: #F5F5F5;
  background: #121212;
  border: 1.5px solid #121212;
  padding: 0.8rem 2rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  margin-top: 0.25rem;
  box-shadow: 3px 3px 0 #AAAAAA;
}

.btn-ink:hover:not(:disabled) {
  background: #2B2B2B;
  transform: translateY(-2px);
  box-shadow: 5px 5px 0 #AAAAAA;
}
.btn-ink:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-ghost {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  color: var(--muted);
  background: transparent;
  border: 1.5px solid var(--border);
  padding: 0.8rem 2rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: border-color 0.3s, color 0.3s;
  margin-top: 0.25rem;
}

.btn-ghost:hover {
  border-color: #666666;
  color: var(--text);
}
</style>
