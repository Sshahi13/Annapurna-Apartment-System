import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLogin.css'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(credentials.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    const result = await login(credentials.email, credentials.password)

    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error || 'Invalid credentials')
    }

    setLoading(false)
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-box">
          <h2>Annapurna Apartment's ADMIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="login-footer">
              <p>Don't have an account? <Link to="/admin/register">Create one</Link></p>
              <p><Link to="/admin/forgot-password">Forgot Password?</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
