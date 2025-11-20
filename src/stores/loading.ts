import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LoadingState {
  id: string
  message?: string
  progress?: number
}

export const useLoadingStore = defineStore('loading', () => {
  const loadingStates = ref<Map<string, LoadingState>>(new Map())

  const isGlobalLoading = computed(() => loadingStates.value.size > 0)

  const currentLoadingState = computed(() => {
    const states = Array.from(loadingStates.value.values())
    return states[states.length - 1] || null
  })

  const startLoading = (id: string, message?: string, progress?: number) => {
    loadingStates.value.set(id, { id, message, progress })
  }

  const updateLoading = (id: string, message?: string, progress?: number) => {
    const existingState = loadingStates.value.get(id)
    if (existingState) {
      loadingStates.value.set(id, {
        ...existingState,
        ...(message !== undefined && { message }),
        ...(progress !== undefined && { progress }),
      })
    }
  }

  const stopLoading = (id: string) => {
    loadingStates.value.delete(id)
  }

  const stopAllLoading = () => {
    loadingStates.value.clear()
  }

  return {
    loadingStates: computed(() => Array.from(loadingStates.value.values())),
    isGlobalLoading,
    currentLoadingState,
    startLoading,
    updateLoading,
    stopLoading,
    stopAllLoading,
  }
})
