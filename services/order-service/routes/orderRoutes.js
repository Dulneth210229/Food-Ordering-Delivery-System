const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.put('/:id', orderController.updateOrder);
router.put('/:id/confirm', orderController.confirmOrder);
router.get('/:id', orderController.getOrderById);
router.get('/by-code/:code', orderController.getOrderByCode);
router.put('/cancel/:id', orderController.cancelOrder);




module.exports = router;