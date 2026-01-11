// API Base URL is configurable via environment variables
// Default to localhost for development
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7227/'
export const API_BASE_URL = `${BASE_URL}api`
