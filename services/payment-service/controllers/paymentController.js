const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const Payment = require('../models/Payment');

// Simple LKR to USD conversion
const convertLKRtoUSD = (lkrAmount) => {
  const conversionRate = 325;
  return Math.round((lkrAmount / conversionRate) * 100); // cents
};

exports.processPayment = async (req, res) => {
  const { paymentMethodId, orderCode } = req.body;

  try {
    // ✅ 1. Get order using orderCode
    const orderResponse = await axios.get(`http://localhost:5000/api/orders/by-code/${orderCode}`);
    const order = orderResponse.data;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const lkrAmount = order.totalAmount;
    const usdAmountInCents = convertLKRtoUSD(lkrAmount);

    if (usdAmountInCents < 50) {
      return res.status(400).json({
        error: `Converted amount too low for Stripe. LKR: ${lkrAmount}`
      });
    }

    // ✅ 2. Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: usdAmountInCents,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        orderId: order._id
      }
    });

    // ✅ 3. Save payment
    await Payment.create({
      orderId: order._id,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method
    });

    // ✅ 4. Notify order service
    await axios.put(`http://localhost:5000/api/orders/${order._id}`, {
      paymentStatus: 'Paid'
    });

    res.status(200).json({
      message: 'Payment successful',
      amountCharged: `$${(usdAmountInCents / 100).toFixed(2)}`,
      paymentIntent
    });

  } catch (err) {
    console.error('Payment Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
