<template>
  <v-container class="auth-container" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="6" lg="5">
        <v-card elevation="6" class="py-6 px-4 px-sm-8 text-center">
          <v-card-title class="text-h5 font-weight-bold mb-2">
            {{ title }}
          </v-card-title>

          <v-card-text class="text-body-2">
            <div v-if="state === 'processing'" class="d-flex flex-column align-center">
              <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
              <span>{{ t('auth.magicProcessing') }}</span>
            </div>

            <div v-else-if="state === 'success'" class="d-flex flex-column align-center">
              <v-icon color="primary" size="64" class="mb-3">mdi-check-circle</v-icon>
              <p class="mb-4">{{ t('auth.magicSuccess') }}</p>
              <v-btn color="primary" :loading="isRedirecting" @click="goToDestination" block>
                {{ t('auth.magicContinue') }}
              </v-btn>
            </div>

            <div v-else class="d-flex flex-column align-center">
              <v-icon color="error" size="64" class="mb-3">mdi-alert-circle</v-icon>
              <p class="mb-4">{{ errorMessage }}</p>
              <v-btn color="primary" variant="text" @click="goToAuth">
                {{ t('auth.magicReturnToSignIn') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const redirectTarget = computed(() =>
  typeof route.query.redirect === 'string' && route.query.redirect.length > 0
    ? route.query.redirect
    : '/',
)

const title = computed(() => {
  switch (state.value) {
    case 'success':
      return t('auth.magicTitleSuccess')
    case 'error':
      return t('auth.magicTitleError')
    default:
      return t('auth.magicTitleProcessing')
  }
})

const goToDestination = async () => {
  if (state.value !== 'success') {
    return
  }

  isRedirecting.value = true
  await router.replace(redirectTarget.value)
}

const goToAuth = () => {
  router.replace({ name: 'auth', query: { email: email.value } })
}

onMounted(async () => {
  if (!email.value || !token.value) {
    state.value = 'error'
    errorMessage.value = t('auth.magicInvalidLink')
    return
  }

  try {
    await authStore.confirmMagicLink({ email: email.value, token: token.value })
    state.value = 'success'
    toast.success(t('auth.loginSuccess'))
    await goToDestination()
  } catch (error) {
    state.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : t('auth.magicInvalidLink')
    toast.error(errorMessage.value)
  }
})
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
