import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { contactAPI } from '../services/api'
import './AdminDashboard.css' // Reuse dashboard styles

const AdminMessages = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadMessages()
    }, [])

    const loadMessages = async () => {
        try {
            const response = await contactAPI.getAll()
            setMessages(response.data || [])
        } catch (error) {
            console.error('Error loading messages', error)
        }
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await contactAPI.delete(id)
                loadMessages()
            } catch (error) {
                alert('Error deleting message')
            }
        }
    }

    return (
        <AdminLayout>
            <div className="admin-dashboard">
                <h1 className="page-header">Contact Messages</h1>

                <div className="dashboard-section">
                    <h3>
                        Inbox <span className="badge">{messages.length}</span>
                    </h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : messages.length > 0 ? (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map((msg) => (
                                        <tr key={msg.id}>
                                            <td>{msg.id}</td>
                                            <td>{msg.fullname}</td>
                                            <td>{msg.phoneno}</td>
                                            <td>{msg.email}</td>
                                            <td>{msg.cdate}</td>
                                            <td>{msg.approval}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No messages found</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminMessages
