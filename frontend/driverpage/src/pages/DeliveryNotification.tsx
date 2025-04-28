// src/components/DriverNotification.tsx
import React, { useEffect, useState } from 'react';
import socket from '../sockets/socket';
import axios from 'axios';

interface DeliveryNotif {
  deliveryId: string;
  address: string;
  driverId: string;
}

export default function DriverNotification() {
  const [notif, setNotif] = useState<DeliveryNotif|null>(null);

  useEffect(() => {
    socket.on('deliveryAssigned', (data: DeliveryNotif) => {
      setNotif(data);
    });
    return () => { socket.off('deliveryAssigned'); };
  }, []);

  if (!notif) return null;

  const handle = async (action: 'accept'|'reject') => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/delivery/${notif.deliveryId}/${action}`
    );
    setNotif(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 80, right: 20,
      background: '#fff', padding: 20,
      border: '1px solid #ccc', zIndex: 1000
    }}>
      <h3>📦 New Delivery Assigned</h3>
      <p><strong>Address:</strong> {notif.address}</p>
      <button onClick={() => handle('accept')} style={{ marginRight:10, padding:'8px 16px' }}>
        ✅ Accept
      </button>
      <button onClick={() => handle('reject')} style={{ padding:'8px 16px' }}>
        ❌ Reject
      </button>
    </div>
  );
}
