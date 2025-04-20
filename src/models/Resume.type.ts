export class Resume {
  id: string
  title: string
  resumeDetailCount: number
  resumeImgPath: string
  createTime: string
  lastModifyTime: string
  preview: boolean
  isEditing?: boolean

  constructor(
    id: string,
    title: string,
    resumeDetailCount: number,
    resumeImgPath: string,
    createTime: string,
    lastModifyTime: string,
    preview: boolean,
    isEditing?: boolean,
  ) {
    this.id = id
    this.title = title
    this.resumeDetailCount = resumeDetailCount
    this.resumeImgPath = resumeImgPath
    this.createTime = createTime
    this.lastModifyTime = lastModifyTime
    this.preview = preview
    this.isEditing = isEditing
  }
}
