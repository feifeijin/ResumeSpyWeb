<template>
  <div class="noir-auth">
    <div class="film-grain" aria-hidden="true" />

    <div class="auth-card">
      <p class="auth-overline">{{ t('auth.overline') }}</p>
      <h1 class="auth-title">{{ t('auth.heading') }}</h1>
      <p class="auth-subtitle">{{ t('auth.subtitle') }}</p>

      <v-form
        ref="magicLinkFormRef"
        v-model="magicLinkFormValid"
        @submit.prevent="handleRequest"
        class="auth-form"
      >
        <div class="field-wrapper">
          <label class="field-label">{{ t('auth.email') }}</label>
          <v-text-field
            v-model="magicLinkForm.email"
            :rules="[rules.required, rules.email]"
            type="email"
            autocomplete="email"
            density="comfortable"
            variant="outlined"
            hide-details="auto"
            class="noir-input"
          />
        </div>

        <div v-if="linkSent" class="link-sent-notice">
          <span class="notice-glyph">✦</span>
          {{ t('auth.magicLinkSent', { email: magicLinkForm.email }) }}
        </div>

        <button
          type="submit"
          class="btn-ink"
          :disabled="!magicLinkFormValid || isProcessing || cooldown > 0"
        >
          <span v-if="isProcessing">{{ t('auth.sending') }}</span>
          <span v-else-if="cooldown > 0">{{ t('auth.resendLink') }} ({{ cooldown }}s)</span>
          <span v-else>{{ t(linkSent ? 'auth.resendLink' : 'auth.sendLink') }}</span>
        </button>
      </v-form>

      <div class="divider">
        <span class="divider-line" />
        <span class="divider-text">{{ t('auth.loginWith') }}</span>
        <span class="divider-line" />
      </div>

      <div class="oauth-buttons">
        <button class="btn-oauth" :disabled="isProcessing" @click="handleOAuth('google')">
          <svg class="oauth-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ t('auth.google') }}
        </button>

        <button class="btn-oauth" :disabled="isProcessing" @click="handleOAuth('github')">
          <svg class="oauth-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          {{ t('auth.github') }}
        </button>
      </div>

      <p class="auth-note">{{ t('auth.noPassword') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const { isLoading, isAuthenticated } = storeToRefs(authStore)

const magicLinkFormRef = ref()
const magicLinkFormValid = ref(false)
const linkSent = ref(false)

const magicLinkForm = reactive({ email: '' })

const cooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const startCooldown = () => {
  cooldown.value = 60
  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(cooldownTimer!)
      cooldownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

const rules = {
  required: (value: string) =>
    (!!value && value.trim().length > 0) || t('auth.validation.required'),
  email: (value: string) => /.+@.+\..+/.test(value) || t('auth.validation.invalidEmail'),
}

const redirectTarget = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.length > 0 ? redirect : '/'
})

const isProcessing = computed(() => isLoading.value)

const handleOAuth = async (provider: 'google' | 'github') => {
  try {
    await authStore.signInWithOAuth(provider)
    // Supabase will redirect the browser — no further action needed here
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    toast.error(msg || t('auth.externalFailure'))
  }
}

const handleRequest = async () => {
  const validation = await magicLinkFormRef.value?.validate?.()
  if (validation?.valid === false) return

  linkSent.value = true
  try {
    await authStore.sendMagicLink(magicLinkForm.email.trim())
    toast.success(t('auth.linkRequestSuccess'))
    startCooldown()
  } catch (error) {
    linkSent.value = false
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.includes('rate_limit') || msg.includes('rate limit')) {
      toast.error(t('auth.rateLimitError'))
    } else {
      toast.error(msg)
    }
  }
}

watch(
  () => isAuthenticated.value,
  (isAuthed) => { if (isAuthed) router.replace(redirectTarget.value) },
  { immediate: true },
)

watch(
  () => route.query.email,
  (email) => {
    if (typeof email === 'string' && email.length > 0 && !linkSent.value) {
      magicLinkForm.email = email
    }
  },
  { immediate: true },
)

watch(() => magicLinkForm.email, () => { linkSent.value = false })
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
  --ink:      #FFFFFF;

  position: relative;
  height: 100%;
  overflow-y: auto;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
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
  max-width: 440px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  padding: 2.25rem 2.5rem;
  text-align: center;
  box-shadow: 6px 6px 0 #AAAAAA;
}

/* Double border frame */
.auth-card::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid var(--border);
  pointer-events: none;
  opacity: 0.35;
}

.auth-overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--gold-dim);
  letter-spacing: 0.25em;
  margin-bottom: 1rem;
}

.auth-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.15em;
  margin: 0 0 0.75rem;
}

.auth-subtitle {
  font-size: 0.9rem;
  font-style: italic;
  color: var(--muted);
  margin-bottom: 2rem;
}

.auth-form {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-label {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
  letter-spacing: 0.18em;
  margin-bottom: 0.4rem;
}

:deep(.v-field) {
  background: var(--ink) !important;
  border-radius: 0 !important;
}

:deep(.v-field__outline) {
  color: var(--border) !important;
}

:deep(.v-field--focused .v-field__outline) {
  color: #888888 !important;
}

:deep(.v-field__input) {
  font-family: 'IBM Plex Mono', monospace !important;
  color: var(--text) !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.05em !important;
}

.btn-ink {
  width: 100%;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: #F5F5F5;
  background: #121212;
  border: 1.5px solid #121212;
  padding: 0.9rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  margin-top: 0.5rem;
  box-shadow: 3px 3px 0 #AAAAAA;
}

.btn-ink:hover:not(:disabled) {
  background: #2B2B2B;
  transform: translateY(-2px);
  box-shadow: 5px 5px 0 #AAAAAA;
}

.btn-ink:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.link-sent-notice {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--muted);
  background: transparent;
  border: 1px dashed var(--border);
  padding: 0.75rem 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  line-height: 1.6;
  letter-spacing: 0.03em;
}

.notice-glyph {
  flex-shrink: 0;
  color: var(--gold-dim);
}

.auth-note {
  font-size: 0.8rem;
  font-style: italic;
  color: var(--muted);
  margin-top: 1.75rem;
  margin-bottom: 0;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.divider-text {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--muted);
  letter-spacing: 0.15em;
  white-space: nowrap;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-oauth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  width: 100%;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: var(--text);
  background: var(--ink);
  border: 1.5px solid var(--border);
  padding: 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 2px 2px 0 #CCCCCC;
}

.btn-oauth:hover:not(:disabled) {
  border-color: #888888;
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 #CCCCCC;
}

.btn-oauth:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.oauth-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
