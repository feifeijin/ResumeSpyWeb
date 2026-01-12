import axios from 'axios'
import type { Resume } from '@/models/Resume.type'
import { API_BASE_URL, BASE_URL } from './api'

class ResumeService {
  // Fetch all resumes
  async fetchResumes(): Promise<Resume[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/resume`)
      return response.data.map((item: Resume) => ({
        id: item.id,
        title: item.title,
        resumeDetailCount: item.resumeDetailCount,
        resumeImgPath: `${BASE_URL}${item.resumeImgPath}`,
        createTime: item.createTime,
        lastModifyTime: item.lastModifyTime,
        preview: item.preview,
        isEditing: item.isEditing,
      }))
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      throw error
    }
  }

  // Create a new resume
  async createResume(item: Resume): Promise<Resume> {
    try {
      const response = await axios.post(`${API_BASE_URL}/resume`, item)
      return {
        id: response.data.id,
        title: response.data.title,
        resumeDetailCount: response.data.resumeDetailCount,
        resumeImgPath: `${BASE_URL}${response.data.resumeImgPath}`,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
        preview: response.data.preview,
        isEditing: response.data.isEditing,
      }
    } catch (error) {
      console.error('Failed to create resume:', error)
      throw error
    }
  }

  // Update the name of an existing resume
  async updateResumeName(id: string, title: string): Promise<Resume> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/resume/${id}/title`,
        JSON.stringify(title),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      return {
        id: response.data.id,
        title: response.data.title,
        resumeDetailCount: response.data.resumeDetailCount,
        resumeImgPath: `${BASE_URL}${response.data.resumeImgPath}`,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
        preview: response.data.preview,
        isEditing: response.data.isEditing,
      }
    } catch (error) {
      console.error('Failed to update resume name:', error)
      throw error
    }
  }

  // Clone an existing resume
  async cloneResume(id: string): Promise<Resume> {
    try {
      const response = await axios.post(`${API_BASE_URL}/resume/${id}/clone`)
      return {
        id: response.data.id,
        title: response.data.title,
        resumeDetailCount: response.data.resumeDetailCount,
        resumeImgPath: `${BASE_URL}${response.data.resumeImgPath}`,
        createTime: response.data.createTime,
        lastModifyTime: response.data.lastModifyTime,
        preview: response.data.preview,
        isEditing: response.data.isEditing,
      }
    } catch (error) {
      console.error('Failed to clone resume:', error)
      throw error
    }
  }

  // Delete a resume
  async deleteResume(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/resume/${id}`)
    } catch (error) {
      console.error('Failed to delete resume:', error)
      throw error
    }
  }
}

export default ResumeService
