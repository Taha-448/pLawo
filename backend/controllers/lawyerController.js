const { supabase } = require('../config/supabase');

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
    const lawyerId = id;

    const { data: lawyer, error } = await supabase
      .from('User')
      .select(`
        id, 
        name, 
        email, 
        lawyerProfile:LawyerProfile(*),
        reviewsAsLawyer:Review(
          *,
          client:User(name)
        )
      `)
      .eq('id', lawyerId)
      .eq('role', 'LAWYER')
      .single();

    if (error || !lawyer) {
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
    const { specialization, city, bio, fees } = req.body;
    const userId = req.user.userId;

    const { data: updatedProfile, error } = await supabase
      .from('LawyerProfile')
      .update({
        specialization,
        city,
        bio,
        fees: parseFloat(fees) || 0.00
      })
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
