/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string | undefined
  readonly VITE_SUPABASE_URL: string | undefined
  readonly VITE_SUPABASE_ANON_KEY: string | undefined
  readonly VITE_PLAUSIBLE_DOMAIN: string | undefined
  readonly VITE_PLAUSIBLE_API_HOST: string | undefined
  readonly VITE_POSTHOG_KEY: string | undefined
  readonly VITE_POSTHOG_HOST: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
