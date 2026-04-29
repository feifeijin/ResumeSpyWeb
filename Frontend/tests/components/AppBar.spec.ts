import { ref } from 'vue'
import { shallowMount } from '@vue/test-utils'
import AppBar from '../../../src/components/app/AppBar.vue'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

const pushMock = vi.fn()
const openMock = vi.fn()
const logoutMock = vi.fn(async () => undefined)
const toastSuccessMock = vi.fn()
const setLanguageMock = vi.fn()

const authRefs = {
  isAuthenticated: ref(false),
  displayName: ref(''),
  email: ref(''),
}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: ref('en'),
    t: (key: string) => {
      const map: Record<string, string> = {
        'navigation.create': 'Create',
        'navigation.mySpy': 'My Spy',
        'navigation.login': 'Login',
        'navigation.logout': 'Logout',
        'auth.logoutSuccess': 'Logged out successfully',
      }
      return map[key] ?? key
    },
  }),
}))

vi.mock('pinia', () => ({
  storeToRefs: () => authRefs,
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    logout: logoutMock,
  }),
}))

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    success: toastSuccessMock,
  }),
}))

vi.mock('@/i18n', () => ({
  changeLanguage: (code: string) => setLanguageMock(code),
  supportedLocales: ['en', 'zh', 'ja'],
  localeDisplayNames: { en: 'English', zh: '中文', ja: '日本語' },
  i18n: { global: { locale: 'en' } },
  default: { global: { locale: 'en' } },
}))

vi.mock('@/composables/useLanguageSwitch', () => ({
  useLanguageSwitch: () => ({
    changeLanguage: (code: string) => setLanguageMock(code),
    supportedLocales: ['en', 'zh', 'ja'],
    localeDisplayNames: { en: 'English', zh: '中文', ja: '日本語' },
  }),
}))

describe('AppBar', () => {
  beforeEach(() => {
    // Purpose: reset mutable auth state and spies between test cases.
    authRefs.isAuthenticated.value = false
    authRefs.displayName.value = ''
    authRefs.email.value = ''
    pushMock.mockReset()
    openMock.mockReset()
    logoutMock.mockClear()
    toastSuccessMock.mockReset()
    setLanguageMock.mockReset()
    ;(window as unknown as { open: typeof openMock }).open = openMock
  })

  const factory = () =>
    shallowMount(AppBar, {
      global: {
        mocks: {
          $vuetify: {
            display: {
              mdAndUp: true,
              smAndDown: false,
            },
          },
        },
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

  const mobileFactory = () =>
    shallowMount(AppBar, {
      global: {
        mocks: {
          $vuetify: {
            display: {
              mdAndUp: false,
              smAndDown: true,
            },
          },
        },
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

  it('opens GitHub link in new tab when GitHub menu item is clicked', async () => {
    // Purpose: validate external navigation branch inside menu handler.
    const wrapper = factory()
    const githubButton = wrapper.findAll('button').find((btn) => btn.text().includes('GitHub'))

    expect(githubButton).toBeDefined()
    await githubButton!.trigger('click')

    expect(openMock).toHaveBeenCalledWith('https://github.com/feifeijin/ResumeSpyWeb', '_blank')
  })

  it('navigates to auth route when login button is clicked', async () => {
    // Purpose: verify unauthenticated CTA routes users to login page.
    const wrapper = factory()
    const loginButton = wrapper.findAll('button').find((btn) => btn.text().includes('Login'))

    expect(loginButton).toBeDefined()
    await loginButton!.trigger('click')

    expect(pushMock).toHaveBeenCalledWith({ name: 'auth' })
  })

  it('calls changeLanguage helper when a language option is selected', async () => {
    // Purpose: ensure language selection delegates through i18n helper.
    const wrapper = factory()
    const languageButton = wrapper
      .findAll('[role="button"]')
      .find((btn) => btn.text().includes('中文'))

    expect(languageButton).toBeDefined()
    await languageButton!.trigger('click')

    expect(setLanguageMock).toHaveBeenCalledWith('zh')
  })

  it('shows language switcher in mobile drawer and calls changeLanguage on selection', async () => {
    // Purpose: verify the mobile drawer exposes the same language-switch capability as the desktop bar.
    const wrapper = mobileFactory()
    const languageButton = wrapper
      .findAll('[role="button"]')
      .find((btn) => btn.text().includes('中文'))

    expect(languageButton).toBeDefined()
    await languageButton!.trigger('click')

    expect(setLanguageMock).toHaveBeenCalledWith('zh')
  })

  it('logs out authenticated user, shows toast, and redirects home', async () => {
    // Purpose: validate auth interaction flow and side effects on logout.
    authRefs.isAuthenticated.value = true
    authRefs.displayName.value = 'Fei'

    const wrapper = factory()
    const logoutButton = wrapper
      .findAll('[role="button"]')
      .find((btn) => btn.text().includes('Logout'))

    expect(logoutButton).toBeDefined()
    await logoutButton!.trigger('click')

    expect(logoutMock).toHaveBeenCalledTimes(1)
    expect(toastSuccessMock).toHaveBeenCalledWith('Logged out successfully')
    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
