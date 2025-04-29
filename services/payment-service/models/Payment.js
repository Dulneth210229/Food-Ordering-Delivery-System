const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  amount: Number,
  currency: String,
  status: String,
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
