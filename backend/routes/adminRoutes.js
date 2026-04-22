const express = require('express');
const router = express.Router();
const { adminDashboard, verifyLawyer, getLicenseUrl } = require('../controllers/adminController');
const { authenticateUser, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticateUser, requireAdmin, adminDashboard);
router.put('/verify/:lawyerId', authenticateUser, requireAdmin, verifyLawyer);
router.get('/license/:lawyerId', authenticateUser, getLicenseUrl);

module.exports = router;
