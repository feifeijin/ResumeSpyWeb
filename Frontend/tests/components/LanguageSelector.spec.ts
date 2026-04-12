import { ref } from 'vue'
import { shallowMount } from '@vue/test-utils'
import LanguageSelector from '../../../src/components/LanguageSelector.vue'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

const localeRef = ref('en')
const changeLanguageMock = vi.fn()

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: localeRef,
    t: (key: string) => {
      const dictionary: Record<string, string> = {
        'languages.english': 'English',
        'languages.chinese': 'Chinese',
        'languages.japanese': 'Japanese',
      }
      return dictionary[key] ?? key
    },
  }),
}))

vi.mock('@/i18n', () => ({
  changeLanguage: (code: string) => changeLanguageMock(code),
  supportedLocales: ['en', 'zh', 'ja'],
  localeDisplayNames: { en: 'English', zh: '中文', ja: '日本語' },
  i18n: { global: { locale: 'en' } },
  default: { global: { locale: 'en' } },
}))

vi.mock('@/composables/useLanguageSwitch', () => ({
  useLanguageSwitch: () => ({
    changeLanguage: (code: string) => changeLanguageMock(code),
    supportedLocales: ['en', 'zh', 'ja'],
    localeDisplayNames: { en: 'English', zh: '中文', ja: '日本語' },
  }),
}))

describe('LanguageSelector', () => {
  beforeEach(() => {
    // Purpose: reset locale and spy state before each scenario.
    localeRef.value = 'en'
    changeLanguageMock.mockReset()
  })

  it('renders current locale name for known language', () => {
    // Purpose: verify selected locale label in trigger button.
    const wrapper = shallowMount(LanguageSelector, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
          CountryFlag: true,
        },
      },
    })

    expect(wrapper.text()).toContain('English')
  })

  it('falls back to EN label for unknown locale', () => {
    // Purpose: validate edge case when locale is outside supported list.
    localeRef.value = 'fr'

    const wrapper = shallowMount(LanguageSelector, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
          CountryFlag: true,
        },
      },
    })

    expect(wrapper.text()).toContain('EN')
  })

  it('calls changeLanguage when language option is clicked', async () => {
    // Purpose: verify user interaction updates locale through shared i18n helper.
    const wrapper = shallowMount(LanguageSelector, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
          CountryFlag: true,
        },
      },
    })

    const items = wrapper.findAll('[role="button"]')
    await items[1].trigger('click')

    expect(changeLanguageMock).toHaveBeenCalledWith('zh')
  })
})
