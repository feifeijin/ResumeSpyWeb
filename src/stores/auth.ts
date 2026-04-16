import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import authApi from '@/api/auth-api'
import type { AuthSession } from '@/models/auth.type'
import { useGuestStore } from './guest'
import { clearAnonymousId } from '@/utils/anonymous-id'
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

  /** Sign in with a third-party OAuth provider (Google, GitHub) */
  const signInWithOAuth = async (provider: 'google' | 'github') => {
    loading.value = true
    try {
      const redirectTo = `${window.location.origin}/auth/magic`
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      })
      if (error) throw new Error(error.message)
    } finally {
      loading.value = false
    }
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

  /** Called after Supabase redirects back — handles both magic link (implicit) and OAuth (PKCE) */
  const handleMagicLinkCallback = async () => {
    loading.value = true
    try {
      // Surface any error Supabase passed back in the URL (e.g. access_denied, bad redirect)
      const params = new URLSearchParams(window.location.search)
      const urlError = params.get('error')
      const urlErrorDesc = params.get('error_description')
      if (urlError) throw new Error(urlErrorDesc ?? urlError)

      const supaSession = await resolveSessionFromCallback()
      setSession(supaSession.access_token, supaSession.user.id, supaSession.user.email ?? '')
      syncWithBackend()
    } finally {
      loading.value = false
    }
  }

  /**
   * Resolves the Supabase session after an auth callback (magic link or OAuth PKCE).
   * - Magic link: #access_token in hash → getSession() picks it up directly.
   * - OAuth PKCE:  ?code in query     → Supabase auto-exchanges on init; we wait for
   *               the SIGNED_IN event rather than racing with the internal exchange.
   */
  const resolveSessionFromCallback = (): Promise<import('@supabase/supabase-js').Session> => {
    return new Promise((resolve, reject) => {
      const TIMEOUT_MS = 15_000

      const timer = setTimeout(() => {
        subscription.unsubscribe()
        reject(new Error('Authentication timed out. Please try again.'))
      }, TIMEOUT_MS)

      const cleanup = (cb: () => void) => {
        clearTimeout(timer)
        subscription.unsubscribe()
        cb()
      }

      // Register the listener first to avoid missing a fast SIGNED_IN event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
          cleanup(() => resolve(session))
        } else if (event === 'SIGNED_OUT') {
          cleanup(() => reject(new Error('Sign in failed. Please try again.')))
        }
      })

      // Also check immediately — the session may already be set if
      // Supabase completed the PKCE exchange before we registered the listener
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          cleanup(() => reject(new Error(error.message)))
        } else if (data.session) {
          cleanup(() => resolve(data.session!))
        }
        // If null, we wait for onAuthStateChange above
      })
    })
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
        // Only clear anonymous ID if conversion succeeded or there was nothing to convert (>= 0).
        // If conversion failed (-1), keep the ID so it can be retried on next sync.
        if ((response.convertedResumeCount ?? 0) >= 0) {
          clearAnonymousId()
        }
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
      syncWithBackend()
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
    signInWithOAuth,
    sendMagicLink,
    handleMagicLinkCallback,
    logout,
    clearSession,
    initialize,
  }
})
