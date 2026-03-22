import { createPinia, setActivePinia } from 'pinia'
import { useGuestStore } from '../../../src/stores/guest'

const { checkResumeQuotaMock, getAnonymousIdMock, isAxiosErrorMock } = vi.hoisted(() => ({
  checkResumeQuotaMock: vi.fn(),
  getAnonymousIdMock: vi.fn(),
  isAxiosErrorMock: vi.fn(),
}))

vi.mock('@/api/anonymous-user-api', () => ({
  __esModule: true,
  default: {
    checkResumeQuota: checkResumeQuotaMock,
  },
}))

vi.mock('@/utils/anonymous-id', () => ({
  getAnonymousId: () => getAnonymousIdMock(),
}))

vi.mock('axios', () => ({
  __esModule: true,
  default: {
    isAxiosError: (error: unknown) => isAxiosErrorMock(error),
  },
}))

describe('guest store', () => {
  beforeEach(() => {
    // Purpose: ensure mocked dependencies and Pinia state are reset each run.
    setActivePinia(createPinia())
    checkResumeQuotaMock.mockReset()
    getAnonymousIdMock.mockReset()
    isAxiosErrorMock.mockReset()
    getAnonymousIdMock.mockReturnValue('anon-1')
  })

  it('computes guest and quota flags from state', () => {
    // Purpose: verify computed guardrails for creation limit behavior.
    const store = useGuestStore()
    store.resumeCount = 1
    store.maxResumeCount = 2

    expect(store.isGuest).toBe(true)
    expect(store.canCreateResume).toBe(true)
    expect(store.hasReachedLimit).toBe(false)

    store.resumeCount = 2
    expect(store.canCreateResume).toBe(false)
    expect(store.hasReachedLimit).toBe(true)
  })

  it('loads quota successfully and updates counts', async () => {
    // Purpose: validate happy path API sync for anonymous quota.
    const store = useGuestStore()
    checkResumeQuotaMock.mockResolvedValue({ currentCount: 2, maxAllowed: 5 })

    const result = await store.checkResumeQuota()

    expect(result).toEqual({ currentCount: 2, maxAllowed: 5 })
    expect(store.resumeCount).toBe(2)
    expect(store.maxResumeCount).toBe(5)
    expect(store.error).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('clears guest session on 401/400 API errors', async () => {
    // Purpose: cover authentication-related error handling branch.
    const store = useGuestStore()
    store.resumeCount = 3

    const axiosLikeError = {
      response: {
        status: 401,
      },
      message: 'Unauthorized',
    }
    checkResumeQuotaMock.mockRejectedValue(axiosLikeError)
    isAxiosErrorMock.mockReturnValue(true)

    const result = await store.checkResumeQuota()

    expect(result).toBeNull()
    expect(store.resumeCount).toBe(0)
    expect(store.error).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('keeps guest session for non-auth errors and stores error message', async () => {
    // Purpose: ensure non-auth failures do not force anonymous session reset.
    const store = useGuestStore()
    store.resumeCount = 2

    checkResumeQuotaMock.mockRejectedValue(new Error('Network down'))
    isAxiosErrorMock.mockReturnValue(false)

    const result = await store.checkResumeQuota()

    expect(result).toBeNull()
    expect(store.resumeCount).toBe(2)
    expect(store.error).toBe('Network down')
  })

  it('initializes guest session and returns true when quota check succeeds', async () => {
    // Purpose: verify initialization control flow for existing guest identity.
    const store = useGuestStore()
    checkResumeQuotaMock.mockResolvedValue({ currentCount: 1, maxAllowed: 3 })

    const initialized = await store.initializeGuestSession()

    expect(initialized).toBe(true)
    expect(checkResumeQuotaMock).toHaveBeenCalledTimes(1)
  })

  it('decrements count without going below zero', () => {
    // Purpose: validate lower-bound input handling for mutable counters.
    const store = useGuestStore()
    store.resumeCount = 0

    store.decrementResumeCount()
    expect(store.resumeCount).toBe(0)

    store.incrementResumeCount()
    store.decrementResumeCount()
    expect(store.resumeCount).toBe(0)
  })
})
