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

    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      socket.on('trackDelivery', (deliveryId) => {
        console.log(`📍 Tracking delivery: ${deliveryId}`);
        socket.join(deliveryId);
        activeDeliveries.add(deliveryId);
      });

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });

    // 🔁 Simulate location updates for tracked deliveries
    setInterval(() => {
      for (const deliveryId of activeDeliveries) {
        const sampleLocation = {
          lat: 6.9271 + Math.random() * 0.01,
          lng: 79.8612 + Math.random() * 0.01,
        };

        io.to(deliveryId).emit('locationUpdate', sampleLocation);
        console.log(`📦 Emitted location for ${deliveryId}:`, sampleLocation);
      }
    }, 5000); // every 5 seconds

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
