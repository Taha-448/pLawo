const { supabase } = require('../config/supabase');
const { uploadToSupabase } = require('../utils/storageUtils');

const registerLawyer = async (req, res) => {
  const { userId, specialization, city, fees, bio, yearsOfExperience, education, barLicenseNumber } = req.body;
  
  let profilePhoto = null;
  if (req.file) {
    try {
      profilePhoto = await uploadToSupabase(req.file, 'profile-photos');
    } catch (err) {
      console.error("Storage Error:", err);
      // Fallback or handle error
    }
  }

  if (!userId || !specialization || !city) {
    return res.status(400).json({ message: 'Please provide all required basic fields (userId, specialization, city)' });
  }

  try {
    // 1. Verify User exists (created by trigger) - Add small retry loop for race conditions
    let user = null;
    
    for (let i = 0; i < 3; i++) {
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
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

module.exports = {
  registerLawyer
};
