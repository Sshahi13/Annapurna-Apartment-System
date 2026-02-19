import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { adminAPI } from '../services/api'
import './AdminLogin.css'

const ResetPassword = () => {
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const email = location.state?.email
    const phoneno = location.state?.phoneno

    useEffect(() => {
        if (!email || !phoneno) {
            navigate('/admin/forgot-password')
        }
    }, [email, phoneno, navigate])

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (passwords.password !== passwords.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await adminAPI.resetPassword({
                email,
                phoneno,
                password: passwords.password
            })

            if (response.status === 200 && response.data && response.data.message && !response.data.error) {
                setSuccess('Password reset successfully! Redirecting to login...')
                setTimeout(() => navigate('/admin/login'), 3000)
            } else {
                setError(response.data?.error || 'Reset failed')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Connection error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login">
            <div className="login-container">
                <div className="login-box">
                    <h2>Reset Password</h2>
                    <p className="instruction-text">Set a new secure password for your account.</p>
                    {success ? (
                        <div className="success-message">
                            {success}
                            <div style={{ marginTop: '15px' }}>
                                <Link to="/admin/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Go to Login</Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="New Password"
                                    value={passwords.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
