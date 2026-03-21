import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import guestSessionAPI from '@/api/guest-session-api'
import type { CreateGuestSessionResponse, CheckResumeQuotaResponse } from '@/models/Resume.type'

const QUOTA_SYNC_STORAGE_KEY = 'guest:quota-sync'
const QUOTA_SYNC_CHANNEL = 'guest-quota-channel'

let quotaSyncInitialized = false
let quotaSyncChannel: BroadcastChannel | null = null

export const useGuestStore = defineStore('guest', () => {
  // State
  const sessionId = ref<string | null>(null)
  const expiresAt = ref<string | null>(null)
  const resumeCount = ref(0)
  const maxResumeCount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isGuest = computed(() => sessionId.value !== null)
  const canCreateResume = computed(() =>
    maxResumeCount.value > 0 ? resumeCount.value < maxResumeCount.value : true,
  )
  const hasReachedLimit = computed(() =>
    maxResumeCount.value > 0 ? resumeCount.value >= maxResumeCount.value : false,
  )

  const handleExternalQuotaChange = async () => {
    // Only refresh for active guest sessions to avoid unnecessary API calls.
    if (!sessionId.value) {
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

    // BroadcastChannel is same-origin and near real-time for modern browsers.
    quotaSyncChannel?.postMessage(payload)

    // storage event fallback for environments without BroadcastChannel.
    try {
      localStorage.setItem(QUOTA_SYNC_STORAGE_KEY, payload)
    } catch {
      // Ignore storage write failures (private mode / quotas).
    }
  }

  // Actions
  const createGuestSession = async () => {
    try {
      isLoading.value = true
      error.value = null
      setupQuotaSync()
      const response: CreateGuestSessionResponse = await guestSessionAPI.createGuestSession()
      sessionId.value = response.sessionId
      expiresAt.value = response.expiresAt
      resumeCount.value = 0
      console.log('Guest session created:', response.sessionId)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create guest session'
      error.value = errorMessage
      console.error('Error creating guest session:', error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const checkResumeQuota = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response: CheckResumeQuotaResponse = await guestSessionAPI.checkResumeQuota()
      resumeCount.value = response.currentCount
      maxResumeCount.value = response.maxAllowed
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check resume quota'
      error.value = errorMessage
      // If session is invalid, clear it.
      // Axios errors carry status under err.response.status.
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

  const logoutGuest = async () => {
    try {
      isLoading.value = true
      await guestSessionAPI.logoutGuest()
      clearGuestSession()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout'
      error.value = errorMessage
      console.error('Error logging out guest:', error.value)
    } finally {
      isLoading.value = false
    }
  }

  const clearGuestSession = () => {
    sessionId.value = null
    expiresAt.value = null
    resumeCount.value = 0
    error.value = null
  }

  const initializeGuestSession = async () => {
    try {
      setupQuotaSync()

      // Check if there's an existing guest session by trying to get quota
      const quota = await checkResumeQuota()
      if (quota) {
        console.log('Existing guest session found')
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize guest session'
      console.warn('Guest session initialization failed:', errorMessage)
      clearGuestSession() // ← Ensure clean state on error
    }
    return false
  }

  return {
    // State
    sessionId,
    expiresAt,
    resumeCount,
    maxResumeCount,
    isLoading,
    error,

    // Computed
    isGuest,
    canCreateResume,
    hasReachedLimit,

    // Actions
    createGuestSession,
    checkResumeQuota,
    incrementResumeCount,
    decrementResumeCount,
    notifyQuotaChanged,
    logoutGuest,
    clearGuestSession,
    initializeGuestSession,
  }
})
