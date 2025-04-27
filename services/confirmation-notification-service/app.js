// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { sendEmail } = require('./services/emailService');
const { Vonage } = require('@vonage/server-sdk');

// --- EXPRESS APP SETUP ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- VONAGE INITIALIZATION ---
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const SMS_FROM = process.env.VONAGE_SENDER_NAME || 'VonageAPI';

/**
 * Send SMS using Vonage
 */
const sendSMS = async (to, text) => {
  try {
    const response = await vonage.sms.send({ to, from: SMS_FROM, text });
    console.log('✅ SMS sent:', response);
  } catch (error) {
    console.error('❌ Failed to send SMS via Vonage:', error);
  }
};

/**
 * Socket.IO - Real-time connection handler
 */
io.on('connection', (socket) => {
  console.log('🟢 New client connected');

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

/**
 * Order Confirmation Endpoint
 * Triggered when a customer places an order
 */
app.post('/notify/order-confirmation', async (req, res) => {
  const { customerEmail, customerPhone, orderDetails } = req.body;

  const htmlContent = `
    <h1>Order Confirmation</h1>
    <p>Your order has been placed successfully!</p>
    <p><strong>Details:</strong></p>
    <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
  `;

  const message = 'Your order has been placed successfully!';

  try {
    await sendEmail(customerEmail, 'Order Confirmation', message, htmlContent);

    if (customerPhone) {
      await sendSMS(customerPhone, message);
    }

    res.status(200).send({ message: 'Order confirmation sent successfully' });
  } catch (error) {
    console.error('❌ Notification error:', error);
    res.status(500).send({ error: 'Failed to send notification' });
  }
});

/**
 * Driver Assignment Broadcast Endpoint (OPTIONAL)
 * Sends a real-time event to all connected drivers
 */
app.post('/notify/driver-assignment', async (req, res) => {
  const { deliveryId, driverEmail, driverPhone } = req.body;

  const html = `<h2>New Delivery Assigned</h2><p>Delivery ID: ${deliveryId}</p>`;
  const sms = `You have a new delivery: ${deliveryId}`;

  try {
    if (driverEmail) await sendEmail(driverEmail, 'New Delivery Assigned', sms, html);
    if (driverPhone) await sendSMS(driverPhone, sms);

    // Real-time push via socket.io
    io.emit('driverAssigned', { deliveryId });

    res.status(200).json({ message: '🚚 Driver notified successfully!' });
  } catch (error) {
    console.error('❌ Driver assignment error:', error);
    res.status(500).send({ error: 'Failed to notify driver' });
  }
});

// --- SERVER START ---
server.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT}`);
});
