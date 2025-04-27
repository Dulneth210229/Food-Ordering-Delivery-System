module.exports = {
    service: 'gmail', // or your email service (e.g., 'yahoo', 'outlook')
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'noreply@yourdomain.com'
  };