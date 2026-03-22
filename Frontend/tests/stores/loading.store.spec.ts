import { createPinia, setActivePinia } from 'pinia'
import { useLoadingStore } from '../../../src/stores/loading'

describe('loading store', () => {
  beforeEach(() => {
    // Purpose: reset store state for deterministic tests.
    setActivePinia(createPinia())
  })

  it('tracks global loading and current loading state', () => {
    // Purpose: assert core state transitions for start/stop lifecycle.
    const store = useLoadingStore()
    store.startLoading('save', 'Saving', 20)

    expect(store.isGlobalLoading).toBe(true)
    expect(store.currentLoadingState).toEqual({ id: 'save', message: 'Saving', progress: 20 })
  })

  it('updates an existing loading state without overriding undefined fields', () => {
    // Purpose: cover partial update behavior and input validation semantics.
    const store = useLoadingStore()
    store.startLoading('save', 'Saving', 20)
    store.updateLoading('save', undefined, 80)

    expect(store.currentLoadingState).toEqual({ id: 'save', message: 'Saving', progress: 80 })
  })

  it('ignores updates for unknown loading ids', () => {
    // Purpose: ensure invalid ids do not create accidental loading entries.
    const store = useLoadingStore()
    store.updateLoading('unknown', 'Should not exist', 99)

    expect(store.loadingStates).toEqual([])
    expect(store.isGlobalLoading).toBe(false)
  })

  it('stops one loading operation and clears all operations', () => {
    // Purpose: validate both single-stop and bulk-clear branches.
    const store = useLoadingStore()
    store.startLoading('one', 'One', 10)
    store.startLoading('two', 'Two', 30)

    store.stopLoading('one')
    expect(store.loadingStates).toHaveLength(1)

    store.stopAllLoading()
    expect(store.loadingStates).toHaveLength(0)
    expect(store.isGlobalLoading).toBe(false)
  })
})
