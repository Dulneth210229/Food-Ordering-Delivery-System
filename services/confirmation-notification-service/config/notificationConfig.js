require('dotenv').config();

module.exports = {
  emailService: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.FROM_EMAIL,         // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD  // App password from Gmail
    }
  },
  smsService: {
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    sender: process.env.VONAGE_FROM // Example: 'Vonage APIs'
  }
};
