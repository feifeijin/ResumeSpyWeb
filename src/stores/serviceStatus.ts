import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const MAINTENANCE_FLAG = String(import.meta.env.VITE_MAINTENANCE_MODE ?? '').toLowerCase() === 'true'

export const useServiceStatusStore = defineStore('serviceStatus', () => {
  const apiDown = ref(false)
  const appError = ref<Error | null>(null)
  const maintenanceMode = ref(MAINTENANCE_FLAG)

  const hasIncident = computed(
    () => apiDown.value || appError.value !== null || maintenanceMode.value,
  )

  const markApiDown = () => {
    apiDown.value = true
  }

  const markApiUp = () => {
    apiDown.value = false
  }

  const setAppError = (err: unknown) => {
    appError.value = err instanceof Error ? err : new Error(String(err))
  }

  const clearAppError = () => {
    appError.value = null
  }

  const setMaintenance = (on: boolean) => {
    maintenanceMode.value = on
  }

  const reset = () => {
    apiDown.value = false
    appError.value = null
  }

  return {
    apiDown,
    appError,
    maintenanceMode,
    hasIncident,
    markApiDown,
    markApiUp,
    setAppError,
    clearAppError,
    setMaintenance,
    reset,
  }
})
