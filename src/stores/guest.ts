import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import guestSessionAPI from '@/api/guest-session-api'
import type { CreateGuestSessionResponse, CheckResumeQuotaResponse } from '@/models/Resume.type'

export const useGuestStore = defineStore('guest', () => {
  // State
  const sessionId = ref<string | null>(null)
  const expiresAt = ref<string | null>(null)
  const resumeCount = ref(0)
  const maxResumeCount = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isGuest = computed(() => sessionId.value !== null)
  const canCreateResume = computed(() => resumeCount.value < maxResumeCount.value)
  const hasReachedLimit = computed(() => resumeCount.value >= maxResumeCount.value)

  // Actions
  const createGuestSession = async () => {
    try {
      isLoading.value = true
      error.value = null
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
      // If session is invalid, clear it
      const isHttpError = err instanceof Error && 'status' in err
      const status = isHttpError ? (err as Record<string, unknown>).status : null
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
    logoutGuest,
    clearGuestSession,
    initializeGuestSession,
  }
})
