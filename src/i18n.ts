import { createI18n } from 'vue-i18n'

/**
 * Auto-discover all locale files via Vite's glob import.
 *
 * To add a new language: drop `src/locales/fr.json` (with a `_meta.nativeName` key)
 * and it will be picked up automatically — no code changes required.
 */
const localeModules = import.meta.glob<Record<string, unknown>>(
  './locales/*.json',
  { eager: true },
)

// Build the messages map: { en: {...}, zh: {...}, ja: {...}, ... }
const messages = Object.fromEntries(
  Object.entries(localeModules).map(([path, mod]) => {
    const code = path.replace('./locales/', '').replace('.json', '')
    return [code, mod]
  }),
)

/** All locale codes derived from the JSON file names (e.g. ['en', 'ja', 'zh']) */
export const supportedLocales: string[] = Object.keys(messages).sort()

/**
 * Native display names for the language switcher.
 * Each locale JSON must contain: `"_meta": { "nativeName": "..." }`
 * Falls back to the uppercase code if the key is missing.
 */
export const localeDisplayNames: Record<string, string> = Object.fromEntries(
  Object.entries(messages).map(([code, mod]) => [
    code,
    (mod as any)._meta?.nativeName ?? code.toUpperCase(),
  ]),
)

/**
 * Language detection priority:
 *   1. Stored user preference (localStorage)
 *   2. Browser language (navigator.language)
 *   3. Default → 'en'
 */
function detectLocale(): string {
  const stored = localStorage.getItem('app-language')
  if (stored && supportedLocales.includes(stored)) return stored
  const browser = navigator.language.split('-')[0]
  return supportedLocales.includes(browser) ? browser : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages,
  missingWarn: false,
  fallbackWarn: false,
})

/** Switch language, persist the choice, and update the document lang attribute. */
export function changeLanguage(locale: string): void {
  if (!supportedLocales.includes(locale)) return
  i18n.global.locale.value = locale
  localStorage.setItem('app-language', locale)
  document.documentElement.lang = locale
}

export default i18n
