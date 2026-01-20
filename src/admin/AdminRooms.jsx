import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { roomAPI, reservationAPI } from '../services/api'
import './AdminRooms.css'

const AdminRooms = () => {
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState({
    troom: '',
    bed: '',
    room_no: '',
  })
  const [deleteFormData, setDeleteFormData] = useState({
    room_no: '',
  })
  const [message, setMessage] = useState('')
  const [deleteMessage, setDeleteMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkDate, setCheckDate] = useState('')
  const [reservations, setReservations] = useState([])
  const [roomStatus, setRoomStatus] = useState({})

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getAll()
      setRooms(response.data || [])
    } catch (error) {
      console.error('Error loading rooms:', error)
      setRooms([])
    }
    setLoading(false)
  }

  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getAll()
      setReservations(response.data || [])
    } catch (error) {
      console.error('Error loading reservations:', error)
      setReservations([])
    }
  }

  const checkRoomStatus = () => {
    if (!checkDate) {
      setRoomStatus({})
      return
    }

    const selectedDate = new Date(checkDate)
    selectedDate.setHours(0, 0, 0, 0)

    const status = {}
    rooms.forEach(room => {
      // Check if this room is booked on the selected date
      const isBooked = reservations.some(res => {
        const checkin = new Date(res.Movein)
        const checkout = new Date(res.Occupancy)
        checkin.setHours(0, 0, 0, 0)
        checkout.setHours(0, 0, 0, 0)

        // Check if the room matches and date is within the reservation period
        return res.TRoom === room.type &&
          res.Bed === room.bedding &&
          selectedDate >= checkin &&
          selectedDate < checkout
      })

      status[room.room_no] = isBooked ? 'Occupied' : 'Free'
    })

    setRoomStatus(status)
  }

  useEffect(() => {
    loadReservations()
  }, [])

  useEffect(() => {
    if (checkDate && rooms.length > 0 && reservations.length >= 0) {
      checkRoomStatus()
    }
  }, [checkDate, rooms, reservations])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleDeleteChange = (e) => {
    setDeleteFormData({
      ...deleteFormData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      // Check if room number already exists
      const existing = rooms.find(
        r => r.room_no === formData.room_no
      )

      if (existing) {
        setMessage('Room Number Already Exists')
        return
      }

      const roomData = {
        ...formData,
        place: 'Free',
      }

      await roomAPI.create(roomData)
      setMessage('New Room Added')
      setFormData({ troom: '', bed: '', room_no: '' })
      loadRooms()
    } catch (error) {
      setMessage('Error adding room. Please try again.')
    }
  }

  const handleDeleteSubmit = async (e) => {
    e.preventDefault()
    setDeleteMessage('')

    try {
      if (!deleteFormData.room_no) {
        setDeleteMessage('Please enter a room number')
        return
      }

      // Check if room exists
      const roomExists = rooms.find(r => r.room_no === deleteFormData.room_no)
      if (!roomExists) {
        setDeleteMessage('Room Not Found')
        return
      }

      if (window.confirm(`Are you sure you want to delete room ${deleteFormData.room_no}?`)) {
        // Use room_no for deletion (backend now supports this)
        await roomAPI.delete(deleteFormData.room_no)
        setDeleteMessage('Room Deleted Successfully')
        setDeleteFormData({ room_no: '' })
        loadRooms()
      }
    } catch (error) {
      setDeleteMessage('Error deleting room. Please try again.')
    }
  }

  return (
    <AdminLayout>
      <div className="admin-rooms">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="page-header" style={{ margin: 0 }}>NEW ROOM</h1>
          <button
            className="btn btn-danger"
            onClick={async () => {
              if (window.confirm('Are you sure you want to reset ALL rooms to Free?')) {
                try {
                  await roomAPI.resetAll()
                  loadRooms()
                  alert('All rooms have been reset to Free')
                } catch (error) {
                  alert('Error resetting rooms')
                }
              }
            }}
          >
            Reset All Rooms
          </button>
        </div>

        <div className="rooms-content">
          <div className="add-room-section">
            <div className="room-card">
              <h4>ADD NEW ROOM</h4>
              <form onSubmit={handleSubmit} className="room-form">
                <div className="form-group">
                  <label>Room Number * (e.g. D1, L1, R1, P1)</label>
                  <input
                    type="text"
                    name="room_no"
                    value={formData.room_no}
                    onChange={handleChange}
                    placeholder="Enter Room Number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type Of Room *</label>
                  <select
                    name="troom"
                    value={formData.troom}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Deluxe Room">DELUXE ROOM</option>
                    <option value="Luxury Room">LUXURY ROOM</option>
                    <option value="Room with view">ROOM WITH VIEW</option>
                    <option value="Penthouse">PENTHOUSE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Bedding Type</label>
                  <select
                    name="bed"
                    value={formData.bed}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                  </select>
                </div>
                {message && (
                  <div className={`form-message ${message.includes('Added') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
                <button type="submit" className="btn btn-primary">
                  Add New
                </button>
              </form>
            </div>

            <div className="room-card" style={{ marginTop: '20px' }}>
              <h4>DELETE ROOM</h4>
              <form onSubmit={handleDeleteSubmit} className="room-form">
                <div className="form-group">
                  <label>Room Number * (e.g. D1, L1, R1, P1)</label>
                  <input
                    type="text"
                    name="room_no"
                    value={deleteFormData.room_no}
                    onChange={handleDeleteChange}
                    placeholder="Enter Room Number to Delete"
                    required
                  />
                </div>
                {deleteMessage && (
                  <div className={`form-message ${deleteMessage.includes('Successfully') ? 'success' : 'error'}`}>
                    {deleteMessage}
                  </div>
                )}
                <button type="submit" className="btn btn-danger">
                  Delete Room
                </button>
              </form>
            </div>
          </div>

          <div className="rooms-list-section">
            <div className="room-card">
              <h4>ROOMS INFORMATION</h4>

              <div className="date-check-section" style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Check Room Status for Date:</label>
                <input
                  type="date"
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '10px' }}
                />
                {checkDate && (
                  <button
                    onClick={() => setCheckDate('')}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 15px' }}
                  >
                    Clear
                  </button>
                )}
                {checkDate && (
                  <span style={{ marginLeft: '15px', color: '#666', fontSize: '0.9rem' }}>
                    Showing status for: {new Date(checkDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Room Number</th>
                        <th>Room Type</th>
                        <th>Bedding</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room) => {
                        const displayStatus = checkDate && roomStatus[room.room_no]
                          ? roomStatus[room.room_no]
                          : room.place
                        const statusClass = displayStatus === 'Free' ? 'free' : 'occupied'

                        return (
                          <tr key={room.id}>
                            <td>{room.room_no}</td>
                            <td>{room.type}</td>
                            <td>{room.bedding}</td>
                            <td>
                              <span className={`status-badge ${statusClass}`}>
                                {displayStatus === 'Free' ? 'Free' : 'Occupied'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminRooms
