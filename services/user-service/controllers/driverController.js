const asyncHandler = require("express-async-handler");
const Driver = require("../models/Driver");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/emailService");

const driverController = {
  registerDriver: asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      licenseNumber,
      vehicleType,
      vehiclePlate,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !licenseNumber ||
      !vehicleType ||
      !vehiclePlate
    ) {
      res.status(400);
      throw new Error("Please fill all required fields");
    }

    const driverExists = await Driver.findOne({ email });
    if (driverExists) {
      res.status(400);
      throw new Error("Driver already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const driver = await Driver.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      licenseNumber,
      vehicleType,
      vehiclePlate,
    });

    // Send welcome email
    sendWelcomeEmail(email, `${firstName} ${lastName}`);

    res.status(201).json({
      _id: driver._id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
    });
  }),

  // @desc    Authenticate driver
  // @route   POST /api/v1/drivers/login
  // @access  Public
  loginDriver: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for driver email
    const driver = await Driver.findOne({ email });

    if (driver && (await bcrypt.compare(password, driver.password))) {
      res.json({
        _id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        vehicleType: driver.vehicleType,
        isAvailable: driver.isAvailable,
        token: generateToken(driver._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid credentials");
    }
  }),

  // @desc    Get driver profile
  // @route   GET /api/v1/drivers/me
  // @access  Private (Driver only)
  getDriverProfile: asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.driver._id).select("-password");

    if (!driver) {
      res.status(404);
      throw new Error("Driver not found");
    }

    res.status(200).json(driver);
  }),
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};

module.exports = driverController;