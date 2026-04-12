import { createI18n } from 'vue-i18n'

/**
 * Auto-discover all locale files via Vite's glob import.
 *
 * To add a new language: drop `src/locales/fr.json` (with a `_meta.nativeName` key)
 * and it will be picked up automatically — no code changes required.
 */
const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  './locales/*.json',
  { eager: true },
)

// Build the messages map: { en: {...}, zh: {...}, ja: {...}, ... }
const messages = Object.fromEntries(
  Object.entries(localeModules).map(([path, mod]) => {
    const code = path.replace('./locales/', '').replace('.json', '')
    return [code, mod.default]
  }),
) as Record<string, Record<string, unknown>>

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
    (mod._meta as Record<string, string> | undefined)?.nativeName ?? code.toUpperCase(),
  ]),
)

/**
 * Language detection priority:
 *   1. ?lang= URL query parameter (set by sitemap alternate links & share links)
 *   2. Stored user preference (localStorage)
 *   3. Browser language (navigator.language)
 *   4. Default → 'en'
 *
 * When a ?lang= param is present it is also written to localStorage so the
 * user's preference is remembered on subsequent visits.
 */
function detectLocale(): string {
  const urlLang = new URLSearchParams(window.location.search).get('lang')
  if (urlLang && supportedLocales.includes(urlLang)) {
    localStorage.setItem('app-language', urlLang)
    document.documentElement.lang = urlLang
    return urlLang
  }
  const stored = localStorage.getItem('app-language')
  if (stored && supportedLocales.includes(stored)) return stored
  const browser = navigator.language.split('-')[0]
  return supportedLocales.includes(browser) ? browser : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: messages as any,
  missingWarn: false,
  fallbackWarn: false,
})

/** Switch language, persist the choice, and update the document lang attribute. */
export function changeLanguage(locale: string): void {
  if (!supportedLocales.includes(locale)) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18n.global.locale = locale as any
  localStorage.setItem('app-language', locale)
  document.documentElement.lang = locale
}

export default i18n
