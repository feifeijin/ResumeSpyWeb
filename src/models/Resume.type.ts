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

  // Method to update the title and last modify time
  updateTitle(newTitle: string) {
    this.title = newTitle
    this.lastModifyTime = new Date().toISOString()
  }

  // Method to update the resume image path and last modify time
  updateResumeImgPath(newPath: string) {
    this.resumeImgPath = newPath
    this.lastModifyTime = new Date().toISOString()
  }

  // Method to increment the resume detail count
  incrementResumeDetailCount() {
    this.resumeDetailCount += 1
    this.lastModifyTime = new Date().toISOString()
  }

  // Method to decrement the resume detail count
  decrementResumeDetailCount() {
    if (this.resumeDetailCount > 0) {
      this.resumeDetailCount -= 1
      this.lastModifyTime = new Date().toISOString()
    }
  }
}
