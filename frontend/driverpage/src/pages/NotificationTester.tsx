import React from 'react';
import axios from 'axios';

export default function TestNotifButton() {
  const handleClick = async () => {
    try {
      const driverId = import.meta.env.VITE_DRIVER_ID;
      const baseURL  = import.meta.env.VITE_API_URL; // e.g. http://localhost:5001
      await axios.post(`${baseURL}/api/test-notif/${driverId}`);
      alert('📡 Test notification sent!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to send test notification');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '8px 16px',
        background: '#0288d1',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        marginLeft: 12
      }}
    >
      🧪 Send Test Notification
    </button>
  );
}
