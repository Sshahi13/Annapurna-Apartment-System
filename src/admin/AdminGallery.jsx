import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { galleryAPI } from '../services/api'
import './AdminDashboard.css' // Reuse dashboard styles

const AdminGallery = () => {
    const [images, setImages] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        setLoading(true)
        try {
            const response = await galleryAPI.getAll()
            setImages(response.data || [])
        } catch (error) {
            console.error('Error fetching images:', error)
        }
        setLoading(false)
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!selectedFile) return

        setUploading(true)
        const formData = new FormData()
        formData.append('image', selectedFile)
        formData.append('title', title)

        try {
            await galleryAPI.upload(formData)
            alert('Image uploaded successfully')
            setSelectedFile(null)
            setTitle('')
            fetchImages() // Refresh list
        } catch (error) {
            console.error('Error uploading image:', error)
            const errorMsg = error.response?.data?.error || 'Error uploading image'
            alert('Failed to upload image: ' + errorMsg)
        }
        setUploading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return

        try {
            await galleryAPI.delete(id)
            fetchImages() // Refresh list
        } catch (error) {
            console.error('Error deleting image:', error)
            alert('Failed to delete image')
        }
    }

    return (
        <AdminLayout>
            <div className="admin-dashboard">
                <div className="admin-header">
                    <h2>Gallery Management</h2>
                </div>

                <div className="admin-content">
                    <div className="upload-section" style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <h3>Upload New Image</h3>
                        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Caption (Optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                            <button type="submit" className="btn btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </form>
                    </div>

                    <h3>Current Gallery Images</h3>
                    {loading ? (
                        <p>Loading images...</p>
                    ) : (
                        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' }}>
                            {images.map((img) => (
                                <div key={img.id} className="gallery-item" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'white',
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ height: '140px', overflow: 'hidden' }}>
                                        <img
                                            src={`/images/${img.image}`}
                                            alt={img.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </div>
                                    <div style={{ padding: '15px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        {img.title && (
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333' }}>{img.title}</h4>
                                        )}
                                        <button
                                            onClick={() => handleDelete(img.id)}
                                            style={{
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                transition: 'background 0.2s',
                                                marginTop: 'auto'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = '#c82333'}
                                            onMouseOut={(e) => e.target.style.background = '#dc3545'}
                                        >
                                            Delete Image
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminGallery
