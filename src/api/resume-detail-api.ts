import axios from 'axios'
import type { ResumeDetail } from '@/models/resume-detail.type'
import { API_BASE_URL } from './api'

class ResumeDetailService {
  // Fetch resume details by resume ID
  async fetchResumeDetailsByResumeId(resumeId: string): Promise<ResumeDetail[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/resumeDetail?resumeId=${resumeId}`)
      return response.data.map((item: ResumeDetail) => ({
        id: item.id,
        resumeId: item.resumeId,
        name: item.name,
        language: item.language,
        content: item.content,
        isDefault: item.isDefault,
        createTime: item.createTime,
        lastModifyTime: item.lastModifyTime,
      }))
    } catch (error) {
      console.error(`Failed to fetch resume details for resume ID ${resumeId}:`, error)
      throw error
    }
  }

  // Create a new resume detail
  async createResumeDetail(resumeDetail: ResumeDetail): Promise<ResumeDetail> {
    try {
      const response = await axios.post(`${API_BASE_URL}/resumeDetail`, resumeDetail)
      return {
        id: response.data.id,
        resumeId: response.data.resumeId,
        name: response.data.name,
        language: response.data.language,
        content: response.data.content,
        isDefault: response.data.isDefault,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
      }
    } catch (error) {
      console.error('Failed to create resume detail:', error)
      throw error
    }
  }

  // Update an existing resume detail
  async updateResumeDetail(resumeDetail: ResumeDetail): Promise<ResumeDetail> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/resumeDetail/${resumeDetail.id}`,
        resumeDetail,
      )
      return {
        id: response.data.id,
        resumeId: response.data.resumeId,
        name: response.data.name,
        language: response.data.language,
        content: response.data.content,
        isDefault: response.data.isDefault,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
      }
    } catch (error) {
      console.error('Failed to update resume detail:', error)
      throw error
    }
  }

  // Update only the name of an existing resume detail
  async updateResumeDetailName(id: string, name: string): Promise<ResumeDetail> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/resumeDetail/${id}/name`,
        JSON.stringify(name),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      return {
        id: response.data.id,
        resumeId: response.data.resumeId,
        name: response.data.name,
        language: response.data.language,
        content: response.data.content,
        isDefault: response.data.isDefault,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
      }
    } catch (error) {
      console.error('Failed to update resume detail name:', error)
      throw error
    }
  }

  // Update only the content of an existing resume detail
  async updateResumeDetailContent(id: string, content: string): Promise<ResumeDetail> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/resumeDetail/${id}/content`,
        JSON.stringify(content),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      return {
        id: response.data.id,
        resumeId: response.data.resumeId,
        name: response.data.name,
        language: response.data.language,
        content: response.data.content,
        isDefault: response.data.isDefault,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
      }
    } catch (error) {
      console.error('Failed to update resume detail content:', error)
      throw error
    }
  }

  // Create a new resume detail based on an existing resume detail
  async createResumeDetailFromExisting(
    existingResumeDetailId: string,
    language: string,
  ): Promise<ResumeDetail> {
    try {
      const response = await axios.post(`${API_BASE_URL}/resumeDetail/copy`, {
        ExistingResumeDetailId: existingResumeDetailId,
        Language: language,
      })
      return {
        id: response.data.id,
        resumeId: response.data.resumeId,
        name: response.data.name,
        language: response.data.language,
        content: response.data.content,
        isDefault: response.data.isDefault,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
      }
    } catch (error) {
      console.error('Failed to create resume detail from existing:', error)
      throw error
    }
  }

  // Delete a resume detail
  async deleteResumeDetail(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/resumeDetail/${id}`)
    } catch (error) {
      console.error('Failed to delete resume detail:', error)
      throw error
    }
  }

  // Sync resume translations
  async syncTranslations(id: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/resumeDetail/${id}/sync-translations`)
    } catch (error) {
      console.error('Failed to sync translations:', error)
      throw error
    }
  }
}

export default ResumeDetailService
