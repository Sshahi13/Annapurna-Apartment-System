import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className="about-page section">
      <div className="container">
        <h2 className="section-title">About Annapurna Appartment</h2>
        <div className="about-content">
          <p className="about-text">
            Set in an area of approximately 36,000 sq. ft., Annapurna Apartments Lakeside is one of the few buildings in Pokhara with the most breathtaking views of the Phewa Lake. The apartment building shines like a diamond on the green hill of Sedi Bagar. The building consists of 10 floors and 4 different types of apartments to choose from. Each floor and each apartment set a unique combination and offer different views of the Phewa Lake. The interior and exterior facade designs are modern as well as aesthetically pleasing.
          </p>
          <div className="about-images">
            <div className="about-image main-image">
              <img src="/images/g1.jpg" alt="Annapurna Appartment" />
            </div>
            <div className="about-image secondary-image">
              <img src="/images/g9.jpg" alt="Annapurna Appartment Interior" />
            </div>
          </div>
          <div className="about-features">
            <h4>You'll love all the amenities we offer!</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
