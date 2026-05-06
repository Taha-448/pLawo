const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const upload = require('../middlewares/multerConfig');

// POST /api/auth/register — handles both CLIENT and LAWYER signup
// Uses multer to accept optional file uploads (profile photo, bar license)
// Files won't be stored until the storage layer is configured
router.post('/register', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'barLicenseFile', maxCount: 1 }
]), register);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
