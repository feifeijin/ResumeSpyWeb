/** Response from POST /api/auth/sync — syncs Supabase session with local user */
export interface AuthSyncResponse {
  succeeded: boolean
  userId?: string
  email?: string
  displayName?: string
  isNewUser?: boolean
  errors?: string[]
}

/** Local session stored in the Pinia auth store */
export interface AuthSession {
  userId: string
  email: string
  displayName?: string
  accessToken: string
  isNewUser?: boolean
}
