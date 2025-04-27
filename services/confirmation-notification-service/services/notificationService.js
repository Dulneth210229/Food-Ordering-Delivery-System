const nodemailer = require('nodemailer');
const { Vonage } = require('@vonage/server-sdk');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text
  });
};

const sendSMS = async (to, text) => {
  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
  });

  vonage.sms.send({ to, from: process.env.VONAGE_FROM || 'VonageAPI', text }, (err, responseData) => {
    if (err) {
      console.error(err);
    } else {
      console.log(responseData);
    }
  });
};

module.exports = {
  sendEmail,
  sendSMS
};
