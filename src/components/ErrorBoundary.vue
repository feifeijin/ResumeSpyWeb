<template>
  <slot v-if="!serviceStatus.appError" />
  <AppErrorView v-else :error="serviceStatus.appError" @retry="handleRetry" />
</template>

<script setup lang="ts">
import { onErrorCaptured, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useServiceStatusStore } from '@/stores/serviceStatus'
import AppErrorView from '@/views/AppErrorView.vue'

const serviceStatus = useServiceStatusStore()
const route = useRoute()

onErrorCaptured((err) => {
  // Log so engineers still see the stack in the console.
  console.error('[ErrorBoundary] captured error', err)
  serviceStatus.setAppError(err)
  return false
})

// Clear the captured error when the user navigates away.
watch(
  () => route.fullPath,
  () => {
    if (serviceStatus.appError) {
      serviceStatus.clearAppError()
    }
  },
)

const handleRetry = () => {
  serviceStatus.clearAppError()
}

defineOptions({ name: 'ErrorBoundary' })
</script>
