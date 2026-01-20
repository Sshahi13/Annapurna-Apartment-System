import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { paymentAPI } from '../services/api'
import './AdminPayments.css'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const response = await paymentAPI.getAll()
      setPayments(response.data || [])
    } catch (error) {
      console.error('Error loading payments:', error)
      setPayments([])
    }
    setLoading(false)
  }



  return (
    <AdminLayout>
      <div className="admin-payments">
        <h1 className="page-header">Payment Management</h1>

        <div className="payments-section">
          <div className="payment-card">
            <h4>PAYMENT INFORMATION</h4>
            {loading ? (
              <p>Loading...</p>
            ) : payments.length > 0 ? (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Name</th>
                      <th>Room Type</th>
                      <th>Bedding</th>
                      <th>Days</th>
                      <th>Room Price</th>
                      <th>Total</th>
                      <th>Payment Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment['p-id']}>
                        <td>{payment['p-id']}</td>
                        <td>{payment.title} {payment.fname} {payment.lname}</td>
                        <td>{payment.troom}</td>
                        <td>{payment.tbed}</td>
                        <td>{payment.days || payment.people}</td>
                        <td>Rs. {payment.room?.toLocaleString()}</td>
                        <td>Rs. {payment.fintot?.toLocaleString()}</td>
                        <td>{payment.payment}</td>
                        <td>
                          <Link to={`/admin/invoice/${payment['p-id']}`} className="btn btn-primary btn-sm">
                            Print
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No payments found</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminPayments
