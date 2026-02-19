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
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d900399.2948848692!2d82.79571533203125!3d28.17129642959349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595137e79c46f%3A0xda2094170a9f5dea!2sAnnapurna%20Village%20Housing!5e0!3m2!1sen!2snp!4v1769310197168!5m2!1sen!2snp";
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
                src={mapSrc}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
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
