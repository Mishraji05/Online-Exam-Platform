const express = require('express');
const { getExamQuestions } = require('../controllers/examController');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const User = require('../models/User');

const router = express.Router();

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    res.json({ 
      message: 'Database connection test successful',
      questionCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection test failed',
      error: error.message 
    });
  }
});

// Test endpoint to check users in database
router.get('/test-users', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find().select('-password');
    res.json({ 
      message: 'User database test successful',
      userCount,
      users,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User database test error:', error);
    res.status(500).json({ 
      message: 'User database test failed',
      error: error.message 
    });
  }
});

router.get('/questions', auth, getExamQuestions);

module.exports = router;