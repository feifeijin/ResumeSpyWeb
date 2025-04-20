import axios from 'axios'
import { Resume } from '@/models/resume.type'
import { API_BASE_URL } from './api'

// Fetch all resumes
export const fetchResumes = async (): Promise<Resume[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resume`)
    return response.data.map(
      (item: Resume) =>
        new Resume(
          item.id,
          item.title,
          item.resumeDetailCount,
          item.resumeImgPath,
          item.createTime,
          item.lastModifyTime,
          item.preview,
          item.isEditing,
        ),
    )
  } catch (error) {
    console.error('Failed to fetch resumes:', error)
    throw error
  }
}

// Create a new resume
export const createResume = async (item: Resume): Promise<Resume> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resume`, item)
    return new Resume(
      response.data.id,
      response.data.title,
      response.data.resumeDetailCount,
      response.data.resumeImgPath,
      response.data.createTime,
      response.data.lastModifyTime,
      response.data.preview,
      response.data.isEditing,
    )
  } catch (error) {
    console.error('Failed to create resume:', error)
    throw error
  }
}

// Update the name of an existing resume
export const updateResumeName = async (id: string, title: string): Promise<Resume> => {
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
    return new Resume(
      response.data.id,
      response.data.title,
      response.data.resumeDetailCount,
      response.data.resumeImgPath,
      response.data.createTime,
      response.data.lastModifyTime,
      response.data.preview,
      response.data.isEditing,
    )
  } catch (error) {
    console.error('Failed to update resume name:', error)
    throw error
  }
}

// Clone an existing resume
export const cloneResume = async (id: string): Promise<Resume> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resume/${id}/clone`)
    return new Resume(
      response.data.id,
      response.data.title,
      response.data.resumeDetailCount,
      response.data.resumeImgPath,
      response.data.createTime,
      response.data.lastModifyTime,
      response.data.preview,
      response.data.isEditing,
    )
  } catch (error) {
    console.error('Failed to clone resume:', error)
    throw error
  }
}

// Delete a resume
export const deleteResume = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/resume/${id}`)
  } catch (error) {
    console.error('Failed to delete resume:', error)
    throw error
  }
}
