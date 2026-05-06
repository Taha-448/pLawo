const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lawyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Unique constraint — replaces the Supabase: UNIQUE (appointment_id)
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      unique: true, // One review per appointment — prevents duplicates
      sparse: true, // Allows null values while still enforcing uniqueness on non-null
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST-SAVE HOOK — replaces the Supabase trigger: tr_update_lawyer_rating
//
// After every review is created or updated, recalculate the lawyer's average
// rating and save it to their LawyerProfile. Mirrors the SQL trigger exactly:
//   ROUND(AVG(rating)::numeric, 1)
// ─────────────────────────────────────────────────────────────────────────────
ReviewSchema.post('save', async function () {
  try {
    const LawyerProfile = require('./LawyerProfile');

    // Get all reviews for this lawyer
    const reviews = await this.constructor.find({ lawyer_id: this.lawyer_id });

    if (reviews.length === 0) return;

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const rounded = Math.round(avg * 10) / 10; // Round to 1 decimal place

    await LawyerProfile.findOneAndUpdate(
      { user_id: this.lawyer_id },
      { rating: rounded }
    );
  } catch (err) {
    console.error('Error updating lawyer rating after review save:', err);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
