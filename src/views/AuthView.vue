<template>
  <v-container class="auth-container" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="6" lg="5">
        <v-card elevation="6" class="py-4 px-2 px-sm-8">
          <v-card-title class="text-h5 text-center font-weight-bold">
            {{ t('auth.title') }}
          </v-card-title>
          <v-card-subtitle class="text-center text-body-2 mb-6">
            {{ t('auth.subtitle') }}
          </v-card-subtitle>

          <v-form
            ref="magicLinkFormRef"
            v-model="magicLinkFormValid"
            @submit.prevent="handleRequest"
          >
            <v-text-field
              v-model="magicLinkForm.email"
              :label="t('auth.email')"
              :rules="[rules.required, rules.email]"
              type="email"
              autocomplete="email"
              prepend-inner-icon="mdi-email"
              density="comfortable"
              variant="outlined"
            />

            <v-alert
              v-if="linkSent"
              type="success"
              variant="tonal"
              class="mb-4"
              :text="t('auth.magicLinkSent', { email: magicLinkForm.email })"
            />

            <v-btn
              type="submit"
              color="primary"
              class="my-2"
              size="large"
              :loading="isProcessing"
              :disabled="!magicLinkFormValid"
              block
            >
              {{ t(linkSent ? 'auth.resendLink' : 'auth.sendLink') }}
            </v-btn>
          </v-form>

          <v-divider class="my-6" />

          <div class="d-flex flex-column align-center mb-2">
            <span class="text-caption mb-2">{{ t('auth.loginWith') }}</span>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-google"
              class="mb-2"
              :loading="isProcessing"
              @click="handleGoogleLogin"
            >
              {{ t('auth.google') }}
            </v-btn>
            <v-btn
              color="black"
              variant="outlined"
              prepend-icon="mdi-github"
              class="mt-1"
              :loading="isProcessing"
              @click="handleGithubLogin"
            >
              {{ t('auth.github') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

const magicLinkForm = reactive({
  email: '',
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

const handleRequest = async () => {
  const validation = await magicLinkFormRef.value?.validate?.()
  if (validation?.valid === false) {
    return
  }

  try {
    await authStore.requestMagicLink({
      email: magicLinkForm.email.trim(),
      redirectUrl: buildRedirectUrl(),
    })
    toast.success(t('auth.linkRequestSuccess'))
    linkSent.value = true
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error))
  }
}

const buildRedirectUrl = () => {
  if (typeof window === 'undefined') {
    return '/auth/magic'
  }

  const baseUrl = `${window.location.origin}/auth/magic`
  const params = new URLSearchParams()
  if (redirectTarget.value && redirectTarget.value !== '/') {
    params.set('redirect', redirectTarget.value)
  }
  return params.toString() ? `${baseUrl}?${params}` : baseUrl
}

const handleGoogleLogin = async () => {
  const credential = window.prompt(t('auth.googleTokenPrompt'))
  if (!credential) {
    return
  }

  try {
    await authStore.loginWithGoogle(credential.trim())
    toast.success(t('auth.loginSuccess'))
    router.replace(redirectTarget.value)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error))
  }
}

const handleGithubLogin = async () => {
  const token = window.prompt(t('auth.githubTokenPrompt'))
  if (!token) {
    return
  }

  try {
    await authStore.loginWithGithub(token.trim())
    toast.success(t('auth.loginSuccess'))
    router.replace(redirectTarget.value)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error))
  }
}

watch(
  () => isAuthenticated.value,
  (isAuthed) => {
    if (isAuthed) {
      router.replace(redirectTarget.value)
    }
  },
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

watch(
  () => magicLinkForm.email,
  () => {
    linkSent.value = false
  },
)
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: linear-gradient(135deg, rgba(63, 81, 181, 0.08), rgba(30, 136, 229, 0.08));
  overflow: hidden;
}

@media (max-width: 600px) {
  .auth-container {
    align-items: flex-start;
    padding-block: 24px;
    overflow-y: auto;
  }
}
</style>
