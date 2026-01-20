import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL
if (!API_BASE_URL) {
  console.error('CRITICAL: VITE_API_URL is not defined. Please check your .env file.')
  alert('Configuration Error: API URL is missing. Please check .env file.')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// API Services
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getByNo: (roomNo) => api.get(`/rooms/${roomNo}`),
  getAvailability: (checkin, checkout) => {
    const params = (checkin && checkout) ? { checkin, checkout } : {}
    return api.get('/rooms/availability', { params })
  },
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  resetAll: () => api.post('/rooms/reset'),
}

export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  confirm: (id) => api.post(`/reservations/${id}/confirm`),
  delete: (id) => api.delete(`/reservations/${id}`),
}

export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
  initiatePayment: (data) => api.post('/initiate_payment.php', data),
  verifyPayment: (data) => api.post('/verify_payment.php', data),
}

export const contactAPI = {
  create: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  delete: (id) => api.delete(`/contact/${id}`),
}

export const priceAPI = {
  getAll: () => api.get('/prices'),
  getPrice: (troom, tbed) => api.get('/prices', { params: { troom, tbed } }),
  update: (data) => api.put('/prices', data),
}

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  upload: (formData) => api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/gallery/${id}`),
}

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  register: (credentials) => api.post('/admin/register', credentials),
  logout: () => api.post('/admin/logout'),
}

export default api
