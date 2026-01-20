import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="navbar-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h2>Dashboard</h2>
        </div>
        <div className="navbar-user">
          <span>{user?.username}</span>
          <button className="btn-logout-top" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="admin-content-wrapper">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul className="sidebar-menu">
            <li>
              <Link
                to="/admin"
                className={isActive('/admin') && !isActive('/admin/rooms') && !isActive('/admin/payments') && !isActive('/admin/reservations') ? 'active' : ''}
              >
                📊 Status
              </Link>
            </li>
            <li>
              <Link
                to="/admin/payments"
                className={isActive('/admin/payments') ? 'active' : ''}
              >
                💳 Payment
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reservations"
                className={isActive('/admin/reservations') ? 'active' : ''}
              >
                📋 Reservations
              </Link>
            </li>
            <li>
              <Link
                to="/admin/rooms"
                className={isActive('/admin/rooms') ? 'active' : ''}
              >
                🏠 Rooms
              </Link>
            </li>
            <li>
              <Link
                to="/admin/messages"
                className={isActive('/admin/messages') ? 'active' : ''}
              >
                ✉️ Messages
              </Link>
            </li>
            <li>
              <Link
                to="/admin/prices"
                className={isActive('/admin/prices') ? 'active' : ''}
              >
                💰 Prices
              </Link>
            </li>
            <li>
              <Link
                to="/admin/gallery"
                className={isActive('/admin/gallery') ? 'active' : ''}
              >
                🖼️ Gallery
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>🚪 Logout</button>
            </li>
          </ul>
        </aside>

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
