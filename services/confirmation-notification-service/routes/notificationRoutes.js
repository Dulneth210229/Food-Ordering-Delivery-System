const express = require('express');
const router = express.Router();
const { sendEmail, sendSMS } = require('./notificationService');
const eventEmitter = require('./eventEmitter');

// Route for Order Confirmation
router.post('/order-confirmation', (req, res) => {
    const { orderDetails } = req.body;

    // Validate order details
    if (!orderDetails || !orderDetails.email || !orderDetails.phone) {
        return res.status(400).json({ error: 'Missing order details' });
    }

    // Trigger orderPlaced event
    eventEmitter.emit('orderPlaced', orderDetails);

    res.status(200).json({ message: 'Order confirmation sent successfully' });
});

// Route for Driver Notification
router.post('/driver-notification', (req, res) => {
    const { driverDetails } = req.body;

    // Validate driver details
    if (!driverDetails || !driverDetails.email || !driverDetails.phone) {
        return res.status(400).json({ error: 'Missing driver details' });
    }

    // Trigger driverAssigned event
    eventEmitter.emit('driverAssigned', driverDetails);

    res.status(200).json({ message: 'Driver notification sent successfully' });
});

// More routes can be added for other events like paymentReceived, orderShipped, etc.

module.exports = router;
