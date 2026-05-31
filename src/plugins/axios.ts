import axios from 'axios'
import type { Pinia } from 'pinia'
import { API_BASE_URL } from '@/api/api'
import { useAuthStore } from '@/stores/auth'
import { useServiceStatusStore } from '@/stores/serviceStatus'
import { getAnonymousId, getOrCreateAnonymousId } from '@/utils/anonymous-id'
import { supabase } from '@/lib/supabase'

let interceptorsRegistered = false

// Statuses that indicate the backend itself is unreachable or in a degraded
// state where the user should see a friendly "service unavailable" screen,
// not a generic toast / broken view.
const DOWN_STATUSES = new Set([502, 503, 504])

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
      // Also send anonymous ID if it exists (for guest→user resume transfer during sync)
      const anonymousId = getAnonymousId()
      if (anonymousId) {
        config.headers['X-Anonymous-Id'] = anonymousId
      }
    } else {
      config.headers['X-Anonymous-Id'] = getOrCreateAnonymousId()
    }

    return config
  })

  axios.interceptors.response.use(
    (response) => {
      // Any successful response means the backend is reachable again.
      const serviceStatus = useServiceStatusStore(pinia)
      if (serviceStatus.apiDown) {
        serviceStatus.markApiUp()
      }
      return response
    },
    async (error) => {
      const status = error.response?.status
      const url = error.config?.url ?? ''
      const serviceStatus = useServiceStatusStore(pinia)

      // No response at all → network error / backend unreachable.
      if (!error.response) {
        serviceStatus.markApiDown()
      } else if (DOWN_STATUSES.has(status)) {
        serviceStatus.markApiDown()
      }

      if (status === 401 && !url.includes('/auth/')) {
        const authStore = useAuthStore(pinia)
        authStore.clearSession()
      }

      return Promise.reject(error)
    },
  )

  interceptorsRegistered = true
}
