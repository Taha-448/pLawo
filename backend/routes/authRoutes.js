const express = require('express');
const router = express.Router();
const { registerLawyer } = require('../controllers/authController');
const upload = require('../middleware/multerConfig');

router.post('/register-lawyer', upload.single('profilePhoto'), registerLawyer);

module.exports = router;
