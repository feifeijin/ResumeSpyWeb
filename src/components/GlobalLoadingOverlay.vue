<template>
  <v-overlay
    v-model="loadingStore.isGlobalLoading"
    :persistent="true"
    class="d-flex align-center justify-center"
    :z-index="9999"
  >
    <v-card class="pa-8 text-center" :width="props.cardWidth" :elevation="8" rounded="lg">
      <v-progress-circular
        :indeterminate="!currentProgress"
        :model-value="currentProgress"
        :size="props.progressSize"
        :width="4"
        color="primary"
        class="mb-6"
      >
        <template v-if="currentProgress">
          <span class="text-caption">{{ Math.round(currentProgress) }}%</span>
        </template>
      </v-progress-circular>

      <div class="text-h6 mb-2">{{ currentMessage || $t('common.loading') }}</div>

      <div v-if="props.showDetails" class="text-body-2 text-medium-emphasis">
        {{ $t('common.pleaseWait') }}
      </div>

      <!-- Optional: Show loading queue count if multiple operations -->
      <div
        v-if="loadingStore.loadingStates.length > 1"
        class="mt-3 text-caption text-medium-emphasis"
      >
        {{ $t('common.operationsInQueue', { count: loadingStore.loadingStates.length }) }}
      </div>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/loading'

interface Props {
  cardWidth?: string | number
  progressSize?: string | number
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cardWidth: 320,
  progressSize: 64,
  showDetails: true,
})

const loadingStore = useLoadingStore()

const currentMessage = computed(() => {
  return loadingStore.currentLoadingState?.message
})

const currentProgress = computed(() => {
  return loadingStore.currentLoadingState?.progress
})

// Define component name for Vue DevTools
defineOptions({
  name: 'GlobalLoadingOverlay',
})
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(2px);
}
</style>
