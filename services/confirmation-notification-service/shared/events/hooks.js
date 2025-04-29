const emitter = require('./eventEmitter');
const { sendEmail } = require('../../services/emailService');
const { sendSMS } = require('../../services/smsService'); // Now using Vonage version
const { smsService } = require('../../config/notificationConfig');

// Order Confirmation
emitter.on('orderPlaced', async ({ email, phone, orderId }) => {
  const msg = `<h2>Order Confirmed</h2><p>Your order ${orderId} has been successfully placed!</p>`;
  await sendEmail(email, 'Order Confirmation', msg);

  const smsText = `Your order ${orderId} has been confirmed!`;
  await sendSMS(phone, smsText); // Vonage SMS sending

  logNotification('orderPlaced', email, `Order ID: ${orderId}`);
});

// Driver Assignment
emitter.on('driverAssigned', async ({ email, phone, deliveryId }) => {
  const msg = `<h2>Delivery Assigned</h2><p>You have a new delivery: ${deliveryId}</p>`;
  await sendEmail(email, 'New Delivery Assigned', msg);

  const smsText = `New delivery assigned: ${deliveryId}`;
  await sendSMS(phone, smsText); // Vonage SMS sending

  logNotification('driverAssigned', email, `Delivery ID: ${deliveryId}`);
});
