const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// Register user
router.post('/register', validateRegister, registerUser);

// Login user
router.post('/login', validateLogin, loginUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
