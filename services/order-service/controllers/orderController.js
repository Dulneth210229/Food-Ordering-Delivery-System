const Order = require('../models/order');

// Utility to generate readable order codes
const generateOrderCode = () => {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
  const timePart = now.toTimeString().split(' ')[0].replace(/:/g, '');
  return `ORD-${datePart}-${timePart}`;
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const orderCode = generateOrderCode();

    const newOrder = new Order({
      ...req.body,
      orderCode,
      statusTimeline: [{ status: 'Pending', timestamp: new Date() }]
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by MongoDB _id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by user-friendly orderCode
exports.getOrderByCode = async (req, res) => {
  try {
    const order = await Order.findOne({ orderCode: req.params.code });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order (status or paymentStatus)
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Update payment status
    if (req.body.paymentStatus && req.body.paymentStatus !== order.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;

      if (req.body.paymentStatus === 'Paid') {
        order.status = 'Confirmed';
        order.statusTimeline.push({
          status: 'Confirmed',
          timestamp: new Date()
        });
      }

      await order.save();
      return res.json({ message: 'Payment status updated', order });
    }

    // Allow valid status updates
    if (req.body.status && req.body.status !== order.status) {
      const allowedStatuses = ['Confirmed', 'Preparing', 'Dispatched', 'Delivered', 'Cancelled'];
      if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ error: 'Invalid status update' });
      }

      order.status = req.body.status;
      order.statusTimeline.push({
        status: req.body.status,
        timestamp: new Date()
      });

      await order.save();
      return res.json({ message: 'Order status updated', order });
    }

    // Prevent detail updates if order is already confirmed
    if (order.status !== 'Pending') {
      return res.status(400).json({ error: "Order can't be modified after confirmation." });
    }

    // Update basic fields while still pending
    Object.assign(order, req.body);
    const updated = await order.save();
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Confirm order manually
exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Order is already confirmed or processed.' });
    }

    order.status = 'Confirmed';
    order.statusTimeline.push({
      status: 'Confirmed',
      timestamp: new Date()
    });

    await order.save();
    res.json({ message: 'Order confirmed successfully', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel order if still pending
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled.' });
    }

    order.status = 'Cancelled';
    order.statusTimeline.push({ status: 'Cancelled', timestamp: new Date() });

    await order.save();
    res.json({ message: 'Order cancelled successfully', order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
