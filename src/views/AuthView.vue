<template>
  <v-container class="auth-container" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="6" lg="5">
        <v-card elevation="6" class="py-4 px-2 px-sm-8">
          <v-card-title class="text-h5 text-center font-weight-bold">
            {{ t('auth.title') }}
          </v-card-title>
          <v-card-subtitle class="text-center text-body-2 mb-2">
            {{ t('auth.subtitle') }}
          </v-card-subtitle>

          <v-tabs v-model="activeTab" align-tabs="center" density="comfortable" class="mt-4">
            <v-tab value="login">{{ t('auth.login') }}</v-tab>
            <v-tab value="register">{{ t('auth.register') }}</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-6">
            <v-window-item value="login">
              <v-form ref="loginFormRef" v-model="loginFormValid" @submit.prevent="handleLogin">
                <v-text-field
                  v-model="loginForm.email"
                  :label="t('auth.email')"
                  :rules="[rules.required, rules.email]"
                  type="email"
                  autocomplete="email"
                  prepend-inner-icon="mdi-email"
                  density="comfortable"
                  variant="outlined"
                />

                <v-text-field
                  v-model="loginForm.password"
                  :label="t('auth.password')"
                  :rules="[rules.required]"
                  type="password"
                  autocomplete="current-password"
                  prepend-inner-icon="mdi-lock"
                  density="comfortable"
                  variant="outlined"
                />

                <div class="d-flex justify-space-between align-center mb-4">
                  <v-checkbox
                    v-model="loginForm.rememberMe"
                    :label="t('auth.rememberMe')"
                    density="comfortable"
                    hide-details
                  />
                </div>

                <v-btn
                  type="submit"
                  color="primary"
                  class="my-2"
                  size="large"
                  :loading="isProcessing"
                  :disabled="!loginFormValid"
                  block
                >
                  {{ t('auth.login') }}
                </v-btn>

                <p class="text-body-2 text-center mt-4">
                  {{ t('auth.noAccount') }}
                  <v-btn variant="text" size="small" @click="activeTab = 'register'">
                    {{ t('auth.register') }}
                  </v-btn>
                </p>
              </v-form>
            </v-window-item>

            <v-window-item value="register">
              <v-form
                ref="registerFormRef"
                v-model="registerFormValid"
                @submit.prevent="handleRegister"
              >
                <v-text-field
                  v-model="registerForm.displayName"
                  :label="t('auth.displayName')"
                  :rules="[rules.required]"
                  autocomplete="name"
                  prepend-inner-icon="mdi-account"
                  density="comfortable"
                  variant="outlined"
                />

                <v-text-field
                  v-model="registerForm.email"
                  :label="t('auth.email')"
                  :rules="[rules.required, rules.email]"
                  type="email"
                  autocomplete="email"
                  prepend-inner-icon="mdi-email"
                  density="comfortable"
                  variant="outlined"
                />

                <v-text-field
                  v-model="registerForm.password"
                  :label="t('auth.password')"
                  :rules="[rules.required, rules.password]"
                  type="password"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock"
                  density="comfortable"
                  variant="outlined"
                />

                <v-text-field
                  v-model="registerForm.confirmPassword"
                  :label="t('auth.confirmPassword')"
                  :rules="[rules.required, rules.confirmPassword]"
                  type="password"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock-check"
                  density="comfortable"
                  variant="outlined"
                />

                <v-btn
                  type="submit"
                  color="primary"
                  class="my-2"
                  size="large"
                  :loading="isProcessing"
                  :disabled="!registerFormValid"
                  block
                >
                  {{ t('auth.register') }}
                </v-btn>

                <p class="text-body-2 text-center mt-4">
                  {{ t('auth.haveAccount') }}
                  <v-btn variant="text" size="small" @click="activeTab = 'login'">
                    {{ t('auth.login') }}
                  </v-btn>
                </p>
              </v-form>
            </v-window-item>
          </v-window>

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

const activeTab = ref<'login' | 'register'>('login')
const loginFormRef = ref()
const registerFormRef = ref()
const loginFormValid = ref(false)
const registerFormValid = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: true,
})

const registerForm = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordPattern = /^(?=.*[a-z])(?=.*\d).{6,}$/

const rules = {
  required: (value: string) =>
    (!!value && value.trim().length > 0) || t('auth.validation.required'),
  email: (value: string) => /.+@.+\..+/.test(value) || t('auth.validation.invalidEmail'),
  password: (value: string) =>
    passwordPattern.test(value) || t('auth.validation.passwordComplexity'),
  confirmPassword: (value: string) =>
    value === registerForm.password || t('auth.validation.confirmPassword'),
}

const redirectTarget = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.length > 0 ? redirect : '/'
})

const isProcessing = computed(() => isLoading.value)

const handleLogin = async () => {
  const validation = await loginFormRef.value?.validate?.()
  if (validation?.valid === false) {
    return
  }

  try {
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe,
    })
    toast.success(t('auth.loginSuccess'))
    router.replace(redirectTarget.value)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error))
  }
}

const handleRegister = async () => {
  const validation = await registerFormRef.value?.validate?.()
  if (validation?.valid === false) {
    return
  }

  try {
    await authStore.register({
      displayName: registerForm.displayName,
      email: registerForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
    })
    toast.success(t('auth.registerSuccess'))
    router.replace(redirectTarget.value)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error))
  }
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
  () => route.query.mode,
  (mode) => {
    if (mode === 'register') {
      activeTab.value = 'register'
    } else if (mode === 'login') {
      activeTab.value = 'login'
    }
  },
  { immediate: true },
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
