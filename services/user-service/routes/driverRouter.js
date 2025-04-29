const express = require("express");
const {
  registerDriver,
  loginDriver,
  getDriverProfile,
} = require("../controllers/driverController");
const { protectDriver } = require("../middleware/driverAuth");

const router = express.Router();

router.post("/api/v1/drivers/register", registerDriver);
router.post("/api/v1/drivers/login", loginDriver);
router.get("/api/v1/drivers/profile", protectDriver, getDriverProfile);

module.exports = router;
