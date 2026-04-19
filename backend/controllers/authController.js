const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// registerClient is now handled by Supabase Auth + Trigger on frontend
// This endpoint is kept as a fallback or for syncing if needed
const registerClient = async (req, res) => {
  const { email, name } = req.body;
  // If the frontend calls this, it means Supabase Auth already created the user.
  // The trigger handles the insert into public."User".
  // We can just return success here.
  res.status(200).json({ message: 'Client registration handled by Supabase Auth' });
};

const registerLawyer = async (req, res) => {
  const { userId, specialization, city, fees, bio, yearsOfExperience, education, barLicenseNumber } = req.body;
  
  let profilePhoto = req.body.profilePhoto;
  if (req.file) {
    profilePhoto = `/uploads/${req.file.filename}`;
  }

  if (!userId || !specialization || !city) {
    return res.status(400).json({ message: 'Please provide all required basic fields (userId, specialization, city)' });
  }

  try {
    // 1. Verify User exists (created by trigger) - Add small retry loop for race conditions
    let user = null;
    
    for (let i = 0; i < 3; i++) {
      // Use .select().eq().maybeSingle() instead of .single() to avoid PGRST116 error during retries
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (data) {
        user = data;
        break;
      }
      
      console.log(`User not found yet (attempt ${i + 1}), retrying in 1s...`);
      if (error) console.log("Current Supabase Error:", error.message);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }

    if (!user) {
      console.error("User not found for profile creation after all retries.");
      return res.status(404).json({ message: 'User record not yet created. If you just signed up, please wait a moment and try again or ensure your Supabase trigger is active.' });
    }

    // 2. Create LawyerProfile
    const { error: profileError } = await supabase
      .from('LawyerProfile')
      .insert({
        userId: user.id,
        specialization,
        city,
        fees: parseFloat(fees) || 0.00,
        bio,
        yearsOfExperience: parseInt(yearsOfExperience) || 0,
        education,
        barLicenseNumber,
        profilePhoto: profilePhoto || null,
        isVerified: false,
        rating: 4.8
      });

    if (profileError) {
      console.error("Profile Creation Error:", profileError);
      throw profileError;
    }

    res.status(201).json({ message: 'Lawyer profile created successfully', user });
  } catch (error) {
    console.error("Register Lawyer Error:", error);
    res.status(500).json({ message: 'Server error during profile creation' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Note: With Supabase Auth, you'd normally use supabase.auth.signInWithPassword
    // but if you want to keep the local password check (if you synced passwords):
    if (user.password) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ user: { id: user.id, name: user.name, role: user.role }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerClient,
  registerLawyer,
  login
};
