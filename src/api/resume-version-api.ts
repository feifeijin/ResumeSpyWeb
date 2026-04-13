import axios from 'axios'
import { API_BASE_URL } from './api'

export interface ResumeVersion {
  id: string
  resumeDetailId: string
  content: string
  preview: string
  label?: string
  createdAt: string
}

class ResumeVersionService {
  async fetchVersions(resumeDetailId: string): Promise<ResumeVersion[]> {
    const response = await axios.get(`${API_BASE_URL}/resumeVersion`, {
      params: { resumeDetailId },
    })
    return response.data
  }

  async saveVersion(resumeDetailId: string, content: string, label?: string): Promise<ResumeVersion> {
    const response = await axios.post(`${API_BASE_URL}/resumeVersion`, {
      resumeDetailId,
      content,
      label,
    })
    return response.data
  }

  async getVersionContent(id: string): Promise<string> {
    const response = await axios.get(`${API_BASE_URL}/resumeVersion/${id}/content`)
    return response.data
  }

  async deleteVersion(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/resumeVersion/${id}`)
  }
}

export default ResumeVersionService
