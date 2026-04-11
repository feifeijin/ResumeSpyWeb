import { useI18n } from 'vue-i18n'
import { supportedLocales, i18n, localeDisplayNames } from '@/i18n'

/**
 * Composable for switching languages with proper Vue reactivity
 */
export function useLanguageSwitch() {
  const { locale } = useI18n()

  const changeLanguage = (langCode: string): void => {
    if (!supportedLocales.includes(langCode)) return

    // Use the WritableComputedRef to properly trigger reactivity
    locale.value = langCode

    // Persist the choice
    localStorage.setItem('app-language', langCode)

    // Update the document lang attribute
    document.documentElement.lang = langCode
  }

  return {
    changeLanguage,
    supportedLocales,
    localeDisplayNames,
    i18n,
  }
}
