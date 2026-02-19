import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentAPI, reservationAPI } from '../services/api';
import './About.css'; // Reusing some styles or create a new one

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [details, setDetails] = useState(null);
    const hasVerified = useRef(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const pidx = query.get('pidx');
        const method = query.get('method');

        if (method === 'offline') {
            setStatus('offline_success');
            return;
        }

        if (pidx && !hasVerified.current) {
            hasVerified.current = true;
            verify(pidx);
        } else if (!pidx && !method) {
            setStatus('error');
        }
    }, [location]);

    const verify = async (pidx) => {
        try {
            const response = await paymentAPI.verifyPayment({ pidx });
            console.log('Khalti Verification Response:', response.data);

            // Handle case-insensitivity and possible variations
            const paymentStatus = response.data.status?.toLowerCase();

            if (paymentStatus === 'completed' || paymentStatus === 'success') {
                // Create reservation now that payment is confirmed
                const pendingData = localStorage.getItem('pendingReservation');
                console.log('Pending Reservation Data:', pendingData);

                if (pendingData) {
                    const reservationData = JSON.parse(pendingData);
                    reservationData.stat = 'Not Confirm'; // Ensure it's in New Bookings for admin to confirm
                    console.log('Creating reservation with data:', reservationData);

                    try {
                        const resResult = await reservationAPI.create(reservationData);
                        console.log('Reservation Create Result:', resResult.data);
                        localStorage.removeItem('pendingReservation');
                        setStatus('success');
                        setDetails(response.data);
                    } catch (createError) {
                        console.error('Failed to create reservation record:', createError);
                        setStatus('error'); // Show error if we paid but couldn't save
                    }
                } else {
                    console.error('No pending reservation data found in localStorage.');
                    setStatus('error');
                }
            } else {
                console.warn('Payment not completed. Status:', response.data.status);
                setStatus('failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="section" style={{ padding: '100px 0', textAlign: 'center' }}>
            <div className="container">
                {status === 'verifying' && (
                    <div>
                        <h2>Verifying Payment...</h2>
                        <p>Please wait while we confirm your transaction with Khalti.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <h2 style={{ color: '#28a745' }}>Payment Successful!</h2>
                        <p>Your booking request has been sent. Please wait for admin confirmation.</p>
                        {details && (
                            <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', display: 'inline-block' }}>
                                <p><strong>Transaction ID:</strong> {details.transaction_id}</p>
                                <p><strong>Amount:</strong> Rs. {details.total_amount / 100}</p>
                            </div>
                        )}
                        <div style={{ marginTop: '30px' }}>
                            <button onClick={() => navigate('/')} className="btn btn-primary">Go to Home</button>
                        </div>
                    </div>
                )}

                {status === 'offline_success' && (
                    <div>
                        <h2 style={{ color: '#28a745' }}>Booking Successful!</h2>
                        <p>Your booking request has been sent. Please wait for admin confirmation.</p>
                        <div style={{ marginTop: '30px' }}>
                            <button onClick={() => navigate('/')} className="btn btn-primary">Go to Home</button>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div>
                        <h2 style={{ color: '#dc3545' }}>Payment Verification Failed</h2>
                        <p>We couldn't verify your payment. Please contact support.</p>
                        <div style={{ marginTop: '30px' }}>
                            <button onClick={() => navigate('/contact')} className="btn btn-primary">Contact Support</button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <h2 style={{ color: '#dc3545' }}>Error</h2>
                        <p>Something went wrong or no payment information was found.</p>
                        <div style={{ marginTop: '30px' }}>
                            <button onClick={() => navigate('/')} className="btn btn-primary">Go to Home</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
