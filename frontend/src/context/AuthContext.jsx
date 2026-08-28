/**
 * Auth context: tracks whether the user is logged in and exposes
 * login/logout/register functions to the rest of the app.
 *
 * Note on storage: the JWT is kept in localStorage for simplicity in
 * this project. The trade-off is that localStorage is readable by any
 * JS running on the page (XSS risk). A production-hardened version
 * would use an httpOnly cookie instead - worth calling out in
 * SECURITY.md as a known limitation / future improvement.
 */
import { createContext, useContext, useState, useCallback } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('secureshare_token'))

  const login = useCallback(async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)

    const res = await apiClient.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('secureshare_token', res.data.access_token)
    setToken(res.data.access_token)
  }, [])

  const register = useCallback(async (email, password) => {
    await apiClient.post('/auth/register', { email, password })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('secureshare_token')
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
