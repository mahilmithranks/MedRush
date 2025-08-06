const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // ... (your existing protect function, no changes needed here)
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// New function to check for pharmacist role
const isPharmacist = (req, res, next) => {
  if (req.user && req.user.role === 'pharmacist') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a pharmacist' });
  }
};

module.exports = { protect, isPharmacist };