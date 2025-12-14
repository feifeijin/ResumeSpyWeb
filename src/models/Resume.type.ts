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
  preview: boolean
  isEditing?: boolean
}

/**
 * Guest session response
 */
export interface CreateGuestSessionResponse {
  sessionId: string
  expiresAt: string
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
 * Guest session info
 */
export interface GuestSessionInfo {
  sessionId: string
  resumeCount: number
  expiresAt: string
  isConverted: boolean
}
