// src/components/DriverLocationTracker.tsx
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL);

export default function DriverLocationTracker({ deliveryId }: { deliveryId: string }) {
  useEffect(() => {
    // Join the room so the map viewers get your updates
    socket.emit('trackDelivery', deliveryId);

    // Start watching the device’s GPS
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        pos => {
          socket.emit('updateDriverLocation', {
            deliveryId,
            location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
          });
        },
        err => console.error('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation not supported');
    }
  }, [deliveryId]);

  return null;
}
