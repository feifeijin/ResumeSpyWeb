import axios from 'axios'
import { User } from '@/models/user.type'
import { API_BASE_URL } from './api'

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
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
export const createUser = async (user: User): Promise<User> => {
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
export const updateUser = async (user: User): Promise<User> => {
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
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${id}`)
  } catch (error) {
    console.error('Failed to delete user:', error)
    throw error
  }
}

// Login a user
export const loginUser = async (email: string, password: string): Promise<User> => {
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
export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password })
    const { id, createTime, lastModifyTime } = response.data
    return new User(id, name, email, createTime, lastModifyTime)
  } catch (error) {
    console.error('Failed to register:', error)
    throw error
  }
}
