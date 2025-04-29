const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { auth, checkRole } = require('../middleware/auth');

// Get all orders for a user
router.get('/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get all orders for a restaurant
router.get('/restaurant/:restaurantId', auth, checkRole(['admin', 'restaurant_owner']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these orders' });
    }

    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'restaurant_owner') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', auth, checkRole(['admin', 'restaurant_owner']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    
    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = req.body.status;
    if (req.body.status === 'delivered') {
      order.actualDeliveryTime = Date.now();
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Update payment status
router.patch('/:id/payment', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only the user who placed the order can update payment status
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update payment status' });
    }

    order.paymentStatus = req.body.paymentStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
});

module.exports = router; 