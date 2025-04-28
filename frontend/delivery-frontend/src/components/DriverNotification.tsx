import React, { useEffect, useState } from 'react';
import socket from '../sockets/socket';
import axios from 'axios';

type Notif = { deliveryId: string; address: string; driverId: string };

export default function DriverNotification() {
  const [n, setN] = useState<Notif|null>(null);

  useEffect(()=>{
    socket.on('deliveryAssigned', setN);
    return()=>{ socket.off('deliveryAssigned', setN); };
  },[]);

  if(!n) return null;
  const act = async (a:'accept'|'reject') => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/delivery/${n.deliveryId}/${a}`);
    setN(null);
  };

  return (
    <div style={{
      position:'fixed',top:80,right:20,padding:20,
      background:'#fff',border:'1px solid #ccc',zIndex:1000
    }}>
      <h4>📦 Delivery Assigned</h4>
      <p>{n.address}</p>
      <button onClick={()=>act('accept')}>✅ Accept</button>
      <button onClick={()=>act('reject')}>❌ Reject</button>
    </div>
  );
}
