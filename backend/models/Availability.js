const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema(
  {
    // The lawyer who set this availability slot
    lawyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (matches JS Date.getUTCDay())
    day_of_week: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    // Stored as "HH:MM" strings (e.g. "09:00", "17:30")
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', AvailabilitySchema);
