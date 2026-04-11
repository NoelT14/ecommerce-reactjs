import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
})

// Attach access token on every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (value: string) => void
  reject: (reason: unknown) => void
}> = []

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  pendingQueue = []
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue the request until the refresh resolves
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((newToken) => {
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        }
        return axiosClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      isRefreshing = false
      dispatchLogout()
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
      const { accessToken, refreshToken: newRefreshToken } = data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      flushQueue(null, accessToken)

      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
      }

      return axiosClient(originalRequest)
    } catch (refreshError) {
      flushQueue(refreshError, null)
      dispatchLogout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

// Lazy import to avoid circular dependency — store imports axiosClient, axiosClient needs store
function dispatchLogout() {
  import('../store/store').then(({ store }) => {
    import('../store/auth/slice').then(({ logout }) => {
      store.dispatch(logout())
    })
  })
}
