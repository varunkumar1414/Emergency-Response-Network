const express = require('express');
const { createEmergency, getEmergencies, updateEmergency,getNearbyEmergencies, filterEmergencies } = require('../controllers/emergencyController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', verifyToken, createEmergency);
router.get('/all', verifyToken, getEmergencies);
router.put('/update/:emergencyId', verifyToken, updateEmergency);
router.get('/near/:location', verifyToken, getNearbyEmergencies);
router.get('/filter', filterEmergencies);

module.exports = router;
