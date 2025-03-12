import axios from 'axios'
import { ResumeDetail } from '@/models/resume-detail.type'
import { API_BASE_URL } from './api'

// Fetch resume details by resume ID
export const fetchResumeDetailsByResumeId = async (resumeId: string): Promise<ResumeDetail[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resume-details?resumeId=${resumeId}`)
    return response.data.map(
      (item: ResumeDetail) =>
        new ResumeDetail(
          item.id,
          item.resumeId,
          item.name,
          item.language,
          item.content,
          item.isDefault,
          item.createTime,
          item.lastModifyTime,
        ),
    )
  } catch (error) {
    console.error(`Failed to fetch resume details for resume ID ${resumeId}:`, error)
    throw error
  }
}

// Create a new resume detail
export const createResumeDetail = async (resumeDetail: ResumeDetail): Promise<ResumeDetail> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resume-details`, resumeDetail)
    return new ResumeDetail(
      response.data.id,
      response.data.resumeId,
      response.data.name,
      response.data.language,
      response.data.content,
      response.data.isDefault,
      response.data.createTime,
      response.data.lastModifyTime,
    )
  } catch (error) {
    console.error('Failed to create resume detail:', error)
    throw error
  }
}

// Update an existing resume detail
export const updateResumeDetail = async (resumeDetail: ResumeDetail): Promise<ResumeDetail> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/resume-details/${resumeDetail.id}`,
      resumeDetail,
    )
    return new ResumeDetail(
      response.data.id,
      response.data.resumeId,
      response.data.name,
      response.data.language,
      response.data.content,
      response.data.isDefault,
      response.data.createTime,
      response.data.lastModifyTime,
    )
  } catch (error) {
    console.error('Failed to update resume detail:', error)
    throw error
  }
}

// Update only the name of an existing resume detail
export const updateResumeDetailName = async (
  id: string,
  newName: string,
): Promise<ResumeDetail> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/resume-details/${id}/name`, {
      name: newName,
    })
    return new ResumeDetail(
      response.data.id,
      response.data.resumeId,
      response.data.name,
      response.data.language,
      response.data.content,
      response.data.isDefault,
      response.data.createTime,
      response.data.lastModifyTime,
    )
  } catch (error) {
    console.error('Failed to update resume detail name:', error)
    throw error
  }
}

// Update only the content of an existing resume detail
export const updateResumeDetailContent = async (
  id: string,
  newContent: string,
): Promise<ResumeDetail> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/resume-details/${id}/content`, {
      content: newContent,
    })
    return new ResumeDetail(
      response.data.id,
      response.data.resumeId,
      response.data.name,
      response.data.language,
      response.data.content,
      response.data.isDefault,
      response.data.createTime,
      response.data.lastModifyTime,
    )
  } catch (error) {
    console.error('Failed to update resume detail content:', error)
    throw error
  }
}

// Create a new resume detail based on an existing resume detail
export const createResumeDetailFromExisting = async (
  existingResumeDetailId: string,
  language: string,
): Promise<ResumeDetail> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resume-details/copy`, {
      existingResumeDetailId,
      language,
    })
    return new ResumeDetail(
      response.data.id,
      response.data.resumeId,
      response.data.name,
      response.data.language,
      response.data.content,
      response.data.isDefault,
      response.data.createTime,
      response.data.lastModifyTime,
    )
  } catch (error) {
    console.error('Failed to create resume detail from existing:', error)
    throw error
  }
}

// Delete a resume detail
export const deleteResumeDetail = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/resume-details/${id}`)
  } catch (error) {
    console.error('Failed to delete resume detail:', error)
    throw error
  }
}
