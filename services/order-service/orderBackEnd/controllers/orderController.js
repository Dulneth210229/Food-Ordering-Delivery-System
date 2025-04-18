const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      if (order.status !== 'Pending') {
        return res.status(400).json({ error: "Order can't be modified after confirmation." });
      }
  
      const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.confirmOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      if (order.status !== 'Pending') {
        return res.status(400).json({ error: "Order is already confirmed or processed." });
      }
  
      order.status = 'Confirmed';
      await order.save();
  
      res.json({ message: "Order confirmed successfully", order });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
