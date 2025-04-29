const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  items: [
    {
      itemId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  statusTimeline: [
    {
      status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Dispatched', 'Delivered', 'Cancelled']
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  orderCode: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
