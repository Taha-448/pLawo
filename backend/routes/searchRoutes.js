const express = require('express');
const router = express.Router();
const { smartSearch } = require('../controllers/searchController');

// Expects POST with { "description": "..." }
router.post('/smart', smartSearch);

module.exports = router;
