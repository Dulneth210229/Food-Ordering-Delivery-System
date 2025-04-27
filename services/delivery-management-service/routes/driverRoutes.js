const express = require('express');
const router = express.Router();
const Driver = require('../models/driver');
const driverController = require('../controllers/driverController'); 

// POST /api/drivers - Create a new driver
router.post("/", async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        licenseNumber,
        address,
        status = "active",
        isAvailable = true,
        currentOrders = 0
      } = req.body;
  
      // Validation
      if (!name || !email || !phone || !licenseNumber || !address) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const newDriver = new Driver({
        name,
        email,
        phone,
        licenseNumber,
        address,
        status,
        isAvailable,
        currentOrders
      });
  
      const savedDriver = await newDriver.save();
      res.status(201).json(savedDriver);
    } catch (error) {
      console.error("❌ Error creating driver:", error.message);
      res.status(500).json({
        message: "Failed to create driver",
        error: error.message
      });
    }
  });

router.get('/:id', driverController.getDriverById);


router.get("/", async (req, res) => {
    try {
      const drivers = await Driver.find();
      res.json(drivers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch drivers", error: err.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Driver not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update driver", error: err.message });
    }
  });

  // DELETE a driver
router.delete("/:id", async (req, res) => {
    try {
      const deleted = await Driver.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Driver not found" });
      res.json({ message: "Driver deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete driver", error: err.message });
    }
  });

module.exports = router;
