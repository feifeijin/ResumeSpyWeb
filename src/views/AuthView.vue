<template>
  <div class="noir-auth">
    <div class="film-grain" aria-hidden="true" />

    <div class="auth-card">
      <p class="auth-overline">— Access the Archives —</p>
      <h1 class="auth-title">SIGN THE REGISTER</h1>
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
          :disabled="!magicLinkFormValid || isProcessing"
        >
          <span v-if="isProcessing">Sending…</span>
          <span v-else>{{ t(linkSent ? 'auth.resendLink' : 'auth.sendLink') }}</span>
        </button>
      </v-form>

      <p class="auth-note">No password. No friction. Just a link.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
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

const handleRequest = async () => {
  const validation = await magicLinkFormRef.value?.validate?.()
  if (validation?.valid === false) return

  try {
    await authStore.sendMagicLink(magicLinkForm.email.trim())
    toast.success(t('auth.linkRequestSuccess'))
    linkSent.value = true
  } catch (error) {
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
  --bg:       #0c0a08;
  --surface:  #161210;
  --border:   #2e2620;
  --text:     #e2d5bc;
  --muted:    #6a5f52;
  --gold:     #c49a38;
  --gold-dim: #7a5f22;
  --ink:      #090807;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'IM Fell English', serif;
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
  border: 1px solid var(--border);
  padding: 3rem 2.5rem;
  text-align: center;
  box-shadow: 4px 4px 0 #090807, 8px 8px 0 rgba(0,0,0,0.3);
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
  font-family: 'Special Elite', cursive;
  font-size: 0.75rem;
  color: var(--gold-dim);
  letter-spacing: 0.25em;
  margin-bottom: 1rem;
}

.auth-title {
  font-family: 'Cinzel', serif;
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
  font-family: 'Special Elite', cursive;
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
  color: var(--gold-dim) !important;
}

:deep(.v-field__input) {
  font-family: 'Special Elite', cursive !important;
  color: var(--text) !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.05em !important;
}

.btn-ink {
  width: 100%;
  font-family: 'Special Elite', cursive;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: var(--ink);
  background: var(--gold);
  border: none;
  padding: 0.9rem;
  cursor: pointer;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.3s, box-shadow 0.3s;
  margin-top: 0.5rem;
}

.btn-ink:hover:not(:disabled) {
  background: #d4a940;
  box-shadow: 0 0 20px rgba(196, 154, 56, 0.35);
}

.btn-ink:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.link-sent-notice {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  font-size: 0.85rem;
  color: var(--gold);
  border: 1px solid var(--gold-dim);
  padding: 0.75rem 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  line-height: 1.5;
}

.notice-glyph { flex-shrink: 0; }

.auth-note {
  font-size: 0.8rem;
  font-style: italic;
  color: var(--muted);
  margin-top: 1.75rem;
  margin-bottom: 0;
}
</style>
