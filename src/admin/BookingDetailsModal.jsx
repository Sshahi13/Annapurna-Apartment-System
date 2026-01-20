import React, { useState } from 'react'
import { reservationAPI, paymentAPI, roomAPI, priceAPI } from '../services/api'
import './AdminDashboard.css' // Reusing dashboard styles

const BookingDetailsModal = ({ booking, onClose, onSuccess, rooms }) => {
    const [formData, setFormData] = useState({ roomPrice: 0, bedPrice: 0, total: 0 })
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    React.useEffect(() => {
        if (booking) {
            loadSuggestedPrices()
        }
    }, [booking])

    const loadSuggestedPrices = async () => {
        try {
            const response = await priceAPI.getPrice(booking.TRoom, booking.Bed)
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

    const handleConfirm = async () => {
        setIsSubmitting(true)
        try {
            // Update reservation status
            await reservationAPI.confirm(booking.id)

            // Create payment record
            const paymentData = {
                id: booking.id,
                title: booking.Title,
                fname: booking.FName,
                lname: booking.LName,
                troom: booking.TRoom,
                tbed: booking.Bed,
                days: booking.days || booking.People,
                min: booking.Movein,
                room: formData.roomPrice,
                bed: formData.bedPrice,
                fintot: formData.total,
                payment: booking.Payment,
            }

            await paymentAPI.create(paymentData)

            // Update room status
            const selectedRoom = rooms.find(r => r.type === booking.TRoom && r.bedding === booking.Bed && r.place === 'Free')
            if (selectedRoom) {
                await roomAPI.update(selectedRoom.id, {
                    place: 'NotFree',
                    cusid: booking.id,
                })
            }

            setMessage('Reservation confirmed successfully')
            setTimeout(() => {
                onSuccess()
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Confirmation error:', error)
            setMessage('Error confirming reservation')
            setIsSubmitting(false)
        }
    }

    if (!booking) return null

    return (
        <div className="modal">
            <div className="modal-content booking-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Booking Details</h2>

                <div className="modal-body">
                    <div className="detail-section">
                        <h3>Personal Info</h3>
                        <p><strong>Name:</strong> {booking.Title} {booking.FName} {booking.LName}</p>
                        <p><strong>Email:</strong> {booking.Email}</p>
                        <p><strong>Phone:</strong> {booking.Phone}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Reservation Info</h3>
                        <p><strong>Room:</strong> {booking.TRoom}</p>
                        <p><strong>Bedding:</strong> {booking.Bed}</p>
                        <p><strong>Days:</strong> {booking.days || booking.People}</p>
                        <p><strong>Move In:</strong> {booking.Movein}</p>
                        <p><strong>Payment:</strong> {booking.Payment}</p>
                    </div>

                    <div className="confirm-section">
                        <h3>Confirm Reservation</h3>
                        <form className="confirm-form">
                            <div className="price-breakdown">
                                <div className="price-item">
                                    <span>Room Price:</span>
                                    <span>Rs. {formData.roomPrice.toLocaleString()}</span>
                                </div>
                                <div className="price-item">
                                    <span>Bed Price:</span>
                                    <span>Rs. {formData.bedPrice.toLocaleString()}</span>
                                </div>
                                <div className="price-item total">
                                    <span>Total Amount:</span>
                                    <span>Rs. {formData.total.toLocaleString()}</span>
                                </div>
                            </div>

                            {message && (
                                <div className={`form-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="button"
                                className="btn btn-primary btn-block"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingDetailsModal
