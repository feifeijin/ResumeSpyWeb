import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'

export type MessageLanguages = keyof typeof en

// Get language from localStorage or default to 'en'
const getStoredLanguage = (): string => {
  const stored = localStorage.getItem('app-language')
  if (stored && ['en', 'zh', 'ja'].includes(stored)) {
    return stored
  }
  // Try to detect browser language
  const browserLang = navigator.language.split('-')[0]
  const supportedLangs = ['en', 'zh', 'ja']
  return supportedLangs.includes(browserLang) ? browserLang : 'en'
}

export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getStoredLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    ja,
  },
})

// Helper function to change language
export const changeLanguage = (locale: string) => {
  if (['en', 'zh', 'ja'].includes(locale)) {
    i18n.global.locale.value = locale as 'en' | 'zh' | 'ja'
    localStorage.setItem('app-language', locale)
    document.documentElement.lang = locale
  }
}

export default i18n
