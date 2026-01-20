import React, { useState, useEffect } from 'react'
import './Gallery.css'

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const [images, setImages] = useState([])

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/gallery`)
      if (response.ok) {
        const data = await response.json()
        // Map API data to just filenames if needed, or use full objects
        // The API returns objects with {id, image, title}
        // We need to handle both for backward compatibility or just switch to objects
        setImages(data.map(item => item.image))
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      setImages([])
    }
  }

  const openLightbox = (index) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const prevImage = (e) => {
    e?.stopPropagation()
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextImage = (e) => {
    e?.stopPropagation()
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return

      if (e.key === 'ArrowRight') {
        nextImage()
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  return (
    <div className="gallery-page section">
      <div className="container">
        <h2 className="section-title">Our Gallery</h2>
        <div className="gallery-grid">
          {images.map((img, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => openLightbox(index)}
            >
              <img src={`/images/${img}`} alt={`Gallery ${index + 1}`} />
              <div className="gallery-overlay">
                <h4>Annupurna Apartment</h4>
                <p>📷</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div className="gallery-modal" onClick={closeLightbox}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeLightbox}>
              ×
            </button>
            <button className="nav-btn prev-btn" onClick={prevImage}>
              &#10094;
            </button>
            <img src={`/images/${images[selectedIndex]}`} alt="Gallery" />
            <button className="nav-btn next-btn" onClick={nextImage}>
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
