import React, { createContext, useContext, useState, useEffect } from 'react'
import api, {
  setAccessToken,
  getAccessToken,
  refreshAccessToken,
  setOnAuthFailure
} from '../lib/axios'
import type { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Register a forced-logout handler so that when the axios response
  // interceptor exhausts its refresh attempt, the React state is cleared
  // and ProtectedRoute redirects to /login.
  useEffect(() => {
    setOnAuthFailure(() => {
      setAccessToken(null)
      setUser(null)
      setIsAuthenticated(false)
    })
    return () => setOnAuthFailure(null)
  }, [])

  // Bootstrap on load: no token is persisted, so restore the session from
  // the httpOnly refresh cookie, then fetch the current user.
  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      try {
        await refreshAccessToken()
        const { data } = await api.get('/auth/me')
        if (isMounted && data.status === 200 && data.user) {
          setUser(data.user)
          setIsAuthenticated(true)
        }
      } catch {
        // No valid refresh cookie / session — stay logged out.
        if (isMounted) {
          setAccessToken(null)
          setUser(null)
          setIsAuthenticated(false)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [])

  const login = (newToken: string, userData: User) => {
    setAccessToken(newToken)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      if (getAccessToken()) {
        await api.post('/auth/logout')
      }
    } catch (e) {
      console.error('Logout request failed', e)
    } finally {
      setAccessToken(null)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
