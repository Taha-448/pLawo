const express = require('express');
const router = express.Router();
const { createAppointment, getMyAppointments, updateAppointmentStatus, getLawyerBookedSlots } = require('../controllers/appointmentController');
const { authenticateUser } = require('../middlewares/authMiddleware');
 
 router.post('/', authenticateUser, createAppointment);
 router.get('/', authenticateUser, getMyAppointments);
 router.get('/lawyer/:lawyerId', getLawyerBookedSlots);
 router.put('/:id/status', authenticateUser, updateAppointmentStatus);
 
 module.exports = router;
