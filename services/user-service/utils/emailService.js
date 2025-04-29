const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

const transporter = nodemailer.createTransport(emailConfig);

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: emailConfig.from,
    to: email,
    subject: 'Welcome to Our Platform!',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for registering with us. We're excited to have you on board.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <br/>
      <p>Best regards,</p>
      <p>Your Platform Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = { sendWelcomeEmail };