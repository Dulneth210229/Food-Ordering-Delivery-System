const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');
const { auth, checkRole } = require('../middleware/auth');

// Get menu by restaurant ID
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
});

// Create or update menu
router.post('/restaurant/:restaurantId', auth, checkRole(['admin', 'restaurant_owner']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this menu' });
    }

    let menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    
    if (menu) {
      // Update existing menu
      menu.items = req.body.items;
      menu.categories = req.body.categories;
      menu.lastUpdated = Date.now();
      await menu.save();
    } else {
      // Create new menu
      menu = new Menu({
        restaurant: req.params.restaurantId,
        items: req.body.items,
        categories: req.body.categories
      });
      await menu.save();
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu', error: error.message });
  }
});

// Add menu item
router.post('/restaurant/:restaurantId/items', auth, checkRole(['admin', 'restaurant_owner']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this menu' });
    }

    let menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    
    if (!menu) {
      menu = new Menu({
        restaurant: req.params.restaurantId,
        items: [],
        categories: []
      });
    }

    menu.items.push(req.body);
    if (!menu.categories.includes(req.body.category)) {
      menu.categories.push(req.body.category);
    }
    menu.lastUpdated = Date.now();
    
    await menu.save();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error: error.message });
  }
});

// Update menu item
router.put('/restaurant/:restaurantId/items/:itemId', auth, checkRole(['admin', 'restaurant_owner']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this menu' });
    }

    const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const itemIndex = menu.items.findIndex(item => item._id.toString() === req.params.itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menu.items[itemIndex] = { ...menu.items[itemIndex].toObject(), ...req.body };
    menu.lastUpdated = Date.now();
    
    await menu.save();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
});

// Delete menu item
router.delete('/restaurant/:restaurantId/items/:itemId', auth, checkRole(['admin', 'restaurant_owner']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this menu' });
    }

    const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    menu.items = menu.items.filter(item => item._id.toString() !== req.params.itemId);
    menu.lastUpdated = Date.now();
    
    await menu.save();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
});

module.exports = router; 