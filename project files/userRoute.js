const express = require('express');
const { registerUser, loginUser, updateUserProfile, logout } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update', verifyToken, updateUserProfile);
router.post('/logout', logout);

module.exports = router;
