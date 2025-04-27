const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/pay', paymentController.processPayment);

router.get('/', async (req, res) => {
    try {
      const payments = await require('../models/Payment').find();
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
