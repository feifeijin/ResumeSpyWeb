import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { Pinia } from 'pinia'
import { API_BASE_URL } from '@/api/api'
import { useAuthStore } from '@/stores/auth'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let interceptorsRegistered = false

export const setupAxiosInterceptors = (pinia: Pinia) => {
  if (interceptorsRegistered) {
    return
  }

  axios.defaults.baseURL = API_BASE_URL
  axios.defaults.withCredentials = false

  axios.interceptors.request.use((config) => {
    const authStore = useAuthStore(pinia)
    if (authStore.isAuthenticated && authStore.accessToken) {
      config.headers = config.headers || {}
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
      }
    }
    return config
  })

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined
      if (!originalRequest) {
        return Promise.reject(error)
      }

      const status = error.response?.status
      const isAuthEndpoint =
        typeof originalRequest.url === 'string' && originalRequest.url.includes('/auth/')

      if (status === 401 && !isAuthEndpoint) {
        const authStore = useAuthStore(pinia)
        if (!authStore.canRefresh) {
          authStore.clearSession()
          return Promise.reject(error)
        }

        if (originalRequest._retry) {
          authStore.clearSession()
          return Promise.reject(error)
        }

        originalRequest._retry = true
        const refreshed = await authStore.tryRefreshToken()
        if (refreshed && authStore.accessToken) {
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
          return axios(originalRequest)
        }

        authStore.clearSession()
      }

      return Promise.reject(error)
    },
  )

  interceptorsRegistered = true
}
