const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');

// ─────────────────────────────────────────────────────────────────────────────
// getLawyers
// Returns all lawyers who have been verified by an admin.
// ─────────────────────────────────────────────────────────────────────────────
const getLawyers = async (req, res) => {
  try {
    // Find all verified profiles and populate the base user info (name, email)
    const profiles = await LawyerProfile.find({ is_verified: true })
      .populate('user_id', 'name email');

    // Format the response to match the old Supabase structure for frontend compatibility
    const lawyers = profiles.map(profile => ({
      id: profile.user_id._id,
      name: profile.user_id.name,
      email: profile.user_id.email,
      lawyer_profile: profile
    }));

    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getLawyerById
// Returns a single lawyer's full profile by their user ID.
// ─────────────────────────────────────────────────────────────────────────────
const getLawyerById = async (req, res) => {
  try {
    const { id: lawyerId } = req.params;

    const user = await User.findById(lawyerId).select('name email role');
    if (!user || user.role !== 'LAWYER') {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    const profile = await LawyerProfile.findOne({ user_id: lawyerId });
    if (!profile) {
      return res.status(404).json({ message: 'Lawyer profile not found' });
    }

    // Format for frontend
    const lawyer = {
      id: user._id,
      name: user.name,
      email: user.email,
      lawyer_profile: profile
    };

    res.status(200).json(lawyer);
  } catch (error) {
    console.error('Error fetching lawyer by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// updateLawyerProfile
// Allows a lawyer to update their own profile details and upload new files.
// ─────────────────────────────────────────────────────────────────────────────
const updateLawyerProfile = async (req, res) => {
  try {
    const { specialization, city, bio, fees, education, barLicenseNumber, officeAddress } = req.body;
    const userId = req.user.userId;
    
    let updateData = {
      specialization,
      city,
      bio,
      education,
      bar_license_number: barLicenseNumber,
      office_address: officeAddress,
      fees: parseFloat(fees) || 0.00
    };

    if (req.files) {
      if (req.files.profilePhoto) {
        updateData.profile_photo = req.files.profilePhoto[0].path;
      }
      if (req.files.barLicenseFile) {
        updateData.bar_license_file = req.files.barLicenseFile[0].path;
      }
    }

    const updatedProfile = await LawyerProfile.findOneAndUpdate(
      { user_id: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating lawyer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getLawyers,
  getLawyerById,
  updateLawyerProfile
};
