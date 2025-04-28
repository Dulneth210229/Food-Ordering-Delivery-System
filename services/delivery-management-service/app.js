const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

const deliveryRoutes = require('./routes/deliveryRoutes');
const driverRoutes = require('./routes/driverRoutes');
const seedRoutes = require('./routes/seedRoutes');
const eventEmitter = require('./shared/events/eventEmitter');
const eventListeners = require('./shared/events/eventListeners');

dotenv.config();

connectDB()
  .then(() => {
    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    app.use(cors());
    app.use(express.json());

    app.use('/api/delivery', deliveryRoutes);
    app.use('/api/drivers', driverRoutes);
    app.use('/api/seed', seedRoutes);

    app.get('/', (req, res) => {
      res.send('🚚 Delivery Management Service is running!');
    });

    eventListeners(io);

    // 🟢 Active delivery room tracking
    const activeDeliveries = new Set();

    io.on('connection', socket => {
      console.log('Client connected:', socket.id);
    
      // Client (map viewer) wants to watch a delivery
      socket.on('trackDelivery', (deliveryId) => {
        socket.join(deliveryId);
      });
    
      // Driver app emits its GPS coords
      socket.on('updateDriverLocation', ({ deliveryId, location }) => {
        // Broadcast that location to everyone watching this delivery
        io.to(deliveryId).emit('driverLocationUpdate', location);
      });
    
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
