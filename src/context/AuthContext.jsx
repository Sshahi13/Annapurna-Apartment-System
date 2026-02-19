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
  const [sessionExpired, setSessionExpired] = useState(false)

  // Timeout duration: 3 minutes (3 * 60 * 1000 ms)
  const SESSION_TIMEOUT = 3 * 60 * 1000

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adminUser')
    setSessionExpired(false)
  }

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      // Check if session stored time exists and is valid
      if (userData.loginTime && Date.now() - userData.loginTime > SESSION_TIMEOUT) {
        logout()
      } else {
        setUser(userData)
      }
    }
    setLoading(false)
  }, [])

  // Inactivity tracking
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (user) {
        timeoutId = setTimeout(() => {
          setSessionExpired(true)
          logout()
          alert('Your session has expired due to inactivity. Please login again.')
        }, SESSION_TIMEOUT);
      }
    };

    // Events to watch for activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    if (user) {
      events.forEach(event => document.addEventListener(event, resetTimer));
      resetTimer(); // Initial start
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await adminAPI.login({ email, password })

      if (response.data && !response.data.error) {
        const userData = { ...response.data, loginTime: Date.now() }
        setUser(userData)
        localStorage.setItem('adminUser', JSON.stringify(userData))
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

  const register = async (email, password, phoneno, fullname) => {
    try {
      const response = await adminAPI.register({ email, password, phoneno, fullname })

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

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    sessionExpired
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
