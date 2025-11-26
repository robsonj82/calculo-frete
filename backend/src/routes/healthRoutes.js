const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Health check routes
router.get('/ping', healthController.ping);
router.get('/health', healthController.health);

module.exports = router;
