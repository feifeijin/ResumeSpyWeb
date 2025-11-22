export interface AuthResponse {
  succeeded: boolean
  accessToken?: string
  accessTokenExpiresAt?: string
  refreshToken?: string
  refreshTokenExpiresAt?: string
  userId?: string
  email?: string
  displayName?: string
  isNewUser?: boolean
  errors?: string[]
}

export interface EmailLinkRequest {
  email: string
  redirectUrl?: string
}

export interface ConfirmEmailLinkRequest {
  email: string
  token: string
}

export interface RefreshTokenRequest {
  accessToken: string
  refreshToken: string
}

export interface ExternalAuthRequest {
  provider: string
  accessToken?: string
  idToken?: string
  email?: string
  displayName?: string
  avatarUrl?: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface AuthSession {
  userId: string
  email: string
  displayName?: string
  accessToken: string
  accessTokenExpiresAt?: string
  refreshToken: string
  refreshTokenExpiresAt?: string
  isNewUser?: boolean
}
