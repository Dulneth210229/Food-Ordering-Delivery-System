const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  licenseNumber: { type: String, required: true },
  address: { type: String, required: false }, // ✅ Must be present
  status: { type: String, default: "active" },
  currentOrders: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);
