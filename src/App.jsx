import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Rooms from './pages/Rooms'
import Contact from './pages/Contact'
import Reservation from './pages/Reservation'
import PaymentSuccess from './pages/PaymentSuccess'
import AdminLogin from './admin/AdminLogin'
import AdminRegister from './admin/AdminRegister'
import AdminDashboard from './admin/AdminDashboard'
import AdminGallery from './admin/AdminGallery'
import AdminRooms from './admin/AdminRooms'
import AdminPayments from './admin/AdminPayments'
import AdminReservations from './admin/AdminReservations'
import AdminMessages from './admin/AdminMessages'
import AdminPrices from './admin/AdminPrices'
import Invoice from './admin/Invoice'
import ProtectedRoute from './admin/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/reservation/:roomNo?" element={<Layout><Reservation /></Layout>} />
          <Route path="/payment-success" element={<Layout><PaymentSuccess /></Layout>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
          <Route path="/admin/rooms" element={<ProtectedRoute><AdminRooms /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/reservations/:id?" element={<ProtectedRoute><AdminReservations /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/prices" element={<ProtectedRoute><AdminPrices /></ProtectedRoute>} />
          <Route path="/admin/invoice/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
