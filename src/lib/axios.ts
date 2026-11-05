import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true
})

// ── In-memory access token (not persisted to localStorage to limit XSS) ──
// The session is restored on reload via the httpOnly refresh cookie
// (see AuthContext bootstrap / refreshAccessToken below).
let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const getAccessToken = () => accessToken

// Allows AuthContext to clear its React state when a refresh ultimately fails.
let onAuthFailure: (() => void) | null = null

export const setOnAuthFailure = (cb: (() => void) | null) => {
  onAuthFailure = cb
}

// ── Request: attach bearer token ────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// ── Token refresh (single-flight) ───────────────────────────────────────
// Concurrent 401s share one /auth/refresh call instead of firing many.
let refreshPromise: Promise<string> | null = null

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .then((res) => {
        if (res.data?.status === 200 && res.data?.token) {
          setAccessToken(res.data.token)
          return res.data.token as string
        }
        throw new Error('Refresh failed')
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

const isAuthEndpoint = (url?: string) =>
  !!url &&
  (url.includes('/auth/refresh') ||
    url.includes('/auth/login') ||
    url.includes('/auth/logout'))

// ── Response: on 401, refresh once and retry the original request ────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined
    const status = error.response?.status

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint(original.url)
    ) {
      original._retry = true
      try {
        const newToken = await refreshAccessToken()
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        setAccessToken(null)
        onAuthFailure?.()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
