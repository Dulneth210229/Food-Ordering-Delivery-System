const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "car", "scooter"],
      required: true,
    },
    vehiclePlate: {
      type: String,
      required: true,
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);