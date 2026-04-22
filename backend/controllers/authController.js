const { supabase } = require('../config/supabase');
const { uploadToSupabase } = require('../utils/storageUtils');

const registerLawyer = async (req, res) => {
  const { userId, specialization, city, fees, bio, yearsOfExperience, education, barLicenseNumber, officeAddress } = req.body;
  
  let profile_photo = null;
  let bar_license_file = null;

  if (req.files) {
    try {
      if (req.files.profilePhoto) {
        profile_photo = await uploadToSupabase(req.files.profilePhoto[0], 'profile-photos');
      }
      if (req.files.barLicenseFile) {
        bar_license_file = await uploadToSupabase(req.files.barLicenseFile[0], 'bar-licenses');
      }
    } catch (err) {
      console.error("Storage Error:", err);
    }
  }

  if (!userId || !specialization || !city) {
    return res.status(400).json({ message: 'Please provide all required basic fields (userId, specialization, city)' });
  }

  try {
    // 1. Verify User exists (created by trigger)
    let user = null;
    
    for (let i = 0; i < 3; i++) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (data) {
        user = data;
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!user) {
      return res.status(404).json({ message: 'User record not yet created.' });
    }

    // 2. Create lawyer_profiles
    const { error: profileError } = await supabase
      .from('lawyer_profiles')
      .insert({
        user_id: user.id,
        specialization,
        city,
        fees: parseFloat(fees) || 0.00,
        bio,
        years_of_experience: parseInt(yearsOfExperience) || 0,
        education,
        bar_license_number: barLicenseNumber,
        office_address: officeAddress,
        bar_license_file: bar_license_file || null,
        profile_photo: profile_photo || null,
        is_verified: false,
        rating: 0.0
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
