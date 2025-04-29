
import React, { useEffect, useState } from 'react';
import socket from '../sockets/socket';
import axios from 'axios';

interface DeliveryNotif {
  deliveryId: string;
  address:    string;
  driverId:   string;
}

export default function DriverNotification() {
  const [notif, setNotif]     = useState<DeliveryNotif|null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    socket.on('deliveryAssigned', (data: DeliveryNotif) => {
      setNotif(data);
      setMessage('');
    });
    return () => { socket.off('deliveryAssigned'); };
  }, []);

  if (!notif) return null;

  const handle = async (action: 'accept'|'reject') => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/delivery/${notif.deliveryId}/${action}`
      );
      setMessage(action === 'accept'
        ? '✅ Delivery accepted'
        : '❌ Delivery rejected'
      );
      // auto‐dismiss after 2s
      setTimeout(() => setNotif(null), 2000);
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Operation failed');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      width: 300,
      background: '#fff',
      padding: 20,
      border: '1px solid #ccc',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h3 style={{ marginTop: 0 }}>📦 New Delivery</h3>
      <p><strong>Address:</strong> {notif.address}</p>

      <div style={{ display:'flex', gap:10, marginTop:10 }}>
        <button
          onClick={() => handle('accept')}
          style={{
            flex:1,
            padding:'8px',
            background:'#28a745',
            color:'#fff',
            border:'none',
            borderRadius:4,
            cursor:'pointer'
          }}
        >✅ Accept</button>

        <button
          onClick={() => handle('reject')}
          style={{
            flex:1,
            padding:'8px',
            background:'#dc3545',
            color:'#fff',
            border:'none',
            borderRadius:4,
            cursor:'pointer'
          }}
        >❌ Reject</button>
      </div>

      {message && (
        <p style={{ marginTop:12, textAlign:'center' }}>{message}</p>
      )}
    </div>
  );
}
