const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    // Password will be set during auth migration (hashed with bcryptjs)
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['CLIENT', 'LAWYER', 'ADMIN'],
      default: 'CLIENT',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for Lawyer Profile
UserSchema.virtual('lawyer_profile', {
  ref: 'LawyerProfile',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true,
});

// Virtual for Appointments (as a lawyer)
UserSchema.virtual('appointments_as_lawyer', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'lawyer_id',
});

module.exports = mongoose.model('User', UserSchema);
