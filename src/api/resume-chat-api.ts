import axios from 'axios'
import { API_BASE_URL } from './api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  reply: string
  proposedContent: string | null
}

class ResumeChatService {
  async sendMessage(
    currentContent: string,
    messages: ChatMessage[],
    language?: string,
  ): Promise<ChatResponse> {
    const response = await axios.post(`${API_BASE_URL}/resumeChat/message`, {
      currentContent,
      messages,
      language,
    })
    return response.data
  }
}

export default ResumeChatService
