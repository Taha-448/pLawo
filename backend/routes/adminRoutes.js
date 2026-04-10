const express = require('express');
const router = express.Router();
const { adminDashboard, verifyLawyer } = require('../controllers/adminController');
const { authenticateUser, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticateUser, requireAdmin, adminDashboard);
router.put('/verify/:lawyerId', authenticateUser, requireAdmin, verifyLawyer);

module.exports = router;
