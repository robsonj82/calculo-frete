const express = require('express');
const router = express.Router();
const freightController = require('../controllers/freightController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/calculate', authMiddleware, freightController.calculate);

module.exports = router;
