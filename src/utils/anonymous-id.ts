const STORAGE_KEY = 'resumeSpy.anonymousUserId'

export function getAnonymousId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem(STORAGE_KEY)
}

export function getOrCreateAnonymousId(): string {
  const existing = getAnonymousId()
  if (existing) {
    return existing
  }

  const id = crypto.randomUUID()
  localStorage.setItem(STORAGE_KEY, id)
  return id
}

export function clearAnonymousId(): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem(STORAGE_KEY)
}
