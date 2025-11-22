import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { API_BASE_URL } from './api'
import type {
  AuthResponse,
  ConfirmEmailLinkRequest,
  EmailLinkRequest,
  ExternalAuthRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from '@/models/auth.type'

const AUTH_BASE_URL = `${API_BASE_URL}/auth`

const authApi = {
  async requestMagicLink(payload: EmailLinkRequest): Promise<AuthResponse> {
    const { data }: AxiosResponse<AuthResponse> = await axios.post(
      `${AUTH_BASE_URL}/magic/request`,
      payload,
    )
    return data
  },

  async confirmMagicLink(payload: ConfirmEmailLinkRequest): Promise<AuthResponse> {
    const { data }: AxiosResponse<AuthResponse> = await axios.post(
      `${AUTH_BASE_URL}/magic/confirm`,
      payload,
    )
    return data
  },

  async refresh(payload: RefreshTokenRequest): Promise<AuthResponse> {
    const { data }: AxiosResponse<AuthResponse> = await axios.post(
      `${AUTH_BASE_URL}/refresh`,
      payload,
    )
    return data
  },

  async externalLogin(payload: ExternalAuthRequest): Promise<AuthResponse> {
    const { data }: AxiosResponse<AuthResponse> = await axios.post(
      `${AUTH_BASE_URL}/external`,
      payload,
    )
    return data
  },

  async logout(payload: LogoutRequest): Promise<void> {
    await axios.post(`${AUTH_BASE_URL}/logout`, payload)
  },
}

export default authApi
