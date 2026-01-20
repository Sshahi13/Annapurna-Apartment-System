import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { priceAPI } from '../services/api'
import './AdminPrices.css'

const AdminPrices = () => {
    const [prices, setPrices] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({ room_price: '', bed_price: '' })
    const [message, setMessage] = useState('')

    useEffect(() => {
        loadPrices()
    }, [])

    const loadPrices = async () => {
        try {
            const response = await priceAPI.getAll()
            setPrices(response.data || [])
        } catch (error) {
            console.error('Error loading prices:', error)
        }
        setLoading(false)
    }

    const handleEdit = (price) => {
        setEditingId(price.id)
        setEditData({ room_price: price.room_price, bed_price: price.bed_price })
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditData({ room_price: '', bed_price: '' })
    }

    const handleUpdate = async (id) => {
        try {
            await priceAPI.update({ id, ...editData })
            setMessage('Price updated successfully')
            setEditingId(null)
            loadPrices()
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setMessage('Error updating price')
        }
    }

    return (
        <AdminLayout>
            <div className="admin-prices">
                <h1 className="page-header">Price Management</h1>

                <div className="prices-section">
                    <div className="price-card">
                        <h4>FIXED ROOM RATES</h4>
                        {message && (
                            <div className={`form-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Room Type</th>
                                            <th>Bedding</th>
                                            <th>Room Price (Rs.)</th>
                                            <th>Bed Price (Rs.)</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prices.map((price) => (
                                            <tr key={price.id}>
                                                <td>{price.troom}</td>
                                                <td>{price.tbed}</td>
                                                <td>
                                                    {editingId === price.id ? (
                                                        <input
                                                            type="number"
                                                            value={editData.room_price}
                                                            onChange={(e) => setEditData({ ...editData, room_price: e.target.value })}
                                                            className="edit-input"
                                                        />
                                                    ) : (
                                                        price.room_price
                                                    )}
                                                </td>
                                                <td>
                                                    {editingId === price.id ? (
                                                        <input
                                                            type="number"
                                                            value={editData.bed_price}
                                                            onChange={(e) => setEditData({ ...editData, bed_price: e.target.value })}
                                                            className="edit-input"
                                                        />
                                                    ) : (
                                                        price.bed_price
                                                    )}
                                                </td>
                                                <td>
                                                    {editingId === price.id ? (
                                                        <div className="table-actions">
                                                            <button onClick={() => handleUpdate(price.id)} className="btn btn-success btn-sm">Save</button>
                                                            <button onClick={handleCancel} className="btn btn-secondary btn-sm">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleEdit(price)} className="btn btn-primary btn-sm">Edit</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminPrices
