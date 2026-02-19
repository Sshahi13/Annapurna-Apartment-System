import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminAPI } from '../services/api'
import './AdminLogin.css'

const ForgotPassword = () => {
    const [data, setData] = useState({ email: '', phoneno: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Trim inputs
        const trimmedEmail = data.email.trim()
        const trimmedPhone = data.phoneno.trim()

        if (!trimmedEmail || !trimmedPhone) {
            setError('Please enter both email and phone number')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await adminAPI.forgotPassword({
                email: trimmedEmail,
                phoneno: trimmedPhone
            })

            console.log('Verification response:', response.data)

            if (response.status === 200 && response.data && response.data.message && !response.data.error) {
                // Redirect to reset password page with email and phone in state
                navigate('/admin/reset-password', { state: { email: trimmedEmail, phoneno: trimmedPhone } })
            } else {
                setError(response.data?.error || 'No matching account found')
            }
        } catch (err) {
            console.error('Verification error:', err)
            setError(err.response?.data?.error || 'No matching account found with these details')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login">
            <div className="login-container">
                <div className="login-box">
                    <h2>Forgot Password</h2>
                    <p className="instruction-text">Enter your registered email and phone number to verify your identity.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Registered Email"
                                value={data.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="phoneno"
                                placeholder="Phone Number (10 digits)"
                                value={data.phoneno}
                                onChange={handleChange}
                                required
                                maxLength="10"
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Identity'}
                        </button>
                        <div className="login-footer">
                            <p><Link to="/admin/login">Back to Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
