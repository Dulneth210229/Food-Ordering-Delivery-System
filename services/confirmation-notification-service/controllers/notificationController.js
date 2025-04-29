// controllers/notificationController.js

const emitter = require('../shared/events/eventEmitter');
const { sendEmail } = require("../services/emailService");

// Direct endpoint to send an email (e.g., test email sending)
const notifyUser = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    await sendEmail(to, subject, message);

    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    res.status(500).json({ error: "Failed to send email." });
  }
};

// Event trigger for Order Placement
const triggerOrderPlaced = (req, res) => {
  const { email, phone, orderId } = req.body;

  emitter.emit('orderPlaced', { email, phone, orderId });

  res.status(200).json({ message: '📦 Order confirmation triggered.' });
};

// Event trigger for Driver Assignment
const triggerDriverAssigned = (req, res) => {
  const { email, phone, deliveryId } = req.body;

  emitter.emit('driverAssigned', { email, phone, deliveryId });

  res.status(200).json({ message: '🚚 Driver notification triggered.' });
};

module.exports = {
  notifyUser,
  triggerOrderPlaced,
  triggerDriverAssigned,
};
