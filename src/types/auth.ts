export interface User {
  id: string
  email: string
  [key: string]: any
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, userData: User) => void
  logout: () => Promise<void>
  isLoading: boolean
}
