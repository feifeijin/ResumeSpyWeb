import { createPinia, setActivePinia } from 'pinia'
import { useCounterStore } from '../../../src/stores/counter'

describe('counter store', () => {
  beforeEach(() => {
    // Purpose: ensure each test gets a clean Pinia instance.
    setActivePinia(createPinia())
  })

  it('starts with zero count and computed double count', () => {
    // Purpose: validate initial state and derived value.
    const store = useCounterStore()
    expect(store.count).toBe(0)
    expect(store.doubleCount).toBe(0)
  })

  it('increments count and recomputes double count', () => {
    // Purpose: verify state mutation and computed update path.
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
    expect(store.doubleCount).toBe(2)
  })

  it('resets count to zero', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    store.reset()
    expect(store.count).toBe(0)
    expect(store.doubleCount).toBe(0)
  })
})
