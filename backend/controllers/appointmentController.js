const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Review = require('../models/Review');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
// createAppointment
// Books a new legal consultation after verifying lawyer availability and
// ensuring no conflicting bookings exist for that slot.
// ─────────────────────────────────────────────────────────────────────────────
const createAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time } = req.body;
    const { userId: clientId, role } = req.user;
 
    if (role !== 'CLIENT') {
      return res.status(403).json({ message: 'Only clients can book appointments' });
    }

    if (!lawyerId || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields (lawyerId, date, time)' });
    }

    // 1. Validate Lawyer Availability
    const dayOfWeek = new Date(date).getUTCDay(); 
    
    const availability = await Availability.findOne({
      lawyer_id: lawyerId,
      day_of_week: dayOfWeek,
      start_time: { $lte: time },
      end_time: { $gte: time }
    });

    if (!availability) {
      return res.status(400).json({ message: 'Lawyer is not available at this day or time' });
    }

    // 2. Check for Conflicts (Ignore CANCELLED status)
    const conflict = await Appointment.findOne({
      lawyer_id: lawyerId,
      date: date,
      time: time,
      status: { $in: ['PENDING', 'CONFIRMED', 'COMPLETED'] }
    });

    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already reserved or booked. Please choose another.' });
    }

    // 3. Create Appointment
    const appointment = await Appointment.create({
      client_id: clientId,
      lawyer_id: lawyerId,
      date: date,
      time,
      legal_issue: req.body.legalIssue || 'Consultation Request',
      status: 'PENDING'
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error creating appointment' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getMyAppointments
// Returns all appointments for the logged-in user (as a client or lawyer).
// Includes populated lawyer/client info and reviews.
// ─────────────────────────────────────────────────────────────────────────────
const getMyAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let filter = {};

    if (role === 'CLIENT') {
      filter.client_id = userId;
    } else if (role === 'LAWYER') {
      filter.lawyer_id = userId;
    } else {
      return res.status(403).json({ message: 'Not authorized for appointments' });
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: 'lawyer_id',
        select: 'name',
        populate: { path: 'lawyer_profile' }
      })
      .populate('client_id', 'name email')
      .populate('reviews')
      .sort({ date: 1, time: 1 });

    // Map to the same structure as the old Supabase response
    const formatted = appointments.map(apt => {
      const doc = apt.toObject({ virtuals: true });
      return {
        ...doc,
        lawyer: {
          name: doc.lawyer_id?.name,
          lawyer_profile: doc.lawyer_id?.lawyer_profile
        },
        client: {
          name: doc.client_id?.name,
          email: doc.client_id?.email
        }
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// updateAppointmentStatus
// Allows a lawyer to accept/complete/cancel an appointment.
// ─────────────────────────────────────────────────────────────────────────────
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const lawyerId = req.user.userId;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, lawyer_id: lawyerId },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or not authorized' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getLawyerBookedSlots
// Returns all active appointments for a lawyer to help the frontend disable
// already booked time slots in the UI.
// ─────────────────────────────────────────────────────────────────────────────
const getLawyerBookedSlots = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const booked = await Appointment.find({
      lawyer_id: lawyerId,
      status: { $in: ['PENDING', 'CONFIRMED', 'COMPLETED'] }
    }).select('date time');

    res.json(booked);
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    res.status(500).json({ message: 'Server error fetching booked slots' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  getLawyerBookedSlots
};
