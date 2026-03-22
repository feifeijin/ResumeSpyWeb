import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '../../../src/stores/toast'

describe('toast store', () => {
  beforeEach(() => {
    // Purpose: isolate toast state and timer behavior across tests.
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('adds toast with default duration by type', () => {
    // Purpose: verify default duration mapping is applied correctly.
    const store = useToastStore()
    const id = store.showError('Server failed')

    const toast = store.toasts.find((item) => item.id === id)
    expect(toast).toBeDefined()
    expect(toast?.duration).toBe(8000)
  })

  it('enforces maximum of 3 toasts and keeps newest first', () => {
    // Purpose: test queue truncation edge case when many toasts are pushed.
    const store = useToastStore()
    store.showInfo('One')
    store.showInfo('Two')
    store.showInfo('Three')
    store.showInfo('Four')

    expect(store.toasts).toHaveLength(3)
    expect(store.toasts[0].message).toBe('Four')
  })

  it('auto-removes non-persistent toast after timeout', () => {
    // Purpose: validate delayed removal behavior for timed notifications.
    const store = useToastStore()
    const id = store.addToast({ message: 'Short lived', type: 'success', duration: 1000 })

    expect(store.toasts.some((toast) => toast.id === id)).toBe(true)
    vi.advanceTimersByTime(1000)

    expect(store.toasts.some((toast) => toast.id === id)).toBe(false)
  })

  it('does not auto-remove persistent toasts', () => {
    // Purpose: ensure persistent option disables timer-based removal.
    const store = useToastStore()
    const id = store.addToast({
      message: 'Keep me',
      type: 'warning',
      duration: 200,
      persistent: true,
    })

    vi.advanceTimersByTime(500)
    expect(store.toasts.some((toast) => toast.id === id)).toBe(true)
  })

  it('clears and removes toasts explicitly', () => {
    // Purpose: verify manual removal APIs for explicit control paths.
    const store = useToastStore()
    const id = store.showSuccess('Created')

    store.removeToast(id)
    expect(store.toasts).toHaveLength(0)

    store.showInfo('a')
    store.showWarning('b')
    store.clearAllToasts()
    expect(store.toasts).toHaveLength(0)
  })
})
