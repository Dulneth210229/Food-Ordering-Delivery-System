const express = require("express");
//!Imported the user controller file
const userController = require("../controllers/userController");
const isAuthenticated = require("../middleware/isAuth");

const userRouter = express.Router();

userRouter.post("/api/v1/users/register", userController.register); //!Register
userRouter.post("/api/v1/users/login", userController.login); //!Login
userRouter.get(
  "/api/v1/users/profile",
  isAuthenticated,
  userController.profile
); //!Profile
userRouter.put(
  "/api/v1/users/change-password",
  isAuthenticated,
  userController.changeUserPassword
); //! change password
userRouter.put(
  "/api/v1/users/update-profile",
  isAuthenticated,
  userController.updateUserProfile
); //! Update profile
userRouter.delete(
  "/api/v1/users/delete-account",
  isAuthenticated,
  userController.delete
); //! Delete profile
module.exports = userRouter;
