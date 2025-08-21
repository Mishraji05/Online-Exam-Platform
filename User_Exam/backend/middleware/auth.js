const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware: Processing request');
    console.log('Headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token extracted:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Token decoded successfully, userId:', decoded.userId);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Auth middleware: User not found');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    console.log('Auth middleware: User authenticated successfully:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    console.error('Error stack:', error.stack);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;