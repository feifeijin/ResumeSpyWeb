import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { API_BASE_URL } from './api'
import type {
  AuthResponse,
  ExternalAuthRequest,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '@/models/auth.type'

const AUTH_BASE_URL = `${API_BASE_URL}/auth`

const authApi = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data }: AxiosResponse<AuthResponse> = await axios.post(
      `${AUTH_BASE_URL}/register`,
      payload,
    )
    return data
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data }: AxiosResponse<AuthResponse> = await axios.post(
      `${AUTH_BASE_URL}/login`,
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
