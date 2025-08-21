const express = require('express');
const { submitExam, getResult, getUserResults } = require('../controllers/resultController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/submit', auth, submitExam);
router.get('/:resultId', auth, getResult);
router.get('/', auth, getUserResults);

module.exports = router;