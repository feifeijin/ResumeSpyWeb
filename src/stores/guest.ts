import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import anonymousUserAPI from '@/api/anonymous-user-api'
import { getAnonymousId } from '@/utils/anonymous-id'
import type { CheckResumeQuotaResponse } from '@/models/resume.type'

const QUOTA_SYNC_STORAGE_KEY = 'anonymous:quota-sync'
const QUOTA_SYNC_CHANNEL = 'anonymous-quota-channel'

let quotaSyncInitialized = false
let quotaSyncChannel: BroadcastChannel | null = null

export const useGuestStore = defineStore('guest', () => {
  // State
  const resumeCount = ref(0)
  const maxResumeCount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isGuest = computed(() => getAnonymousId() !== null)
  const canCreateResume = computed(() =>
    maxResumeCount.value > 0 ? resumeCount.value < maxResumeCount.value : true,
  )
  const hasReachedLimit = computed(() =>
    maxResumeCount.value > 0 ? resumeCount.value >= maxResumeCount.value : false,
  )

  const handleExternalQuotaChange = async () => {
    if (!getAnonymousId()) {
      return
    }

    await checkResumeQuota()
  }

  const setupQuotaSync = () => {
    if (quotaSyncInitialized || typeof window === 'undefined') {
      return
    }

    quotaSyncInitialized = true

    window.addEventListener('storage', (event) => {
      if (event.key === QUOTA_SYNC_STORAGE_KEY && event.newValue) {
        void handleExternalQuotaChange()
      }
    })

    if ('BroadcastChannel' in window) {
      quotaSyncChannel = new BroadcastChannel(QUOTA_SYNC_CHANNEL)
      quotaSyncChannel.onmessage = () => {
        void handleExternalQuotaChange()
      }
    }
  }

  const notifyQuotaChanged = () => {
    const payload = JSON.stringify({ ts: Date.now() })

    quotaSyncChannel?.postMessage(payload)

    try {
      localStorage.setItem(QUOTA_SYNC_STORAGE_KEY, payload)
    } catch {
      // Ignore storage write failures (private mode / quotas).
    }
  }

  // Actions
  const checkResumeQuota = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response: CheckResumeQuotaResponse = await anonymousUserAPI.checkResumeQuota()
      resumeCount.value = response.currentCount
      maxResumeCount.value = response.maxAllowed
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check resume quota'
      error.value = errorMessage
      const status = axios.isAxiosError(err) ? err.response?.status : null
      if (status === 401 || status === 400) {
        clearGuestSession()
      }
      console.error('Error checking resume quota:', error.value)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const incrementResumeCount = () => {
    resumeCount.value++
  }

  const decrementResumeCount = () => {
    if (resumeCount.value > 0) {
      resumeCount.value--
    }
  }

  const clearGuestSession = () => {
    resumeCount.value = 0
    error.value = null
  }

  const initializeGuestSession = async () => {
    try {
      setupQuotaSync()

      const quota = await checkResumeQuota()
      if (quota) {
        console.log('Anonymous user session initialized')
        return true
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize anonymous session'
      console.warn('Anonymous session initialization failed:', errorMessage)
      clearGuestSession()
    }
    return false
  }

  return {
    // State
    resumeCount,
    maxResumeCount,
    isLoading,
    error,

    // Computed
    isGuest,
    canCreateResume,
    hasReachedLimit,

    // Actions
    checkResumeQuota,
    incrementResumeCount,
    decrementResumeCount,
    notifyQuotaChanged,
    clearGuestSession,
    initializeGuestSession,
  }
})
