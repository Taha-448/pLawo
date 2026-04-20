const { supabase } = require('../config/supabase');
const { uploadToSupabase } = require('../utils/storageUtils');

const getLawyers = async (req, res) => {
  try {
    const { data: lawyers, error } = await supabase
      .from('User')
      .select('id, name, email, lawyerProfile:LawyerProfile!inner(*)')
      .eq('role', 'LAWYER')
      .eq('LawyerProfile.isVerified', true);

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
      .from('User')
      .select(`
        id, 
        name, 
        email, 
        lawyerProfile:LawyerProfile(*)
      `)
      .eq('id', lawyerId)
      .eq('role', 'LAWYER')
      .single();

    if (error) {
      console.error('Supabase error in getLawyerById:', error);
      return res.status(404).json({ message: 'Lawyer not found', details: error.message });
    }
    
    if (!lawyer) {
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
    const { specialization, city, bio, fees, education, barLicenseNumber } = req.body;
    const userId = req.user.userId;
    
    let updateData = {
      specialization,
      city,
      bio,
      education,
      barLicenseNumber,
      fees: parseFloat(fees) || 0.00
    };

    if (req.files) {
      if (req.files.profilePhoto) {
        updateData.profilePhoto = await uploadToSupabase(req.files.profilePhoto[0], 'profile-photos');
      }
      if (req.files.barLicenseFile) {
        updateData.barLicenseFile = await uploadToSupabase(req.files.barLicenseFile[0], 'bar-licenses');
      }
    }

    const { data: updatedProfile, error } = await supabase
      .from('LawyerProfile')
      .update(updateData)
      .eq('userId', userId)
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
