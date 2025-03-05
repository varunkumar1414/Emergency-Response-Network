const express = require('express');
const { getAlerts } = require('../controllers/alertController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/any', verifyToken, getAlerts);

module.exports = router;
