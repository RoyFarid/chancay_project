import axios from 'axios'

/**
 * Axios instance configured to communicate with the backend API
 * Base URL points to http://localhost:3000/api
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

/**
 * Request interceptor (optional - for adding auth tokens, etc.)
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add any request modifications here (e.g., auth tokens)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor (optional - for error handling)
 */
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient

