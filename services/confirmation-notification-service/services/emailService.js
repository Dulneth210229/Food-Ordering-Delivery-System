// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD,
  },
});

const sendEmail = async (to, subject, message, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || process.env.FROM_EMAIL,
    to,
    subject,
    text: message,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };
