const { supabase } = require('../config/supabase');
const { uploadToSupabase } = require('../utils/storageUtils');

const getLawyers = async (req, res) => {
  try {
    const { data: lawyers, error } = await supabase
      .from('users')
      .select('id, name, email, lawyer_profile:lawyer_profiles!inner(*)')
      .eq('role', 'LAWYER')
      .eq('lawyer_profiles.is_verified', true);

    if (error) throw error;
    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLawyerById = async (req, res) => {
  try {
    const { id: lawyerId } = req.params;

    const { data: lawyer, error } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        email, 
        lawyer_profile:lawyer_profiles(*)
      `)
      .eq('id', lawyerId)
      .eq('role', 'LAWYER')
      .single();

    if (error) {
      console.error('Supabase error in getLawyerById:', error);
      return res.status(404).json({ message: 'Lawyer not found' });
    }
    
    res.status(200).json(lawyer);
  } catch (error) {
    console.error('Error fetching lawyer by ID', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
      fees: parseFloat(fees) || 0.00,
      updated_at: new Date().toISOString()
    };

    if (req.files) {
      if (req.files.profilePhoto) {
        updateData.profile_photo = await uploadToSupabase(req.files.profilePhoto[0], 'profile-photos');
      }
      if (req.files.barLicenseFile) {
        updateData.bar_license_file = await uploadToSupabase(req.files.barLicenseFile[0], 'bar-licenses');
      }
    }

    const { data: updatedProfile, error } = await supabase
      .from('lawyer_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating lawyer profile', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getLawyers,
  getLawyerById,
  updateLawyerProfile
};
