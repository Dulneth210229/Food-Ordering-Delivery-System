const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/emailService");

const userController = {
  register: asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      throw new Error("All fields must be filled");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    // Send welcome email (don't await to avoid delaying response)
    sendWelcomeEmail(email, `${firstName} ${lastName}`);

    res.status(200).json({
      username: `${userCreated.firstName} ${userCreated.lastName}`,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  
  //!Login

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // if email is correct
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login credential");
    }
  
    // Compare the user password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new Error("Invalid login credential");
    }
  
    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "30d",
    });
  
    // Construct the user object to return
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      id: user._id,
    };
  
    res.status(200).json({
      status: "success",
      user: userData, // Add the user object
      userType: "user", // Add userType (since frontend expects it)
      token,
    });
  }),

  //!Profile
  profile: asyncHandler(async (req, res) => {
    //*Find the user

    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User no found");
    }
    //*send response
    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  }),

  //!update user password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    //*find the user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    //*Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    //*resave the user
    await user.save();

    //*send the response
    res.json({
      message: "Password change successfully",
    });
  }),

  //!Update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    //*update the user
    const updateUser = await User.findByIdAndUpdate(
      req.user, //getting the user id from the user authentication middleware
      {
        email, //passing the argument
        username,
      },
      { new: true /*return the updated record*/ } //? This will return all the values
    );

    res.json({
      message: "User profile updated successfully",
      updateUser,
    });
  }),

  //! Delete user
  delete: asyncHandler(async (req, res) => {
    if (await User.findByIdAndDelete(req.user)) {
      res.json({ message: "User deleted Successful" });
    }
  }),
};

module.exports = userController;
