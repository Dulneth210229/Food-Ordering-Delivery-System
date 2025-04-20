const express = require('express');
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const adminUserRouter = require("./routes/adminUserRoute");
const driverRouter = require("./routes/driverRouter");
const errorHandler = require("./middleware/ErrorHandler");


app.use(express.json());

// Routes
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", adminUserRouter);
app.use("/", driverRouter);

// Error handler middleware
app.use(errorHandler);

// Connect to DB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((e) => console.log(e));

// Start server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => console.log(`Server running on port... ${PORT}`));
}