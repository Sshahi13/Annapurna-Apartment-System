import React, { createContext, useState, useContext, useEffect } from 'react'
import { adminAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await adminAPI.login({ username, password })

      if (response.data && !response.data.error) {
        setUser(response.data)
        localStorage.setItem('adminUser', JSON.stringify(response.data))
        return { success: true }
      } else {
        return { success: false, error: response.data.error || 'Invalid credentials' }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMsg = error.response?.data?.error || 'Connection error'
      return { success: false, error: errorMsg }
    }
  }

  const register = async (username, password) => {
    try {
      const response = await adminAPI.register({ username, password })

      if (response.data && !response.data.error) {
        return { success: true }
      } else {
        return { success: false, error: response.data.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMsg = error.response?.data?.error || 'Connection error'
      return { success: false, error: errorMsg }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adminUser')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
