const express = require('express');
const router = express.Router();

const generateTourSuggestion = require('../controllers/aiController');

// Text generation routes
router.post('/tour-suggestions', generateTourSuggestion);

module.exports = router;