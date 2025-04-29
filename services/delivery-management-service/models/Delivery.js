const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    required: true,
    enum: ["Assigned", "Pending", "In Transit", "Delivered"],
  },
}, {
  timestamps: true,
});

const Delivery = mongoose.model('Delivery', DeliverySchema);
module.exports = Delivery;
