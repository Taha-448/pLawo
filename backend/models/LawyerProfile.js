const mongoose = require('mongoose');

const LawyerProfileSchema = new mongoose.Schema(
  {
    // References the User who owns this profile
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One profile per lawyer
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    bio: {
      type: String,
      default: null,
    },
    fees: {
      type: Number,
      default: 0.0,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    // Storage fields — will store file paths/URLs once storage is set up
    profile_photo: {
      type: String,
      default: null,
    },
    bar_license_file: {
      type: String,
      default: null,
    },
    years_of_experience: {
      type: Number,
      default: 0,
    },
    bar_license_number: {
      type: String,
      default: null,
    },
    education: {
      type: String,
      default: null,
    },
    office_address: {
      type: String,
      default: null,
    },
    // Auto-updated by the Review model's post-save hook (replaces Supabase trigger)
    rating: {
      type: Number,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LawyerProfile', LawyerProfileSchema);
