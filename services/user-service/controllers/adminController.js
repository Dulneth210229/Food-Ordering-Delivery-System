const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/emailService");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

const adminController = {
  register: asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      throw new Error("All fields must be filled");
    }

    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      throw new Error("Admin already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminCreated = await Admin.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    // Send welcome email
    sendWelcomeEmail(email, `${firstName} ${lastName}`);

    res.json({
      username: adminCreated.username,
      email: adminCreated.email,
      id: adminCreated._id,
    });
  }),
  //! Admin Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //* find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Invalid login credential");
    }

    //*Compare the admin password
    const isMatched = await bcrypt.compare(password, admin.password);
    if (!isMatched) {
      throw new Error("Invalid login Credentials");
    }

    //!Generate the token
    //? Send the admin id along with token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_KEY, {
      expiresIn: "30d",
    });

    res.json({
      status: "success",
      token,
      id: admin._id,
      email: admin.email,
      username: admin.username,
    });
  }),

  //! Admin Profile
  profile: asyncHandler(async (req, res) => {
    //* Find the admin
    const admin = await Admin.findById(req.admin);
    //Validate admin
    if (!admin) {
      throw new Error("Admin not found");
    }

    //* send the response
    res.json({
      username: admin.username,
      email: admin.email,
    });
  }),

  //! Admin password update
  changeAdminPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    const admin = await Admin.findById(req.admin);

    if (!admin) {
      throw new Error("Admin not found");
    }

    //!----Hash the new password before saving --------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;

    //* Resave the admin
    await admin.save();

    //*send the response message
    res.json({ message: "Password Updated successfully" });
  }),

  //! Admin profile
  updateAdminProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    //Update the admin
    const updateAdmin = await Admin.findByIdAndUpdate(
      req.admin,
      {
        email,
        username,
      },
      {
        new: true, //return the updated record
      }
    );
    res.json({
      message: "Admin profile updated successful",
      updateAdmin,
    });
  }),
};

module.exports = adminController;
