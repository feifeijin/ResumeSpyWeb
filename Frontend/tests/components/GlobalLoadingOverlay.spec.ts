import { createPinia, setActivePinia } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import GlobalLoadingOverlay from '../../../src/components/GlobalLoadingOverlay.vue'
import { useLoadingStore } from '../../../src/stores/loading'

// useI18n() is called in setup() — must be mocked at module level
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

// Teleport and Transition must be stubbed to render content inline in shallowMount
const globalStubs = {
  Teleport: { template: '<div><slot /></div>' },
  Transition: { template: '<div><slot /></div>' },
}

describe('GlobalLoadingOverlay', () => {
  beforeEach(() => {
    // Purpose: isolate Pinia state between tests.
    setActivePinia(createPinia())
  })

  it('shows fallback translation key when a loading state has no message', () => {
    // Purpose: validate fallback rendering — overlay is only visible when isGlobalLoading is true,
    // so we must start a loading op (without a message) to trigger v-if.
    const store = useLoadingStore()
    store.startLoading('test-op') // no message → component falls back to t('loading.processing')

    const wrapper = shallowMount(GlobalLoadingOverlay, {
      global: { stubs: globalStubs },
    })

    expect(wrapper.text()).toContain('loading.processing')
  })

  it('renders current loading message when a loading state exists', () => {
    // Purpose: ensure active loading message is shown to users.
    const store = useLoadingStore()
    store.startLoading('resume-save', 'Saving resume', 62)

    const wrapper = shallowMount(GlobalLoadingOverlay, {
      global: { stubs: globalStubs },
    })

    expect(wrapper.text()).toContain('Saving resume')
  })

  it('renders the most recent operation message when multiple are active', () => {
    // Purpose: verify that the last enqueued operation's message is displayed
    // (currentLoadingState returns the last entry in the map).
    const store = useLoadingStore()
    store.startLoading('first', 'First operation')
    store.startLoading('second', 'Second operation')

    const wrapper = shallowMount(GlobalLoadingOverlay, {
      global: { stubs: globalStubs },
    })

    expect(wrapper.text()).toContain('Second operation')
  })
})
