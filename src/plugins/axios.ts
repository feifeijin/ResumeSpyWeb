import axios from 'axios'
import type { Pinia } from 'pinia'
import { API_BASE_URL } from '@/api/api'
import { useAuthStore } from '@/stores/auth'
import { getOrCreateAnonymousId } from '@/utils/anonymous-id'
import { supabase } from '@/lib/supabase'

let interceptorsRegistered = false

export const setupAxiosInterceptors = (pinia: Pinia) => {
  if (interceptorsRegistered) {
    return
  }

  axios.defaults.baseURL = API_BASE_URL
  axios.defaults.withCredentials = true

  axios.interceptors.request.use(async (config) => {
    const authStore = useAuthStore(pinia)
    config.headers = config.headers || {}

    if (authStore.isAuthenticated) {
      // Let Supabase handle token refresh automatically
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token ?? authStore.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } else {
      config.headers['X-Anonymous-Id'] = getOrCreateAnonymousId()
    }

    return config
  })

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status
      const url = error.config?.url ?? ''

      if (status === 401 && !url.includes('/auth/')) {
        const authStore = useAuthStore(pinia)
        authStore.clearSession()
      }

      return Promise.reject(error)
    },
  )

  interceptorsRegistered = true
}
