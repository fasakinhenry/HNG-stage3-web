import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { api, ApiError } from '../lib/api'
import type { User } from '../types/api'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const response = await api.getMe()
    setUser(response.data)
  }

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshUser()
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    void bootstrap()
  }, [])

  const login = () => {
    window.location.href = api.loginUrl
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    refreshUser,
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
