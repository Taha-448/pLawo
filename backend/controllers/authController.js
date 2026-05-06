const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');

// Helper — generates a signed JWT containing userId and role
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Handles both CLIENT and LAWYER registration in one endpoint.
// Lawyer fields (specialization, city, etc.) are only required when role=LAWYER.
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  const {
    name, email, password, role,
    // Lawyer-specific fields
    specialization, city, fees, bio,
    yearsOfExperience, education,
    barLicenseNumber, officeAddress
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required' });
  }

  const normalizedRole = role.toUpperCase();
  if (!['CLIENT', 'LAWYER'].includes(normalizedRole)) {
    return res.status(400).json({ message: 'Role must be CLIENT or LAWYER' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Block duplicate accounts
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user record
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: normalizedRole,
    });

    // For lawyers — create their profile record
    if (normalizedRole === 'LAWYER') {
      if (!specialization || !city) {
        // Rollback user creation if profile data is missing
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ message: 'Specialization and city are required for lawyer registration' });
      }

      let profile_photo = null;
      let bar_license_file = null;

      if (req.files) {
        if (req.files.profilePhoto) {
          profile_photo = req.files.profilePhoto[0].path; // Cloudinary URL
        }
        if (req.files.barLicenseFile) {
          bar_license_file = req.files.barLicenseFile[0].path; // Cloudinary URL
        }
      }

      await LawyerProfile.create({
        user_id: user._id,
        specialization: specialization.trim(),
        city: city.trim(),
        fees: parseFloat(fees) || 0.0,
        bio: bio || null,
        years_of_experience: parseInt(yearsOfExperience) || 0,
        education: education || null,
        bar_license_number: barLicenseNumber || null,
        office_address: officeAddress || null,
        profile_photo,
        bar_license_file,
        is_verified: false,
        rating: 0.0,
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      message: normalizedRole === 'LAWYER'
        ? 'Lawyer account created successfully. Your profile is pending admin verification.'
        : 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Verifies credentials and returns a JWT + user info.
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Fetch user — we need the password field which is hidden by default
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login };
