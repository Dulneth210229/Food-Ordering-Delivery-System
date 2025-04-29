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

  //login driver
  loginDriver: asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for driver email
  const driver = await Driver.findOne({ email });

  if (driver && (await bcrypt.compare(password, driver.password))) {
    // Construct the user object to return
    const userData = {
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone, // Include phone since drivers have this field
      id: driver._id,
    };

    res.json({
      status: "success",
      user: userData,
      userType: "driver", // Add userType for driver
      vehicleType: driver.vehicleType, // Keep additional driver-specific fields
      isAvailable: driver.isAvailable,
      token: generateToken(driver._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
}),
// Get driver profile
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