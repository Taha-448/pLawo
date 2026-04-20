const express = require('express');
const router = express.Router();
const { setAvailability, getLawyerAvailability } = require('../controllers/availabilityController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Get a lawyer's availability (public/clients)
router.get('/:lawyerId', getLawyerAvailability);

// Set availability (Lawyers only)
router.post('/', authenticateUser, setAvailability);

module.exports = router;
