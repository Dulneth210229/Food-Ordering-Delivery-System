// File: notification-client/src/components/DriverNotification.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to backend socket server
const socket = io('http://localhost:5000');

const DriverNotification = () => {
  const [deliveryId, setDeliveryId] = useState(null);

  useEffect(() => {
    // Listen for 'driverAssigned' event
    socket.on('driverAssigned', (data) => {
      console.log('📡 New Delivery Assigned:', data);
      setDeliveryId(data.deliveryId);
      alert(`🚚 New Delivery Assigned!\nDelivery ID: ${data.deliveryId}`);
    });

    return () => {
      socket.off('driverAssigned');
    };
  }, []);

  return (
    <div style={{ marginTop: '1rem' }}>
      <h2>🚚 Driver Real-Time Notification Panel</h2>
      {deliveryId ? (
        <p><strong>New Delivery Assigned:</strong> {deliveryId}</p>
      ) : (
        <p>No new deliveries assigned yet.</p>
      )}
    </div>
  );
};

export default DriverNotification;
