const express = require('express');
const router = express.Router();
const { getLawyers, getLawyerById, updateLawyerProfile } = require('../controllers/lawyerController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const upload = require('../middleware/multerConfig');

router.get('/', getLawyers);
router.get('/:id', getLawyerById);
// Only authenticated lawyers can update their profile
router.put('/profile', authenticateUser, upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'barLicenseFile', maxCount: 1 }
]), updateLawyerProfile);

module.exports = router;
