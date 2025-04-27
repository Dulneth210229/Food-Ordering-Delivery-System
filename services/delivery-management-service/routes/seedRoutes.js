const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

// Seed sample deliveries
router.get('/', async (req, res) => {
  try {
    await Delivery.deleteMany(); // Optional: Clear existing deliveries

    const sampleDeliveries = [
      {
        customerId: "cus001",
        driverId: "driver001",
        location: { lat: 6.9271, lng: 79.8612 },
        status: "Assigned"
      },
      {
        customerId: "cus002",
        driverId: "driver002",
        location: { lat: 7.2906, lng: 80.6337 },
        status: "Pending"
      }
    ];

    const created = await Delivery.insertMany(sampleDeliveries);
    res.status(201).json({ message: "Seeded deliveries successfully", created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seeding failed", error: err });
  }
});

module.exports = router;
