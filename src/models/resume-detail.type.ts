import { Language } from './enums/language'

export class ResumeDetail {
  id: string
  resumeId: string
  name: string
  language: Language
  content: string
  isDefault: boolean
  createTime: string
  lastModifyTime: string

  constructor(
    id: string,
    resumeId: string,
    name: string,
    language: Language,
    content: string,
    isDefault: boolean,
    createTime: string,
    lastModifyTime: string,
  ) {
    this.id = id
    this.resumeId = resumeId
    this.name = name
    this.language = language
    this.content = content
    this.isDefault = isDefault
    this.createTime = createTime
    this.lastModifyTime = lastModifyTime
  }

  // Method to update the content and last modify time
  updateContent(newContent: string) {
    this.content = newContent
    this.lastModifyTime = new Date().toISOString()
  }

  // Method to toggle the default status
  toggleDefault() {
    this.isDefault = !this.isDefault
  }
}
