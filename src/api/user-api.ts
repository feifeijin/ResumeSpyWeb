import axios from 'axios'
import { User } from '@/models/user.type'
import { API_BASE_URL } from './api'

class UserService {
  // Fetch all users
  async fetchUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`)
      return response.data.map(
        (item: User) =>
          new User(item.id, item.name, item.email, item.createTime, item.lastModifyTime),
      )
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  // Create a new user
  async createUser(user: User): Promise<User> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, user)
      return new User(
        response.data.id,
        response.data.name,
        response.data.email,
        response.data.createTime,
        response.data.lastModifyTime,
      )
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  }

  // Update an existing user
  async updateUser(user: User): Promise<User> {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${user.id}`, user)
      return new User(
        response.data.id,
        response.data.name,
        response.data.email,
        response.data.createTime,
        response.data.lastModifyTime,
      )
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  // Delete a user
  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`)
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw error
    }
  }

  // Login a user
  async loginUser(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password })
      const { id, name, createTime, lastModifyTime } = response.data
      return new User(id, name, email, createTime, lastModifyTime)
    } catch (error) {
      console.error('Failed to login:', error)
      throw error
    }
  }

  // Register a new user
  async registerUser(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password })
      const { id, createTime, lastModifyTime } = response.data
      return new User(id, name, email, createTime, lastModifyTime)
    } catch (error) {
      console.error('Failed to register:', error)
      throw error
    }
  }
}

export default UserService
