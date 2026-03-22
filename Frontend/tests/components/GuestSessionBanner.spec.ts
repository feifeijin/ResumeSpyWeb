import { reactive } from 'vue'
import { shallowMount } from '@vue/test-utils'
import GuestSessionBanner from '../../../src/components/GuestSessionBanner.vue'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

const pushMock = vi.fn()

const guestState = reactive({
  resumeCount: 1,
  maxResumeCount: 3,
  hasReachedLimit: false,
  isGuest: true,
  initializeGuestSession: vi.fn(async () => true),
})

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('@/stores/guest', () => ({
  useGuestStore: () => guestState,
}))

describe('GuestSessionBanner', () => {
  beforeEach(() => {
    // Purpose: reset mock state to keep tests independent.
    guestState.resumeCount = 1
    guestState.maxResumeCount = 3
    guestState.hasReachedLimit = false
    guestState.isGuest = true
    guestState.initializeGuestSession = vi.fn(async () => true)
    pushMock.mockReset()
  })

  it('shows guest banner after mounted when guest session exists', async () => {
    // Purpose: ensure banner appears for anonymous users.
    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain("You're browsing as a guest")
  })

  it('opens upgrade dialog automatically when limit is reached', async () => {
    // Purpose: validate limit-reached edge path for blocked guests.
    guestState.hasReachedLimit = true

    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Create an Account to Continue')
  })

  it('dismisses the banner when close action is clicked', async () => {
    // Purpose: verify user can hide guest banner manually.
    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await Promise.resolve()
    await wrapper.vm.$nextTick()

    const closeButtons = wrapper.findAll('button')
    await closeButtons[1].trigger('click')

    expect(wrapper.text()).not.toContain("You're browsing as a guest")
  })

  it('navigates to signup route when user confirms account creation', async () => {
    // Purpose: ensure CTA flow routes to registration page.
    guestState.hasReachedLimit = true

    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await Promise.resolve()
    await wrapper.vm.$nextTick()

    const signUpButton = wrapper.findAll('button').find((btn) => btn.text().includes('Sign Up Now'))
    expect(signUpButton).toBeDefined()

    await signUpButton!.trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/auth/register')
  })
})
