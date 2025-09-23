export class ResumeDetail {
  id: string
  resumeId: string
  name: string
  language: string
  content: string
  isDefault: boolean
  createTime: string
  lastModifyTime: string

  constructor(
    id: string,
    resumeId: string,
    name: string,
    language: string,
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
}
