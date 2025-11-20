import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { isAxiosError } from 'axios'
import authApi from '@/api/auth-api'
import type {
  AuthResponse,
  AuthSession,
  ExternalAuthRequest,
  LoginRequest,
  RegisterRequest,
} from '@/models/auth.type'

const STORAGE_KEY = 'resumeSpy.auth.session'

const loadSession = (): AuthSession | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch (error) {
    console.warn('Failed to parse stored auth session', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const persistSession = (session: AuthSession | null) => {
  if (typeof window === 'undefined') {
    return
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const resolveErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const payload = error.response?.data as
      | AuthResponse
      | { title?: string; detail?: string; message?: string; errors?: Record<string, string[]> }
      | undefined

    if (payload) {
      if ('succeeded' in payload && payload.errors?.length) {
        return payload.errors.join('\n')
      }

      if ('errors' in payload && payload.errors) {
        const flatErrors = Object.values(payload.errors).flat()
        if (flatErrors.length) {
          return flatErrors.join('\n')
        }
      }

      if ('detail' in payload && payload.detail) {
        return payload.detail
      }

      if ('title' in payload && payload.title) {
        return payload.title
      }

      if ('message' in payload && payload.message) {
        return payload.message
      }
    }

    return error.response?.statusText || 'Authentication request failed.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}

const ensureAuthResponse = (response: AuthResponse): AuthSession => {
  if (!response.succeeded) {
    throw new Error(response.errors?.join('\n') || 'Authentication failed.')
  }

  if (!response.accessToken || !response.refreshToken) {
    throw new Error('Authentication response did not include token data.')
  }

  return {
    userId: response.userId ?? '',
    email: response.email ?? '',
    displayName: response.displayName ?? response.email ?? undefined,
    accessToken: response.accessToken,
    accessTokenExpiresAt: response.accessTokenExpiresAt,
    refreshToken: response.refreshToken,
    refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    isNewUser: response.isNewUser,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthSession | null>(loadSession())
  const loading = ref(false)
  let refreshInFlight: Promise<boolean> | null = null

  const isAuthenticated = computed(() =>
    Boolean(session.value?.accessToken && session.value?.refreshToken),
  )
  const isLoading = computed(() => loading.value)
  const accessToken = computed(() => session.value?.accessToken ?? '')
  const refreshToken = computed(() => session.value?.refreshToken ?? '')
  const displayName = computed(() => session.value?.displayName ?? session.value?.email ?? '')
  const email = computed(() => session.value?.email ?? '')
  const canRefresh = computed(() => Boolean(session.value?.refreshToken))

  const setSession = (response: AuthResponse) => {
    const nextSession = ensureAuthResponse(response)
    session.value = nextSession
    persistSession(nextSession)
  }

  const clearSession = () => {
    session.value = null
    persistSession(null)
  }

  const withLoading = async <T>(operation: () => Promise<T>): Promise<T> => {
    loading.value = true
    try {
      return await operation()
    } finally {
      loading.value = false
    }
  }

  const register = async (payload: RegisterRequest) =>
    withLoading(async () => {
      try {
        const response = await authApi.register(payload)
        setSession(response)
        return response
      } catch (error) {
        clearSession()
        throw new Error(resolveErrorMessage(error))
      }
    })

  const login = async (payload: LoginRequest) =>
    withLoading(async () => {
      try {
        const response = await authApi.login(payload)
        setSession(response)
        return response
      } catch (error) {
        clearSession()
        throw new Error(resolveErrorMessage(error))
      }
    })

  const externalLogin = async (payload: ExternalAuthRequest) =>
    withLoading(async () => {
      try {
        const response = await authApi.externalLogin(payload)
        setSession(response)
        return response
      } catch (error) {
        clearSession()
        throw new Error(resolveErrorMessage(error))
      }
    })

  const loginWithGoogle = async (idToken: string) => externalLogin({ provider: 'google', idToken })

  const loginWithGithub = async (accessTokenValue: string) =>
    externalLogin({ provider: 'github', accessToken: accessTokenValue })

  const refreshSession = async () => {
    if (!session.value?.accessToken || !session.value.refreshToken) {
      throw new Error('No refresh token available.')
    }

    try {
      const response = await authApi.refresh({
        accessToken: session.value.accessToken,
        refreshToken: session.value.refreshToken,
      })
      setSession(response)
      return true
    } catch (error) {
      clearSession()
      throw new Error(resolveErrorMessage(error))
    }
  }

  const tryRefreshToken = async (): Promise<boolean> => {
    if (!canRefresh.value) {
      return false
    }

    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        try {
          await refreshSession()
          return true
        } catch (error) {
          console.warn('Refresh token request failed', error)
          return false
        } finally {
          refreshInFlight = null
        }
      })()
    }

    return refreshInFlight
  }

  const logout = async () => {
    if (!session.value?.refreshToken) {
      clearSession()
      return
    }

    try {
      await authApi.logout({ refreshToken: session.value.refreshToken })
    } catch (error) {
      // Log but do not block logout on failure (token may already be invalid)
      console.warn('Failed to notify backend about logout', error)
    } finally {
      clearSession()
    }
  }

  return {
    // State
    session,
    loading,
    isLoading,

    // Getters
    isAuthenticated,
    accessToken,
    refreshToken,
    displayName,
    email,
    canRefresh,

    // Actions
    register,
    login,
    externalLogin,
    loginWithGoogle,
    loginWithGithub,
    refreshSession,
    tryRefreshToken,
    logout,
    clearSession,
    setSession,
  }
})
