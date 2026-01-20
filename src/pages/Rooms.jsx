import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomAPI } from '../services/api'
import { getRoomTitle } from '../utils/helpers'
import './Rooms.css'

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [availability, setAvailability] = useState({})
  const [selectedType, setSelectedType] = useState(null)
  const [dates, setDates] = useState({ checkin: '', checkout: '' })
  const navigate = useNavigate()

  useEffect(() => {
    loadRooms()
  }, [dates.checkin, dates.checkout])

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getAll()
      setRooms(response.data || [])

      // Fetch availability with dates if selected
      const availResponse = await roomAPI.getAvailability(dates.checkin, dates.checkout)
      setAvailability(availResponse.data || {})
    } catch (error) {
      console.error('Error loading rooms:', error)
      setRooms([])
      setAvailability({})
    }
  }

  const roomTypes = [
    {
      name: 'Deluxe Room',
      displayName: 'Deluxe Bedroom',
      image: 'r1.jpg',
      details: {
        rent: 'Rs. 1,10,000', bedrooms: 1, bathroom: 1, living: 1, kitchen: 1, balcony: 1
      }
    },
    {
      name: 'Luxury Room',
      displayName: 'Luxury Bedroom',
      image: 'r2.jpg',
      details: {
        rent: 'Rs. 1,65,000', bedrooms: 1, bathroom: 1, living: 1, kitchen: 1, balcony: 2
      }
    },
    {
      name: 'Room with view',
      displayName: 'Room with view',
      image: 'r3.jpg',
      details: {
        rent: 'Rs. 1,92,500', bedrooms: 1, bathroom: 1, living: 1, kitchen: 1, balcony: 2
      }
    },
    {
      name: 'Penthouse',
      displayName: 'Penthouse',
      image: 'r4.jpg',
      details: {
        rent: 'Rs. 2,75,000', bedrooms: 1, bathroom: 2, living: 1, kitchen: 1, balcony: 2
      }
    },
  ]

  const handleRoomClick = (roomNo) => {
    if (!dates.checkin || !dates.checkout) {
      alert('Please select check-in and check-out dates first')
      return
    }
    navigate(`/reservation/${roomNo}`, { state: { ...dates } })
  }

  const handleDateChange = (e) => {
    setDates(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="rooms-page section">
      <div className="container">
        <h2 className="section-title">Rooms And Rates</h2>

        <div className="date-filter" style={{ marginBottom: '30px', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="form-group">
              <label style={{ marginRight: '10px' }}>Check-in:</label>
              <input
                type="date"
                name="checkin"
                value={dates.checkin}
                onChange={handleDateChange}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div className="form-group">
              <label style={{ marginRight: '10px' }}>Check-out:</label>
              <input
                type="date"
                name="checkout"
                value={dates.checkout}
                onChange={handleDateChange}
                min={dates.checkin}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
          </div>
          {(!dates.checkin || !dates.checkout) && (
            <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '14px' }}>
              ⚠️ Please select check-in and check-out dates to view room availability and make reservations
            </div>
          )}
        </div>

        <div className="rooms-grid">
          {roomTypes.map((type, index) => (
            <div key={index} className="room-card">
              <div className="room-image">
                <img src={`/images/${type.image}`} alt={type.displayName} />
                <h4>{type.displayName}</h4>
              </div>
              <div className="room-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedType(type)}
                  disabled={!dates.checkin || !dates.checkout}
                  style={{ opacity: (!dates.checkin || !dates.checkout) ? 0.5 : 1, cursor: (!dates.checkin || !dates.checkout) ? 'not-allowed' : 'pointer' }}
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Selection Modal */}
      {selectedType && (
        <div className="modal" onClick={() => setSelectedType(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedType(null)}>
              ×
            </button>
            <h3>View Flat - {selectedType.displayName}</h3>
            <div className="room-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              {rooms
                .filter(room => room.type === selectedType.name)
                .map(room => {
                  const isAvailable = availability[room.room_no] === 'Available'
                  return (
                    <button
                      key={room.id}
                      className="room-number-btn"
                      style={{
                        backgroundColor: isAvailable ? '#f0ad4e' : '#cccccc',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        cursor: (isAvailable && dates.checkin && dates.checkout) ? 'pointer' : 'not-allowed',
                        opacity: (isAvailable && dates.checkin && dates.checkout) ? 1 : 0.5
                      }}
                      onClick={() => handleRoomClick(room.room_no)}
                      disabled={!isAvailable || !dates.checkin || !dates.checkout}
                      title={!dates.checkin || !dates.checkout ? 'Please select dates first' : (isAvailable ? 'Available' : 'Already Booked')}
                    >
                      {room.room_no}
                    </button>
                  )
                })}
              {rooms.filter(room => room.type === selectedType.name).length === 0 && (
                <p>No rooms available for this type yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rooms
