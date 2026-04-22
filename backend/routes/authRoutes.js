const express = require('express');
const router = express.Router();
const { registerLawyer } = require('../controllers/authController');
const upload = require('../middlewares/multerConfig');

router.post('/register-lawyer', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'barLicenseFile', maxCount: 1 }
]), registerLawyer);

module.exports = router;
