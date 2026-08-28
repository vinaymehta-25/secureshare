/**
 * Central API client. Reads the backend URL from an env variable
 * (never hardcoded), and automatically attaches the JWT token
 * to every request once the user is logged in.
 */
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('secureshare_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If a token is invalid or expired, the backend returns 401.
// Automatically clear it so the user is sent back to login instead
// of seeing confusing repeated failures.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('secureshare_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
