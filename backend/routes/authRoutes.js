const express = require('express');
const router = express.Router();
const { registerClient, registerLawyer, login } = require('../controllers/authController');
const upload = require('../middleware/multerConfig');

router.post('/register-client', registerClient);
router.post('/register-lawyer', upload.single('profilePhoto'), registerLawyer);
router.post('/login', login);

module.exports = router;
