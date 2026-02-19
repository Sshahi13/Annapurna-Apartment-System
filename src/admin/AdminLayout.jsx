import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className={`admin-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <nav className="admin-navbar">
        <div className="navbar-header">
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            ☰
          </button>
          <h2>Dashboard</h2>
        </div>
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-welcome">Welcome,</span>
            <span className="user-name">{user?.user?.fullname || user?.user?.email || 'Admin'}</span>
          </div>
          <button className="btn-logout-top" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="admin-content-wrapper">
        <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <ul className="sidebar-menu">
            <li>
              <Link
                to="/admin"
                className={isActive('/admin') && !isActive('/admin/rooms') && !isActive('/admin/payments') && !isActive('/admin/reservations') ? 'active' : ''}
              >
                <span className="menu-icon">📊</span>
                <span className="menu-text">Status</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/payments"
                className={isActive('/admin/payments') ? 'active' : ''}
              >
                <span className="menu-icon">💳</span>
                <span className="menu-text">Payment</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reservations"
                className={isActive('/admin/reservations') ? 'active' : ''}
              >
                <span className="menu-icon">📋</span>
                <span className="menu-text">Reservations</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/rooms"
                className={isActive('/admin/rooms') ? 'active' : ''}
              >
                <span className="menu-icon">🏠</span>
                <span className="menu-text">Rooms</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/messages"
                className={isActive('/admin/messages') ? 'active' : ''}
              >
                <span className="menu-icon">✉️</span>
                <span className="menu-text">Messages</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/prices"
                className={isActive('/admin/prices') ? 'active' : ''}
              >
                <span className="menu-icon">💰</span>
                <span className="menu-text">Prices</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/gallery"
                className={isActive('/admin/gallery') ? 'active' : ''}
              >
                <span className="menu-icon">🖼️</span>
                <span className="menu-text">Gallery</span>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-menu-btn">
                <span className="menu-icon">🚪</span>
                <span className="menu-text">Logout</span>
              </button>
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
