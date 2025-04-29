// routes/deliveryRoutes.js

const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

//  Create a new delivery (auto-assign nearest driver)
router.post("/", deliveryController.createDelivery);

// List all deliveries
router.get("/", deliveryController.getAllDeliveries);

// List deliveries for one driver
//    GET /api/delivery/driver/:driverId
router.get("/driver/:driverId", deliveryController.getDeliveriesByDriver);

//  Get a single delivery by its ID
router.get("/:id", deliveryController.getDeliveryById);

//  Update an existing delivery
router.put("/:id", deliveryController.updateDelivery);

//  Update only status (you already have updateStatus in your controller)
router.put("/status", deliveryController.updateStatus);

//  Delete a delivery
router.delete("/:id", deliveryController.deleteDelivery);

module.exports = router;
