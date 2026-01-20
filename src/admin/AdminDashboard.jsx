import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { reservationAPI, roomAPI } from '../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getAll()
      setReservations(response.data || [])
    } catch (error) {
      console.error('Error loading reservations:', error)
      setReservations([])
    }
    setLoading(false)
  }


  // Categorize reservations by date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const inHouseGuests = reservations.filter(r => {
    const checkin = new Date(r.Movein)
    const checkout = new Date(r.Occupancy)
    checkin.setHours(0, 0, 0, 0)
    checkout.setHours(0, 0, 0, 0)
    return checkin <= today && checkout > today
  })

  const upcomingBookings = reservations.filter(r => {
    const checkin = new Date(r.Movein)
    checkin.setHours(0, 0, 0, 0)
    return checkin > today
  })

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await reservationAPI.delete(id)
        loadReservations()
      } catch (error) {
        alert('Error cancelling booking')
      }
    }
  }

  const handleCheckOut = async (id) => {
    if (window.confirm('Are you sure you want to Check Out this guest? This will free the room.')) {
      try {
        await reservationAPI.delete(id)
        loadReservations()
        alert('Guest Checked Out successfully')
      } catch (error) {
        alert('Error during check out')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="page-header">Status <small>Room Booking</small></h1>

        <div className="dashboard-sections">
          {/* In-House Guests */}
          <div className="dashboard-section">
            <h3>
              In-House Guests <span className="badge">{inHouseGuests.length}</span>
            </h3>
            {loading ? (
              <p>Loading...</p>
            ) : inHouseGuests.length > 0 ? (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Room</th>
                      <th>Bedding</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inHouseGuests.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.FName} {booking.LName}</td>
                        <td>{booking.Email}</td>
                        <td>{booking.TRoom}</td>
                        <td>{booking.Bed}</td>
                        <td>{booking.Movein}</td>
                        <td>{booking.Occupancy}</td>
                        <td>{booking.Payment}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCheckOut(booking.id)}
                          >
                            Check Out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No guests currently in-house</p>
            )}
          </div>

          {/* Upcoming Bookings */}
          <div className="dashboard-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>
                Upcoming Bookings <span className="badge">{upcomingBookings.length}</span>
              </h3>
            </div>
            {upcomingBookings.length > 0 ? (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Room</th>
                      <th>Bedding</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.FName} {booking.LName}</td>
                        <td>{booking.Email}</td>
                        <td>{booking.Phone}</td>
                        <td>{booking.TRoom}</td>
                        <td>{booking.Bed}</td>
                        <td>{booking.Movein}</td>
                        <td>{booking.Occupancy}</td>
                        <td>{booking.Payment}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No upcoming bookings</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
