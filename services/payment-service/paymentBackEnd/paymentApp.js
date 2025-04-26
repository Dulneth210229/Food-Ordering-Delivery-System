const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Load routes
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/payment', paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
