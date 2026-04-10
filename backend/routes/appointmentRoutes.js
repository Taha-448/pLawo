const express = require('express');
const router = express.Router();
const { createAppointment, getMyAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.post('/', authenticateUser, createAppointment);
router.get('/', authenticateUser, getMyAppointments);
router.put('/:id/status', authenticateUser, updateAppointmentStatus);

module.exports = router;
