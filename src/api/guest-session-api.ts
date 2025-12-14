import axios from 'axios'
import { API_BASE_URL } from './api'
import type {
  CreateGuestSessionResponse,
  CheckResumeQuotaResponse,
  GuestSessionInfo,
} from '@/models/resume.type'

class GuestSessionAPI {
  /**
   * Creates a new guest session
   */
  async createGuestSession(userAgent?: string): Promise<CreateGuestSessionResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/guest-session/create`, {
        userAgent: userAgent || navigator.userAgent,
      })
      return response.data
    } catch (error) {
      console.error('Failed to create guest session:', error)
      throw error
    }
  }

  /**
   * Checks resume quota for the current guest session
   */
  async checkResumeQuota(): Promise<CheckResumeQuotaResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/guest-session/check-quota`)
      return response.data
    } catch (error) {
      console.error('Failed to check resume quota:', error)
      throw error
    }
  }

  /**
   * Gets current guest session info
   */
  async getSessionInfo(): Promise<GuestSessionInfo> {
    try {
      const response = await axios.get(`${API_BASE_URL}/guest-session/info`)
      return response.data
    } catch (error) {
      console.error('Failed to get session info:', error)
      throw error
    }
  }

  /**
   * Clears the guest session
   */
  async logoutGuest(): Promise<{ message: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/guest-session/logout`, {})
      return response.data
    } catch (error) {
      console.error('Failed to logout guest:', error)
      throw error
    }
  }
}

export default new GuestSessionAPI()
