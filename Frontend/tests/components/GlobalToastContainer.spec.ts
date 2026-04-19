import { createPinia, setActivePinia } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import GlobalToastContainer from '../../../src/components/GlobalToastContainer.vue'
import { useToastStore } from '../../../src/stores/toast'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

describe('GlobalToastContainer', () => {
  beforeEach(() => {
    // Purpose: reset store state before each test.
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('maps toast type to proper CSS class and renders message', () => {
    // Purpose: protect visual semantics — each toast type gets its own colour class.
    const store = useToastStore()
    store.showError('Request failed')

    const wrapper = shallowMount(GlobalToastContainer, {
      global: { stubs: { ...commonVuetifyStubs, TransitionGroup: false } },
    })

    const item = wrapper.find('.toast-item--error')
    expect(item.exists()).toBe(true)
    expect(wrapper.text()).toContain('Request failed')
  })

  it('executes custom action callback when action button is clicked', async () => {
    // Purpose: verify user interaction path for actionable toasts.
    const actionSpy = vi.fn()
    const store = useToastStore()
    store.addToast({
      message: 'Undo delete?',
      type: 'warning',
      actions: [{ text: 'Undo', action: actionSpy }],
      persistent: true,
    })

    const wrapper = shallowMount(GlobalToastContainer, {
      global: { stubs: { ...commonVuetifyStubs, TransitionGroup: false } },
    })

    const actionButton = wrapper.find('.toast-action-btn')
    await actionButton.trigger('click')
    expect(actionSpy).toHaveBeenCalledTimes(1)
  })

  it('removes a toast when the close button is clicked', async () => {
    // Purpose: test dismiss behavior for the close button.
    const store = useToastStore()
    const id = store.showInfo('Dismiss me')

    const wrapper = shallowMount(GlobalToastContainer, {
      global: { stubs: { ...commonVuetifyStubs, TransitionGroup: false } },
    })

    const closeBtn = wrapper.find('.toast-close')
    await closeBtn.trigger('click')

    expect(store.toasts.find((toast) => toast.id === id)).toBeUndefined()
  })
})
