import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import authApi from '@/api/auth-api'
import type { AuthSession } from '@/models/auth.type'
import { useGuestStore } from './guest'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthSession | null>(null)
  const loading = ref(false)
  let initialized = false

  const isAuthenticated = computed(() => Boolean(session.value?.accessToken))
  const isLoading = computed(() => loading.value)
  const accessToken = computed(() => session.value?.accessToken ?? '')
  const displayName = computed(() => session.value?.displayName ?? session.value?.email ?? '')
  const email = computed(() => session.value?.email ?? '')

  const setSession = (accessToken: string, userId: string, email: string, displayName?: string) => {
    session.value = { accessToken, userId, email, displayName }
  }

  const clearSession = () => {
    session.value = null
  }

  /** Send a Supabase magic link OTP to the provided email */
  const sendMagicLink = async (email: string) => {
    loading.value = true
    try {
      const redirectTo = `${window.location.origin}/auth/magic`
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      })
      if (error) throw new Error(error.message)
    } finally {
      loading.value = false
    }
  }

  /** Called after Supabase redirects back — exchanges hash params for a session */
  const handleMagicLinkCallback = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw new Error(error.message)
      if (!data.session) throw new Error('No session returned from Supabase.')

      setSession(data.session.access_token, data.session.user.id, data.session.user.email ?? '')

      // Sync with backend
      await syncWithBackend()
    } finally {
      loading.value = false
    }
  }

  /** Sync the Supabase session with the backend to ensure a local user exists */
  const syncWithBackend = async () => {
    try {
      const response = await authApi.syncSession()
      if (response.succeeded && session.value) {
        session.value = {
          ...session.value,
          userId: response.userId ?? session.value.userId,
          displayName: response.displayName ?? session.value.displayName,
          isNewUser: response.isNewUser,
        }
        // Clear guest session after successful auth
        const guestStore = useGuestStore()
        guestStore.clearGuestSession()
      }
    } catch (err) {
      console.warn('Backend sync failed — user can still use Supabase session.', err)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore backend errors — token may already be expired
    }
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignore Supabase errors
    }
    clearSession()
    router.push({ name: 'auth' })
  }

  /** Initialize auth state from Supabase on app start */
  const initialize = async () => {
    if (initialized) return
    initialized = true

    const { data } = await supabase.auth.getSession()
    if (data.session) {
      setSession(data.session.access_token, data.session.user.id, data.session.user.email ?? '')
      await syncWithBackend()
    }

    // Listen for future auth state changes (token refresh, sign-out, etc.)
    supabase.auth.onAuthStateChange((_event, supaSession) => {
      if (supaSession) {
        setSession(supaSession.access_token, supaSession.user.id, supaSession.user.email ?? '')
      } else {
        clearSession()
      }
    })
  }

  return {
    session,
    loading,
    isLoading,
    isAuthenticated,
    accessToken,
    displayName,
    email,
    sendMagicLink,
    handleMagicLinkCallback,
    logout,
    clearSession,
    initialize,
  }
})
