/**
 * Resume data model
 */
export interface Resume {
  id: string
  title: string
  resumeDetailCount: number
  resumeImgPath: string
  createTime: string
  lastModifyTime: string
  entryDate?: string
  updateDate?: string
  preview: boolean
  isEditing?: boolean
}

/**
 * Resume quota check response
 */
export interface CheckResumeQuotaResponse {
  currentCount: number
  maxAllowed: number
  canCreateResume: boolean
}

/**
 * Anonymous user info
 */
export interface AnonymousUserInfo {
  anonymousUserId: string
  resumeCount: number
  isConverted: boolean
}
