export class User {
  id: string
  name: string
  email: string
  createTime: string
  lastModifyTime: string

  constructor(id: string, name: string, email: string, createTime: string, lastModifyTime: string) {
    this.id = id
    this.name = name
    this.email = email
    this.createTime = createTime
    this.lastModifyTime = lastModifyTime
  }

  // Method to update the user's name and last modify time
  updateName(newName: string) {
    this.name = newName
    this.lastModifyTime = new Date().toISOString()
  }

  // Method to update the user's email and last modify time
  updateEmail(newEmail: string) {
    this.email = newEmail
    this.lastModifyTime = new Date().toISOString()
  }
}
