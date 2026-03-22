import {
  clearAnonymousId,
  getAnonymousId,
  getOrCreateAnonymousId,
} from '../../../src/utils/anonymous-id'

describe('anonymous-id utils', () => {
  beforeEach(() => {
    // Purpose: clear storage and reset UUID mock for deterministic tests.
    localStorage.clear()
    vi.spyOn(global.crypto, 'randomUUID').mockReturnValue('uuid-12345')
  })

  it('returns null when no anonymous id is stored', () => {
    // Purpose: validate empty-state lookup behavior.
    expect(getAnonymousId()).toBeNull()
  })

  it('creates and stores anonymous id when absent', () => {
    // Purpose: verify id creation and localStorage persistence.
    const id = getOrCreateAnonymousId()

    expect(id).toBe('uuid-12345')
    expect(localStorage.getItem('resumeSpy.anonymousUserId')).toBe('uuid-12345')
  })

  it('reuses existing anonymous id instead of creating a new one', () => {
    // Purpose: ensure stable identity between calls.
    localStorage.setItem('resumeSpy.anonymousUserId', 'existing-id')

    const id = getOrCreateAnonymousId()

    expect(id).toBe('existing-id')
    expect(global.crypto.randomUUID).not.toHaveBeenCalled()
  })

  it('clears stored anonymous id', () => {
    // Purpose: validate cleanup path for guest-to-auth conversion.
    localStorage.setItem('resumeSpy.anonymousUserId', 'to-be-cleared')

    clearAnonymousId()

    expect(localStorage.getItem('resumeSpy.anonymousUserId')).toBeNull()
  })
})
