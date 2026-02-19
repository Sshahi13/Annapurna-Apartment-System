import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { reservationAPI, roomAPI, paymentAPI, priceAPI } from '../services/api'
import './AdminReservations.css'

const AdminReservations = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState(null)
  const [reservations, setReservations] = useState([])
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState({ roomPrice: '', bedPrice: '', total: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadReservation()
      loadRooms()
    } else {
      loadAllReservations()
    }
  }, [id])

  useEffect(() => {
    if (reservation) {
      loadSuggestedPrices()
    }
  }, [reservation])

  const loadSuggestedPrices = async () => {
    try {
      const response = await priceAPI.getPrice(reservation.TRoom, reservation.Bed)
      const { room_price, bed_price } = response.data
      setFormData({
        roomPrice: parseFloat(room_price) || 0,
        bedPrice: parseFloat(bed_price) || 0,
        total: (parseFloat(room_price) || 0) + (parseFloat(bed_price) || 0)
      })
    } catch (error) {
      console.error('Error loading prices:', error)
    }
  }

  const loadReservation = async () => {
    setLoading(true)
    try {
      const response = await reservationAPI.getById(id)
      setReservation(response.data)
    } catch (error) {
      console.error('Error loading reservation:', error)
      setReservation(null)
    }
    setLoading(false)
  }

  const loadAllReservations = async () => {
    setLoading(true)
    try {
      const response = await reservationAPI.getAll()
      setReservations(response.data || [])
    } catch (error) {
      console.error('Error loading all reservations:', error)
      setReservations([])
    }
    setLoading(false)
  }

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getAll()
      setRooms(response.data || [])
    } catch (error) {
      console.error('Error loading rooms:', error)
      setRooms([])
    }
  }

  // Calculate status based on dates
  const getReservationStatus = (reservation) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkin = new Date(reservation.Movein)
    const checkout = new Date(reservation.Occupancy)
    checkin.setHours(0, 0, 0, 0)
    checkout.setHours(0, 0, 0, 0)

    if (checkin <= today && checkout > today) {
      return 'In-House'
    } else if (checkin > today) {
      return 'Upcoming'
    } else {
      return 'Past'
    }
  }



  const handleConfirm = async () => {
    try {
      // Update reservation status
      await reservationAPI.confirm(id)

      // Create payment record
      const paymentData = {
        id: reservation.id,
        title: reservation.Title,
        fname: reservation.FName,
        lname: reservation.LName,
        troom: reservation.TRoom,
        tbed: reservation.Bed,
        days: reservation.days || reservation.People,
        min: reservation.Movein,
        room: formData.roomPrice,
        bed: formData.bedPrice,
        fintot: formData.total,
        payment: reservation.Payment,
      }

      await paymentAPI.create(paymentData)

      // Update room status
      const selectedRoom = rooms.find(r => r.type === reservation.TRoom && r.bedding === reservation.Bed && r.place === 'Free')
      if (selectedRoom) {
        await roomAPI.update(selectedRoom.id, {
          place: 'NotFree',
          cusid: reservation.id,
        })
      }

      setMessage('Reservation confirmed successfully')
      setTimeout(() => navigate('/admin'), 2000)
    } catch (error) {
      setMessage('Error confirming reservation')
    }
  }



  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await reservationAPI.delete(id)
        loadAllReservations()
      } catch (error) {
        alert('Error cancelling booking')
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">Loading...</div>
      </AdminLayout>
    )
  }

  if (id && !reservation) {
    return (
      <AdminLayout>
        <div className="error-msg">Reservation not found</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-reservation">
        <h1 className="page-header">
          {id ? 'Reservation Details' : 'All Reservations'}
        </h1>

        {id ? (
          /* Detail View */
          <div className="reservation-details">
            <div className="detail-card">
              <h4>Personal Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Name:</strong> {reservation.Title} {reservation.FName} {reservation.LName}
                </div>
                <div className="detail-item">
                  <strong>Email:</strong> {reservation.Email}
                </div>
                <div className="detail-item">
                  <strong>Phone:</strong> {reservation.Phone}
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h4>Reservation Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Room Type:</strong> {reservation.TRoom}
                </div>
                <div className="detail-item">
                  <strong>Bedding:</strong> {reservation.Bed}
                </div>
                <div className="detail-item">
                  <strong>Days:</strong> {reservation.days || reservation.People}
                </div>
                <div className="detail-item">
                  <strong>Payment Type:</strong> {reservation.Payment}
                </div>
                <div className="detail-item">
                  <strong>Check-in Date:</strong> {reservation.Movein}
                </div>
                <div className="detail-item">
                  <strong>Check-out Date:</strong> {reservation.Occupancy}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> {getReservationStatus(reservation)}
                </div>
              </div>
            </div>

            {/* Confirmation logic removed as bookings are now auto-confirmed */}
            <div className="actions">
              <button onClick={() => navigate('/admin/reservations')} className="btn btn-secondary">
                Back to List
              </button>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="reservations-list">
            {reservations.length > 0 ? (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Room Type</th>
                      <th>Bedding</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id}>
                        <td>{res.id}</td>
                        <td>{res.FName} {res.LName}</td>
                        <td>{res.TRoom}</td>
                        <td>{res.Bed}</td>
                        <td>{res.Movein}</td>
                        <td>{res.Occupancy}</td>
                        <td>
                          <span className={`status-badge ${getReservationStatus(res) === 'In-House' ? 'inhouse' :
                            getReservationStatus(res) === 'Upcoming' ? 'upcoming' : 'past'
                            }`}>
                            {getReservationStatus(res)}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link to={`/admin/reservations/${res.id}`} className="btn btn-primary btn-sm">
                              View
                            </Link>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancel(res.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No reservations found.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminReservations
