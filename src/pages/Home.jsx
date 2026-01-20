import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { image: '/images/1.jpg', title: 'Annapurna Apartment', subtitle: 'We know What You Love', description: 'Welcome to Our Apartment' },
    { image: '/images/2.jpg', title: 'Annapurna Apartment', subtitle: 'Stay With Friends & Families', description: 'Come & Enjoy Precious Moment With Us' },
    { image: '/images/3.jpg', title: 'Annapurna Apartment', subtitle: 'Want Luxurious Vacation?', description: 'Get Accommodation Today' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const features = [
    { icon: '🏠', title: 'MASTER BEDROOMS', desc: 'Annapurna Apartment' },
    { icon: '🌅', title: 'VIEW BALCONY', desc: 'Annapurna Apartment' },
    { icon: '🍽️', title: 'DINE AND LOUNGE', desc: 'Annapurna Apartment' },
    { icon: '📶', title: 'WIFI COVERAGE', desc: 'Annapurna Apartment' },
  ]

  return (
    <div className="home">
      {/* Banner Section */}
      <section className="banner">
        <div className="banner-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="banner-content">
                <h4>{slide.title}</h4>
                <h3>{slide.subtitle}</h3>
                <p>{slide.description}</p>
                <Link to="/about" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="banner-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={index === currentSlide ? 'active' : ''}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Availability Section */}
      <section id="availability" className="availability-section">
        <div className="container">
          <Link to="/rooms" className="availability-card">
            <h2>ROOM RESERVATION</h2>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h3>
            <span>Experience a good stay, enjoy fantastic offers</span> Find our friendly welcoming reception
          </h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <span>{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section section">
        <div className="container">
          <h3 className="section-title">Our Services</h3>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">💳</div>
              <h4>Stay First, Pay After!</h4>
              <ul>
                <li>✓ Decorated room, proper air conditioned</li>
                <li>✓ Private balcony</li>
              </ul>
            </div>
            <div className="service-card">
              <div className="service-icon">⏰</div>
              <h4>Fitness</h4>
              <ul>
                <li>✓ Swimming pool</li>
                <li>✓ Gym</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
