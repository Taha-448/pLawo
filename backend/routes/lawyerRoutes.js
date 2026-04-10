const express = require('express');
const router = express.Router();
const { getLawyers, getLawyerById, updateLawyerProfile } = require('../controllers/lawyerController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.get('/', getLawyers);
router.get('/:id', getLawyerById);
// Only authenticated lawyers can update their profile
router.put('/profile', authenticateUser, updateLawyerProfile);

module.exports = router;
