// File: notification-client/src/components/NotificationTester.jsx
import React, { useState } from 'react';
import axios from 'axios';

const NotificationTester = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/notify/order-confirmation', {
        customerEmail: email,
        customerPhone: phone,
        orderDetails: { orderId },
      });

      setStatus('✅ Notification sent successfully!');
    } catch (err) {
      setStatus('❌ Failed to send notification.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>📬 Order Notification Tester</h2>

      <input
        type="email"
        placeholder="Customer Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '300px', marginBottom: '1rem', padding: '0.5rem' }}
      /><br />

      <input
        type="text"
        placeholder="Customer Phone (+9471XXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: '300px', marginBottom: '1rem', padding: '0.5rem' }}
      /><br />

      <input
        type="text"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        style={{ width: '300px', marginBottom: '1rem', padding: '0.5rem' }}
      /><br />

      <button onClick={handleSend} style={{ padding: '0.6rem 1.2rem' }}>
        🚀 Send Notification
      </button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default NotificationTester;
