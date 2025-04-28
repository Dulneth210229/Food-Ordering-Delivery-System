const Delivery = require('../models/Delivery');
const Driver = require('../models/driver');
const { assignDriver } = require('../services/assignmentService');
const eventEmitter = require('../shared/events/eventEmitter');
const geocodeAddress = require('../utils/geocode'); // Import correctly

exports.createDelivery = async (req, res) => {
  try {
    const { customerId, address, status } = req.body;
    if (!customerId || !address || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Geocode the delivery address
    const location = await geocodeAddress(address);
    if (!location) {
      return res.status(400).json({ message: "Could not geocode address" });
    }

    // 2️⃣ Find the single closest driver (ignoring availability)
    const driver = await assignDriver(location);

    // 3️⃣ Create & save the new delivery
    const delivery = await new Delivery({
      customerId,
      driverId: driver._id,
      address,
      location,
      status
    }).save();

    // 4️⃣ Return both objects
    return res.status(201).json({
      delivery,
      assignedDriver: {
        id: driver._id,
        name: driver.name
      }
    });
  } catch (err) {
    console.error("❌ createDelivery error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deliveries", error: err.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }
    res.json(delivery);
  } catch (err) {
    console.error("❌ Error fetching delivery:", err.message);
    res.status(500).json({ message: "Error fetching delivery", error: err.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { customerId, address, location, status } = req.body;

    const updated = await Delivery.findByIdAndUpdate(
      req.params.id,
      { customerId, address, location, status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const deleted = await Delivery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Delivery not found" });
    res.json({ message: "Delivery deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete delivery", error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (status === 'Delivered') {
      const driver = await Driver.findById(delivery.driverId);
      if (driver) {
        driver.currentOrders = Math.max(driver.currentOrders - 1, 0);
        if (driver.currentOrders === 0) driver.isAvailable = true;
        await driver.save();
      }
    }

    eventEmitter.emit('statusUpdated', { delivery });
    res.json(delivery);
  } catch (err) {
    console.error("❌ Error updating delivery status:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
