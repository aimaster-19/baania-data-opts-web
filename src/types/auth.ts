export interface User {
  id: string
  email: string
  [key: string]: unknown
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (token: string, userData: User) => void
  logout: () => Promise<void>
  isLoading: boolean
}
