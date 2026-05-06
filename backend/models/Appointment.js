const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
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
    // Stored as a Date object (e.g. "2025-08-15")
    date: {
      type: Date,
      required: true,
    },
    // Stored as "HH:MM" string (e.g. "10:00")
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    legal_issue: {
      type: String,
      default: 'Consultation Request',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for Reviews
AppointmentSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'appointment_id',
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
