const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
  const { amount, currency, paymentMethodId, orderId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        orderId // Optional: attach order info
      }
    });

    // Optional: Notify order service (e.g., via Axios or RabbitMQ)

    res.status(200).json({
      message: 'Payment successful',
      paymentIntent
    });
  } catch (err) {
    console.error('Stripe Error:', err.message);
    res.status(400).json({ error: err.message });
  }
};
