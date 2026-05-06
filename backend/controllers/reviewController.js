const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// ─────────────────────────────────────────────────────────────────────────────
// createReview
// Allows a client to review a completed appointment.
// Note: The lawyer's average rating is automatically updated via a Mongoose
// post-save hook on the Review model (replaces the Supabase DB trigger).
// ─────────────────────────────────────────────────────────────────────────────
const createReview = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating) {
      return res.status(400).json({ message: 'Appointment ID and rating are required' });
    }

    // 1. Verify appointment exists and belongs to this client and is COMPLETED
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      client_id: clientId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'You can only review completed appointments' });
    }

    // 2. Create the review
    const review = await Review.create({
      appointment_id: appointmentId,
      client_id: clientId,
      lawyer_id: appointment.lawyer_id,
      rating: parseInt(rating),
      comment
    });

    res.status(201).json({ message: 'Review submitted successfully', data: review });
  } catch (error) {
    console.error('Create review error:', error);
    
    // Handle duplicate review (Unique constraint on appointment_id)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this appointment' });
    }
    
    res.status(500).json({ message: 'Server error submitting review' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getLawyerReviews
// Returns all reviews for a specific lawyer, sorted by newest first.
// ─────────────────────────────────────────────────────────────────────────────
const getLawyerReviews = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const reviews = await Review.find({ lawyer_id: lawyerId })
      .populate('client_id', 'name')
      .sort({ createdAt: -1 });

    // Format for frontend
    const formatted = reviews.map(r => ({
      id: r._id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.createdAt,
      client: {
        name: r.client_id?.name || 'Anonymous'
      }
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

module.exports = {
  createReview,
  getLawyerReviews
};
