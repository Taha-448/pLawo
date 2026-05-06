const express = require('express');
const router = express.Router();
const { getResources, submitMessage } = require('../controllers/miscController');

router.get('/resources', getResources);
router.post('/contact', submitMessage);

module.exports = router;
