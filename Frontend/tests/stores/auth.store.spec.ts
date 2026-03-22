import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../../../src/stores/auth'

const signInWithOtpMock = vi.fn()
const getSessionMock = vi.fn()
const signOutMock = vi.fn()
const onAuthStateChangeMock = vi.fn()
const syncSessionMock = vi.fn()
const logoutApiMock = vi.fn()
const clearGuestSessionMock = vi.fn()
const clearAnonymousIdMock = vi.fn()
const pushMock = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: (args: unknown) => signInWithOtpMock(args),
      getSession: () => getSessionMock(),
      signOut: () => signOutMock(),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
    },
  },
}))

vi.mock('@/api/auth-api', () => ({
  __esModule: true,
  default: {
    syncSession: () => syncSessionMock(),
    logout: () => logoutApiMock(),
  },
}))

vi.mock('@/stores/guest', () => ({
  useGuestStore: () => ({
    clearGuestSession: clearGuestSessionMock,
  }),
}))

vi.mock('@/utils/anonymous-id', () => ({
  clearAnonymousId: () => clearAnonymousIdMock(),
}))

vi.mock('@/router', () => ({
  __esModule: true,
  default: {
    push: (arg: unknown) => pushMock(arg),
  },
}))

describe('auth store', () => {
  beforeEach(() => {
    // Purpose: reset all auth dependency mocks and Pinia state.
    setActivePinia(createPinia())
    signInWithOtpMock.mockReset()
    getSessionMock.mockReset()
    signOutMock.mockReset()
    onAuthStateChangeMock.mockReset()
    syncSessionMock.mockReset()
    logoutApiMock.mockReset()
    clearGuestSessionMock.mockReset()
    clearAnonymousIdMock.mockReset()
    pushMock.mockReset()
  })

  it('sends magic link with expected redirect URL and resets loading', async () => {
    // Purpose: verify OTP request payload and loading lifecycle.
    signInWithOtpMock.mockResolvedValue({ error: null })
    const store = useAuthStore()

    await store.sendMagicLink('hello@example.com')

    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: 'hello@example.com',
      options: {
        emailRedirectTo: `${window.location.origin}/auth/magic`,
      },
    })
    expect(store.isLoading).toBe(false)
  })

  it('throws when Supabase returns error while sending magic link', async () => {
    // Purpose: cover validation/error branch for OTP send failure.
    signInWithOtpMock.mockResolvedValue({ error: { message: 'Invalid email' } })
    const store = useAuthStore()

    await expect(store.sendMagicLink('bad-email')).rejects.toThrow('Invalid email')
    expect(store.isLoading).toBe(false)
  })

  it('handles callback, syncs backend, and clears guest artifacts when conversion succeeds', async () => {
    // Purpose: validate full callback-to-sync happy path.
    const store = useAuthStore()
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          user: {
            id: 'supa-user',
            email: 'user@example.com',
          },
        },
      },
      error: null,
    })
    syncSessionMock.mockResolvedValue({
      succeeded: true,
      userId: 'backend-user',
      displayName: 'Resume Hero',
      isNewUser: true,
      convertedResumeCount: 0,
    })

    await store.handleMagicLinkCallback()

    expect(store.isAuthenticated).toBe(true)
    expect(store.accessToken).toBe('access-token')
    expect(store.displayName).toBe('Resume Hero')
    expect(clearGuestSessionMock).toHaveBeenCalledTimes(1)
    expect(clearAnonymousIdMock).toHaveBeenCalledTimes(1)
  })

  it('throws when callback session is missing', async () => {
    // Purpose: test edge case where Supabase callback lacks session data.
    const store = useAuthStore()
    getSessionMock.mockResolvedValue({ data: { session: null }, error: null })

    await expect(store.handleMagicLinkCallback()).rejects.toThrow(
      'No session returned from Supabase.',
    )
    expect(store.isLoading).toBe(false)
  })

  it('keeps anonymous id when conversion fails and convertedResumeCount is negative', async () => {
    // Purpose: validate retry-friendly behavior for failed resume conversion.
    const store = useAuthStore()
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          user: { id: 'supa-user', email: 'user@example.com' },
        },
      },
      error: null,
    })
    syncSessionMock.mockResolvedValue({
      succeeded: true,
      userId: 'backend-user',
      convertedResumeCount: -1,
    })

    await store.handleMagicLinkCallback()

    expect(clearAnonymousIdMock).not.toHaveBeenCalled()
  })

  it('logs out even if APIs fail and navigates to auth', async () => {
    // Purpose: verify robust logout fallback for partial dependency failures.
    const store = useAuthStore()
    store.session = {
      accessToken: 'x',
      userId: 'u1',
      email: 'e@example.com',
    }
    logoutApiMock.mockRejectedValue(new Error('backend fail'))
    signOutMock.mockRejectedValue(new Error('supabase fail'))

    await store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(pushMock).toHaveBeenCalledWith({ name: 'auth' })
  })

  it('initializes only once and registers auth state listener', async () => {
    // Purpose: ensure idempotent initialization and listener setup.
    const store = useAuthStore()
    getSessionMock.mockResolvedValue({ data: { session: null } })

    await store.initialize()
    await store.initialize()

    expect(getSessionMock).toHaveBeenCalledTimes(1)
    expect(onAuthStateChangeMock).toHaveBeenCalledTimes(1)
  })
})
