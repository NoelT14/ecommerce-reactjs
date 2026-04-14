import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

// Base URL e API (nga env ose fallback localhost)
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Krijon instance të axios me konfigurim bazë
export const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // nuk përdor cookies (token-based auth)
})

// ---------------- REQUEST INTERCEPTOR ----------------
// Çdo request që del nga app kalon këtu
// Shton automatikisht accessToken në header Authorization
// Nëse user nuk është i loguar, shton X-Guest-Token për sesionin anonim

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  } else {
    const guestToken = localStorage.getItem('guestToken')
    if (guestToken) {
      config.headers['X-Guest-Token'] = guestToken
    }
  }
  return config
})

// ---------------- REFRESH LOGIC STATE ----------------
let isRefreshing = false // flag: a është duke u bërë refresh aktualisht

// Queue për request-et që dështojnë gjatë refresh-it
let pendingQueue: Array<{
  resolve: (value: string) => void
  reject: (reason: unknown) => void
}> = []

// Funksion që liron queue pasi refresh mbaron
function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error) // nëse refresh dështoi : refuzo request-et
    else resolve(token!)     // nëse sukses : jep token të ri
  })
  pendingQueue = []
}

// ---------------- RESPONSE INTERCEPTOR ----------------
// Kap çdo response ose error globalisht
httpClient.interceptors.response.use(
  (response) => response, // nëse sukses : kalon direkt
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Nëse nuk është 401 ose është retry i dytë : mos bëj refresh
    // Nëse nuk ka accessToken, user nuk është i autentikuar — mos u provo refresh
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Nëse refresh është duke u bërë, fut request-in në queue
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((newToken) => {
        // Pasi refresh mbaron : vendos token të ri dhe retry request
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        }
        return httpClient(originalRequest)
      })
    }

    // REFRESH FILLON
    originalRequest._retry = true // shmang infinite loop
    isRefreshing = true

    const refreshToken = localStorage.getItem('refreshToken')

    // Nëse nuk ka refresh token : logout direkt
    if (!refreshToken) {
      isRefreshing = false
      dispatchLogout()
      return Promise.reject(error)
    }

    try {
      // Thirr endpoint-in për refresh
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })

      const { accessToken, refreshToken: newRefreshToken } = data

      // Ruaj token-at e rinj
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      // Vendos accessToken global për request-et e ardhshme
      httpClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      // Liro request-et në queue me token të ri
      flushQueue(null, accessToken)

      // Update request-in original me token të ri
      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
      }

      // Retry request-in që dështoi
      return httpClient(originalRequest)
    } catch (refreshError) {
      // Nëse refresh dështon : refuzo të gjithë queue + logout
      flushQueue(refreshError, null)
      dispatchLogout()
      return Promise.reject(refreshError)
    } finally {
      // Reset flag
      isRefreshing = false
    }
  },
)

// LOGOUT DISPATCH
// Lazy import për të shmangur circular dependency
// httpClient përdoret nga store, dhe store do përdorë httpClient
function dispatchLogout() {
  import('../../store').then(({ store }) => {
    import('../../store/auth/slice').then(({ logout }) => {
      store.dispatch(logout()) // pastron state + tokens
    })
  })
}
