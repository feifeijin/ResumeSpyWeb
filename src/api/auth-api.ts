import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { API_BASE_URL } from './api'
import type { AuthSyncResponse } from '@/models/auth.type'

const AUTH_BASE_URL = `${API_BASE_URL}/auth`

const authApi = {
  /** Sync Supabase session with backend (creates or finds local user) */
  async syncSession(): Promise<AuthSyncResponse> {
    const { data }: AxiosResponse<AuthSyncResponse> = await axios.post(`${AUTH_BASE_URL}/sync`)
    return data
  },

  /** Notify backend of logout (stateless — clears local state only) */
  async logout(): Promise<void> {
    await axios.post(`${AUTH_BASE_URL}/logout`)
  },
}

export default authApi
