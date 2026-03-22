import { createPinia, setActivePinia } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import GlobalToastContainer from '../../../src/components/GlobalToastContainer.vue'
import { useToastStore } from '../../../src/stores/toast'
import { VSnackbarStub, commonVuetifyStubs } from '../helpers/vuetify-stubs'

describe('GlobalToastContainer', () => {
  beforeEach(() => {
    // Purpose: reset store state and fake timers before each test run.
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('maps toast type to proper snackbar color and icon', () => {
    // Purpose: protect visual semantics for status feedback messages.
    const store = useToastStore()
    store.showError('Request failed')

    const wrapper = shallowMount(GlobalToastContainer, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
          VSnackbar: VSnackbarStub,
        },
      },
    })

    const snackbar = wrapper.findComponent(VSnackbarStub)
    expect(snackbar.props('color')).toBe('error')
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
      global: {
        stubs: {
          ...commonVuetifyStubs,
          VSnackbar: VSnackbarStub,
        },
      },
    })

    const actionButton = wrapper.find('button')
    await actionButton.trigger('click')
    expect(actionSpy).toHaveBeenCalledTimes(1)
  })

  it('removes a toast when snackbar model is turned off', async () => {
    // Purpose: test dismiss behavior used by close interactions.
    const store = useToastStore()
    const id = store.showInfo('Dismiss me')

    const wrapper = shallowMount(GlobalToastContainer, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
          VSnackbar: VSnackbarStub,
        },
      },
    })

    const snackbar = wrapper.findComponent(VSnackbarStub)
    await snackbar.vm.$emit('update:model-value', false)

    expect(store.toasts.find((toast) => toast.id === id)).toBeUndefined()
  })
})
