const express = require('express');
const router = express.Router();
const { createReview, getLawyerReviews } = require('../controllers/reviewController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.post('/', authenticateUser, createReview);
router.get('/lawyer/:lawyerId', getLawyerReviews);

module.exports = router;
