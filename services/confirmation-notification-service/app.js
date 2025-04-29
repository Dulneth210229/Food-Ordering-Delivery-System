// confirmation-notification-service/app.js
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const { EventEmitter } = require('events');

const app     = express();
const server  = http.createServer(app);
const io      = new Server(server, { /* … */ });
const emitter = new EventEmitter();

// Allow your React app on port 3001 to call your HTTP API
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

// re-emit on socket.io
emitter.on('deliveryAssigned', payload => {
  io.emit('deliveryAssigned', payload);
});

// TEST endpoint
app.get('/api/test-notif/:driverId', (req, res) => {
  const { driverId } = req.params;
  const fake = {
    deliveryId: 'TEST123',
    address:    '123 Test Street, Testville',
    driverId
  };
  emitter.emit('deliveryAssigned', fake);
  return res.json({ success: true, fake });
});

// … your other routes, socket.io setup, etc. …

server.listen(5000, () => console.log('Notification service listening on 5000'));
