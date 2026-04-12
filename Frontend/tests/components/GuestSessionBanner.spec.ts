import { reactive, ref } from 'vue'
import { shallowMount } from '@vue/test-utils'
import GuestSessionBanner from '../../../src/components/GuestSessionBanner.vue'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

const pushMock = vi.fn()

const guestState = reactive({
  resumeCount: 1,
  maxResumeCount: 3,
  hasReachedLimit: false,
  isGuest: true,
})

const authState = reactive({
  isAuthenticated: false,
})

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (key === 'components.guestBanner.browsing') {
        return `Guest — ${params?.current}/${params?.max} dossiers on file`
      }
      const map: Record<string, string> = {
        'components.guestBanner.createAccount': 'Create Account',
        'components.guestBanner.signInContinue': 'Sign In to Continue',
        'components.guestBanner.close': 'Dismiss',
        'components.guestBanner.upgradeTitle': 'Open a Permanent File',
        'components.guestBanner.upgradeDesc': 'Create a free account to unlock:',
        'components.guestBanner.featureUnlimited': 'Unlimited dossiers',
        'components.guestBanner.featureStorage': 'Secure, permanent storage',
        'components.guestBanner.featureAi': 'AI tailoring & translation',
        'components.guestBanner.featurePdf': 'PDF export',
        'components.guestBanner.continueAsGuest': 'Continue as Guest',
        'components.guestBanner.signUpNow': 'Sign Up Now',
      }
      return map[key] ?? key
    },
  }),
}))

vi.mock('@/stores/guest', () => ({
  useGuestStore: () => guestState,
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState,
}))

describe('GuestSessionBanner', () => {
  beforeEach(() => {
    // Purpose: reset mock state to keep tests independent.
    guestState.resumeCount = 1
    guestState.maxResumeCount = 3
    guestState.hasReachedLimit = false
    guestState.isGuest = true
    authState.isAuthenticated = false
    pushMock.mockReset()
  })

  it('shows guest banner for unauthenticated guests with quota data loaded', async () => {
    // Purpose: ensure banner appears for anonymous users once maxResumeCount is known.
    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Guest — 1/3 dossiers on file')
  })

  it('hides banner when user is authenticated', async () => {
    // Purpose: authenticated users must never see the guest banner.
    authState.isAuthenticated = true

    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('dossiers on file')
  })

  it('hides banner before quota data loads (maxResumeCount is 0)', async () => {
    // Purpose: prevent "0/0 dossiers" flash before the API responds.
    guestState.maxResumeCount = 0

    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('dossiers on file')
  })

  it('shows create account button when limit is not reached', async () => {
    // Purpose: validate primary CTA before hitting quota.
    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons.some((btn) => btn.text().includes('Create Account'))).toBe(true)
  })

  it('shows sign-in CTA when guest limit is reached', async () => {
    // Purpose: validate limit-reached edge path for blocked guests.
    guestState.hasReachedLimit = true

    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons.some((btn) => btn.text().includes('Sign In to Continue'))).toBe(true)
  })

  it('dismisses the banner when close button is clicked', async () => {
    // Purpose: verify user can hide guest banner manually.
    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await wrapper.vm.$nextTick()

    // Close button is the last button in the banner
    const closeButtons = wrapper.findAll('button')
    const closeBtn = closeButtons.find((btn) => btn.attributes('aria-label') === 'Dismiss')
    expect(closeBtn).toBeDefined()
    await closeBtn!.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('dossiers on file')
  })

  it('navigates to auth route when sign up button is clicked', async () => {
    // Purpose: ensure CTA flow routes to the auth page (not a non-existent register route).
    guestState.hasReachedLimit = true

    const wrapper = shallowMount(GuestSessionBanner, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const signUpButton = wrapper.findAll('button').find((btn) => btn.text().includes('Sign Up Now'))
    expect(signUpButton).toBeDefined()

    await signUpButton!.trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'auth' })
  })
})
