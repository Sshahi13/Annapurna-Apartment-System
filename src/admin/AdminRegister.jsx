import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLogin.css'

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        email: '',
        fullname: '',
        phoneno: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    // Password criteria state
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false
    })
    const [passwordStrength, setPasswordStrength] = useState('weak')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
        setError('')

        if (name === 'password') {
            checkPasswordCriteria(value)
        }
    }

    const checkPasswordCriteria = (password) => {
        const criteria = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        setPasswordCriteria(criteria);

        // Calculate strength
        const metCriteriaCount = Object.values(criteria).filter(Boolean).length;
        if (metCriteriaCount <= 2) setPasswordStrength('weak');
        else if (metCriteriaCount >= 3 && metCriteriaCount < 5) setPasswordStrength('medium');
        else if (metCriteriaCount === 5) setPasswordStrength('strong');
    }

    const validateFullPassword = () => {
        return Object.values(passwordCriteria).every(Boolean);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Full Name validation
        if (!formData.fullname.trim()) {
            setError('Please enter your full name')
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            return
        }

        // Phone validation
        if (formData.phoneno.length !== 10 || !/^\d+$/.test(formData.phoneno)) {
            setError('Phone number must be exactly 10 digits')
            return
        }

        // Password strength validation
        if (!validateFullPassword()) {
            setError('Please ensure your password meets all requirements.')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match")
            return
        }

        setLoading(true)
        setError('')

        const result = await register(formData.email, formData.password, formData.phoneno, formData.fullname)

        if (result.success) {
            alert('Registration successful! Please login.')
            navigate('/admin/login')
        } else {
            setError(result.error || 'Registration failed')
        }

        setLoading(false)
    }

    const CriteriaIcon = ({ valid }) => (
        valid ?
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> :
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
    )

    return (
        <div className="admin-login">
            <div className="login-container">
                <div className="login-box">
                    <h2>Create Admin Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="phoneno"
                                placeholder="Phone Number (10 digits)"
                                value={formData.phoneno}
                                onChange={handleChange}
                                maxLength="10"
                                required
                            />
                        </div>
                        <div className="form-group password-section">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* Password Strength Meter */}
                        {formData.password && (
                            <div className={`strength-meter-container strength-${passwordStrength}`}>
                                <div className="strength-meter-bar">
                                    <div className="strength-meter-fill"></div>
                                </div>
                                <span className="strength-text">Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}</span>
                            </div>
                        )}

                        {/* Visual Checklist */}
                        <ul className="password-criteria-list">
                            <li className={`criteria-item ${passwordCriteria.length ? 'valid' : ''}`}>
                                <CriteriaIcon valid={passwordCriteria.length} /> At least 8 characters
                            </li>
                            <li className={`criteria-item ${passwordCriteria.upper ? 'valid' : ''}`}>
                                <CriteriaIcon valid={passwordCriteria.upper} /> Uppercase Letter (A-Z)
                            </li>
                            <li className={`criteria-item ${passwordCriteria.lower ? 'valid' : ''}`}>
                                <CriteriaIcon valid={passwordCriteria.lower} /> Lowercase Letter (a-z)
                            </li>
                            <li className={`criteria-item ${passwordCriteria.number ? 'valid' : ''}`}>
                                <CriteriaIcon valid={passwordCriteria.number} /> Number (0-9)
                            </li>
                            <li className={`criteria-item ${passwordCriteria.special ? 'valid' : ''}`}>
                                <CriteriaIcon valid={passwordCriteria.special} /> Special Char (@$!%*?&)
                            </li>
                        </ul>

                        <div className="form-group password-section">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                        <div className="login-footer">
                            <p>Already have an account? <Link to="/admin/login">Login here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminRegister
