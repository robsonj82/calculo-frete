const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', historyController.create);
router.get('/', historyController.list);
router.get('/export', historyController.exportCsv);

module.exports = router;
