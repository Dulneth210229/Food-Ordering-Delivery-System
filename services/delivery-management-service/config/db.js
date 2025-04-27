const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DB_URI;
    if (!uri) throw new Error("DB_URI is not defined in environment variables");

    const conn = await mongoose.connect(uri, {
      //useNewUrlParser: true, // This is still necessary
      //useUnifiedTopology: true, // This is still necessary
    });

    console.log(`MongoDB connected at ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
