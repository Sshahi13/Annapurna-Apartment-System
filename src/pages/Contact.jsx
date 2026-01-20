import React, { useState } from 'react'
import { contactAPI } from '../services/api'
import './Contact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faGooglePlus } from '@fortawesome/free-brands-svg-icons'


const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    phoneno: '',
    email: '',
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await contactAPI.create(formData)
      setMessage('Thank you for contacting us. We will keep in touch.')
      setFormData({ fullname: '', phoneno: '', email: '' })
    } catch (error) {
      console.error('Contact error:', error)
      let errorMsg = 'Error submitting form.'
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Network Error: Unable to connect to server. Please check if the backend is running.'
      } else if (error.response) {
        errorMsg = error.response.data?.error || `Server Error: ${error.response.status}`
      } else {
        errorMsg = error.message
      }
      setMessage(errorMsg)
      alert(errorMsg)
    }
  }

  return (
    <div className="contact-page section">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-content">
          <div className="contact-form-section">
            <div className="contact-card">
              <h4>Contact Us</h4>
              <p className="contact-subtitle">Sign Up For Our News Letters</p>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="tel"
                    name="phoneno"
                    value={formData.phoneno}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {message && <p className="form-message">{message}</p>}
                <button type="submit" className="btn btn-primary">
                  Send Now
                </button>
              </form>
            </div>
          </div>
          <div className="contact-info-section">
            <h4>Connect With Us</h4>
            <div className="contact-info">
              <p><strong>Phone :</strong> 9849787259, 9840715925, +977-1-4240823</p>
              <p><strong>Email :</strong> <a href="mailto:roadshowpkr@gmail.com">roadshowpkr@gmail.com</a></p>
              <p><strong>Address :</strong> Bagh Durbar, Sundhara <br /> Kathmandu, Nepal.</p>
            </div>
            <div className="social-links">
              <a href="#" className="social-link"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="social-link"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="social-link"><FontAwesomeIcon icon={faGooglePlus} /></a>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/place/Annapurna+Cable+Car/@28.2269247,83.947396,1591m/data=!3m1!1e3!4m14!1m7!3m6!1s0x39959520918498bb:0xfca6adfa336fd6c7!2sPhewa+Lake!8m2!3d28.2153837!4d83.9453168!16s%2Fm%2F03m3_m_!3m5!1s0x39959511b7655099:0xd1a8a5e182179440!8m2!3d28.2292438!4d83.9498537!16s%2Fg%2F11sr64fs46?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Annapurna Apartment Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
