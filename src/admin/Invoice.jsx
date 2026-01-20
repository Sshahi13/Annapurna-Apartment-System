import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentAPI } from '../services/api'
import './Invoice.css'

const Invoice = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPayment = async () => {
            try {
                const response = await paymentAPI.getById(id)
                setPayment(response.data)
            } catch (error) {
                console.error('Error loading payment:', error)
            }
            setLoading(false)
        }
        loadPayment()
    }, [id])

    const handlePrint = () => {
        window.print()
    }

    if (loading) return <div>Loading...</div>
    if (!payment) return <div>Invoice not found</div>

    return (
        <div className="invoice-page">
            <div className="invoice-actions no-print">
                <button onClick={() => navigate('/admin/payments')} className="btn btn-secondary">
                    Back
                </button>
                <button onClick={handlePrint} className="btn btn-primary">
                    Print
                </button>
            </div>

            <div className="invoice-container">
                <div className="invoice-header">
                    <h1>INVOICE</h1>
                </div>

                <div className="invoice-billing-info">
                    <div className="billed-to">
                        <h3>{payment.payment === 'Pay Via Khalti' ? 'Paid By:' : 'Billed To:'}</h3>
                        <p>{payment.fname} {payment.lname}</p>
                        <p>{payment.phone} , {payment.email}</p>
                    </div>
                    <div className="company-info">
                        <h3>Roadshow Appartment</h3>
                        <p>Annupurna Apartment, Pokhara,</p>
                        <p>Kathmandu, Nepal,</p>
                        <p>9802020063, 4033304</p>
                    </div>
                </div>

                <div className="invoice-meta">
                    <div className="meta-row">
                        <span className="meta-label">Invoice #</span>
                        <span className="meta-value">{payment['p-id']}</span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">Payment Type</span>
                        <span className="meta-value">{payment.payment}</span>
                    </div>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Check-in Date</th>
                            <th>Rate</th>
                            <th>No of Days</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{payment.troom}</td>
                            <td>{payment.min}</td>
                            <td>{parseFloat(payment.room).toFixed(2)}</td>
                            <td>{payment.days || payment.people}</td>
                            <td>Rs. {parseFloat(payment.fintot).toFixed(2)}</td>
                        </tr>
                        {/* Additional rows if needed, currently only one entry per payment */}
                    </tbody>
                </table>

                <div className="invoice-totals">
                    <div className="total-row">
                        <span className="total-label">Total</span>
                        <span className="total-value">Rs. {parseFloat(payment.fintot).toFixed(2)}</span>
                    </div>
                </div>

                <div className="invoice-footer">
                    <h3>CONTACT US</h3>
                    <p>Email :- roadshowpkr@gmail.com || Phone :- 9802020063</p>
                </div>
            </div>
        </div>
    )
}

export default Invoice
