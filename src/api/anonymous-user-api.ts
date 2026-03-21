import axios from 'axios'
import { API_BASE_URL } from './api'
import type { CheckResumeQuotaResponse, AnonymousUserInfo } from '@/models/resume.type'

class AnonymousUserAPI {
  async checkResumeQuota(): Promise<CheckResumeQuotaResponse> {
    const response = await axios.get(`${API_BASE_URL}/anonymous-user/check-quota`)
    return response.data
  }

  async getInfo(): Promise<AnonymousUserInfo> {
    const response = await axios.get(`${API_BASE_URL}/anonymous-user/info`)
    return response.data
  }
}

export default new AnonymousUserAPI()
