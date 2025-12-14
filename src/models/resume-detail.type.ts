/**
 * Resume detail model
 */
export interface ResumeDetail {
  id: string
  resumeId: string
  name: string
  language: string
  content: string
  isDefault: boolean
  createTime: string
  lastModifyTime: string
}
