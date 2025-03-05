const express = require('express');
const { createReport, getReports, getNearbyReports, filterReports } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', verifyToken, createReport);
router.get('/all', verifyToken, getReports);
router.get('/near/:location', verifyToken, getNearbyReports);
router.get('/filter', verifyToken, filterReports);

module.exports = router;
