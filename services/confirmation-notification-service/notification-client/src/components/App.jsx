// File: notification-client/src/components/App.jsx
import React from 'react';
import DriverNotification from './DriverNotification';

function App() {
  return (
    <div className="App" style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📡 Notification Service</h1>
      <DriverNotification />
    </div>
  );
}

export default App;
