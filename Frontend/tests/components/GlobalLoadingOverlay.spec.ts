import { createPinia, setActivePinia } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import GlobalLoadingOverlay from '../../../src/components/GlobalLoadingOverlay.vue'
import { useLoadingStore } from '../../../src/stores/loading'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

describe('GlobalLoadingOverlay', () => {
  beforeEach(() => {
    // Purpose: isolate Pinia state between tests.
    setActivePinia(createPinia())
  })

  it('shows fallback translation when there is no active loading message', () => {
    // Purpose: validate fallback text rendering for empty loading state.
    const wrapper = shallowMount(GlobalLoadingOverlay, {
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    expect(wrapper.text()).toContain('common.loading')
  })

  it('renders current message and progress when a loading state exists', () => {
    // Purpose: ensure active loading details are visible to users.
    const store = useLoadingStore()
    store.startLoading('resume-save', 'Saving resume', 62)

    const wrapper = shallowMount(GlobalLoadingOverlay, {
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    expect(wrapper.text()).toContain('Saving resume')
    expect(wrapper.text()).toContain('62%')
  })

  it('shows queue information when multiple operations are active', () => {
    // Purpose: verify edge case where multiple concurrent operations are queued.
    const store = useLoadingStore()
    store.startLoading('first', 'First operation', 10)
    store.startLoading('second', 'Second operation', 90)

    const wrapper = shallowMount(GlobalLoadingOverlay, {
      global: {
        mocks: {
          $t: (key: string, params?: { count: number }) =>
            key === 'common.operationsInQueue' ? `operations:${params?.count ?? 0}` : key,
        },
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    expect(wrapper.text()).toContain('operations:2')
  })
})
