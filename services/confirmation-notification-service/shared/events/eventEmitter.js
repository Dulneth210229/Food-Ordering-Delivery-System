const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Existing event handlers
eventEmitter.on('orderPlaced', (orderDetails) => {
    sendOrderConfirmationEmail(orderDetails);
    sendOrderConfirmationSMS(orderDetails);
});

eventEmitter.on('driverAssigned', (driverDetails) => {
    sendDriverNotificationEmail(driverDetails);
    sendDriverNotificationSMS(driverDetails);
});

// New events
eventEmitter.on('paymentReceived', (paymentDetails) => {
    sendPaymentReceivedEmail(paymentDetails);
    sendPaymentReceivedSMS(paymentDetails);
});

eventEmitter.on('orderShipped', (orderDetails) => {
    sendOrderShippedEmail(orderDetails);
    sendOrderShippedSMS(orderDetails);
});

// Add more events as required
module.exports = eventEmitter;
