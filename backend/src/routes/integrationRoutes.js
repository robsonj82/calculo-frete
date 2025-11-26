const express = require('express');
const router = express.Router();
const woocommerceController = require('../controllers/woocommerceController');

const authMiddleware = require('../middleware/authMiddleware');

// Public route for Webhook (protected by signature validation inside controller)
router.post('/woocommerce/webhook', woocommerceController.handleWebhook);

// Protected routes for API integration
router.get('/woocommerce/orders', authMiddleware, woocommerceController.listOrders);
router.post('/woocommerce/calculate/:id', authMiddleware, woocommerceController.calculateOrderFreight);

module.exports = router;
