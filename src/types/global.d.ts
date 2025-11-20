export {}

declare global {
  interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  namespace google {
    namespace accounts.id {
      interface CredentialResponse {
        credential: string
        clientId?: string
        select_by?: string
      }

      interface IdConfiguration {
        client_id: string
        callback: (response: CredentialResponse) => void
        auto_select?: boolean
        cancel_on_tap_outside?: boolean
        prompt_parent_id?: string
      }

      interface GsiButtonConfiguration {
        type?: 'standard' | 'icon'
        theme?: 'outline' | 'filled_blue' | 'filled_black'
        size?: 'large' | 'medium' | 'small'
        width?: number
      }
    }
  }

  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize(config: google.accounts.id.IdConfiguration): void
          renderButton(
            element: HTMLElement,
            options: google.accounts.id.GsiButtonConfiguration,
          ): void
          prompt(callback?: () => void): void
        }
      }
    }
  }
}
