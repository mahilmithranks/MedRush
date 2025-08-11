const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  requestOtp,
  verifyOtp,
  me,
  updateRole // Added updateRole here so no duplicate require
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail); // GET ?token=xxx&email=yyy
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', auth, me);

// Role update route
router.patch('/role', auth, updateRole);

module.exports = router;
