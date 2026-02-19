import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api, { roomAPI, reservationAPI, priceAPI, paymentAPI } from '../services/api'
import './Reservation.css'

const Reservation = () => {
  const { roomNo } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [room, setRoom] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    fname: '',
    lname: '',
    email: '',
    phone: '',
    troom: '',
    bed: '',
    people: '1',
    days: '0',
    payment: '',
    min: location.state?.checkin || '',
    occupancy: location.state?.checkout || '',
  })
  const [prices, setPrices] = useState({ room_price: 0, bed_price: 0, total: 0, base_total: 0 })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (roomNo) {
      loadRoomDetails()
    }
  }, [roomNo])

  useEffect(() => {
    if (formData.troom && formData.bed) {
      loadPrices()
    }
  }, [formData.troom, formData.bed])

  useEffect(() => {
    if (formData.min && formData.occupancy) {
      const start = new Date(formData.min)
      const end = new Date(formData.occupancy)
      const diffTime = end - start
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 0) {
        setFormData(prev => ({ ...prev, days: diffDays.toString() }))
      } else {
        setFormData(prev => ({ ...prev, days: '0' }))
      }
    } else {
      setFormData(prev => ({ ...prev, days: '0' }))
    }
  }, [formData.min, formData.occupancy])

  useEffect(() => {
    const days = parseInt(formData.days) || 0
    setPrices(prev => ({
      ...prev,
      total: prev.base_total * days
    }))
  }, [formData.days, prices.base_total])

  const loadPrices = async () => {
    try {
      const response = await priceAPI.getPrice(formData.troom, formData.bed)
      const { room_price, bed_price } = response.data
      const roomPrice = parseFloat(room_price) || 0
      const bedPrice = parseFloat(bed_price) || 0
      const baseTotal = roomPrice + bedPrice
      const days = parseInt(formData.days) || 1

      setPrices({
        room_price: roomPrice,
        bed_price: bedPrice,
        base_total: baseTotal,
        total: baseTotal * days
      })
    } catch (error) {
      console.error('Error loading prices:', error)
    }
  }

  const loadRoomDetails = async () => {
    try {
      const response = await roomAPI.getByNo(roomNo)
      setRoom(response.data)
      setFormData(prev => ({
        ...prev,
        troom: response.data.type,
        bed: response.data.bedding,
      }))
    } catch (error) {
      console.error('Error loading room details:', error)
      setRoom(null)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) {
      return // Prevent double submission
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      // Send movein instead of min to match backend expectation more clearly
      const payload = {
        ...formData,
        room_no: roomNo || null,
        movein: formData.min,
        occupancy: formData.occupancy,
        stat: 'Confirm', // Automatically confirm booking
        roomPrice: prices.room_price,
        bedPrice: prices.bed_price,
        totalPrice: prices.total,
        days: formData.days
      }

      if (formData.payment === 'Pay Via Khalti') {
        try {
          // Save reservation data to localStorage to create it after payment success
          localStorage.setItem('pendingReservation', JSON.stringify(payload));

          const response = await paymentAPI.initiatePayment({ amount: prices.total });
          if (response.data.payment_url) {
            window.location.href = response.data.payment_url;
            return;
          } else {
            alert("Khalti payment initiation failed.");
            localStorage.removeItem('pendingReservation');
          }
        } catch (paymentError) {
          console.error('Khalti error:', paymentError);
          alert("Error initiating Khalti payment.");
          localStorage.removeItem('pendingReservation');
          setIsSubmitting(false)
        }
        return;
      }

      // For "Pay at the Apartment", create reservation with 'Not Confirm' status
      await reservationAPI.create(payload)

      const successMsg = 'Your booking request has been sent. Please wait for admin confirmation.'
      setMessage(successMsg)
      alert(successMsg)
      setTimeout(() => navigate('/'), 2000)
    } catch (error) {
      setIsSubmitting(false)
      console.error('Reservation error:', error)
      let errorMsg = 'Error adding reservation.'
      if (error.code === 'ERR_NETWORK') {
        errorMsg = `Network Error: Unable to connect to server at ${api.defaults.baseURL}. Please check if your backend server is running and the URL in .env is correct.`
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
    <div className="reservation-page section">
      <div className="container">
        <h2 className="section-title">RESERVATION</h2>
        <div className="reservation-content">
          <div className="reservation-form-section">
            <div className="reservation-card">
              <h4>PERSONAL INFORMATION</h4>
              <form onSubmit={handleSubmit} className="reservation-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title*</label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Miss.">Miss.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>First Name*</label>
                    <input
                      type="text"
                      name="fname"
                      value={formData.fname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Last Name*</label>
                    <input
                      type="text"
                      name="lname"
                      value={formData.lname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number*</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <h4 style={{ marginTop: '30px', marginBottom: '20px' }}>RESERVATION INFORMATION</h4>

                <div className="form-group">
                  <label>Type Of Room *</label>
                  {roomNo ? (
                    <input
                      type="text"
                      name="troom"
                      value={formData.troom}
                      readOnly
                    />
                  ) : (
                    <select
                      name="troom"
                      value={formData.troom}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Room Type</option>
                      <option value="Deluxe Room">Deluxe Room</option>
                      <option value="Luxury Room">Luxury Room</option>
                      <option value="Room with view">Room with view</option>
                      <option value="Superior Room">Superior Room</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  )}
                </div>
                <div className="form-group">
                  <label>Bedding Type</label>
                  {roomNo ? (
                    <input
                      type="text"
                      name="bed"
                      value={formData.bed}
                      readOnly
                    />
                  ) : (
                    <select
                      name="bed"
                      value={formData.bed}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Bedding</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                    </select>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in Date*</label>
                    <input
                      type="date"
                      name="min"
                      value={formData.min}
                      onChange={handleChange}
                      required
                      readOnly={!!location.state?.checkin}
                      style={location.state?.checkin ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date*</label>
                    <input
                      type="date"
                      name="occupancy"
                      value={formData.occupancy}
                      onChange={handleChange}
                      required
                      min={formData.min}
                      readOnly={!!location.state?.checkout}
                      style={location.state?.checkout ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    />
                  </div>
                </div>

                {formData.days > 0 && (
                  <div className="form-group">
                    <label>Number of Days</label>
                    <input
                      type="text"
                      value={formData.days}
                      readOnly
                      style={{ backgroundColor: '#f9f9f9' }}
                    />
                  </div>
                )}

                {prices.total > 0 && (
                  <div className="price-display-box">
                    <div className="price-row">
                      <span>Room Price:</span>
                      <span>Rs. {prices.room_price.toLocaleString()}</span>
                    </div>
                    <div className="price-row">
                      <span>Bed Price:</span>
                      <span>Rs. {prices.bed_price.toLocaleString()}</span>
                    </div>
                    <div className="price-row total">
                      <span>Total Amount:</span>
                      <span>Rs. {prices.total.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Payment Type*</label>
                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Pay at the Apartment">Pay at the Apartment</option>
                    <option value="Pay Via Khalti">Pay Via Khalti</option>
                  </select>
                </div>
                {/* Move-In Date removed from here and moved up as Check-in Date */}

                {message && (
                  <div className={`form-message ${message.includes('sent') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                {formData.payment === 'Pay at the Apartment' && (
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Booking...' : 'Book Now'}
                  </button>
                )}
                {formData.payment === 'Pay Via Khalti' && (
                  <button type="submit" className="btn btn-khalti" style={{ width: '100%', marginTop: '20px' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'PAY via khalti'}
                  </button>
                )}
                {!formData.payment && (
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled>
                    Submit Reservation
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Reservation
