const { supabase } = require('../config/supabase');

const createReview = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating) {
      return res.status(400).json({ message: 'Appointment ID and rating are required' });
    }

    // 1. Verify appointment exists and belongs to this client and is COMPLETED
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select('lawyer_id, status')
      .eq('id', appointmentId)
      .eq('client_id', clientId)
      .single();

    if (aptError || !appointment) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'You can only review completed appointments' });
    }

    // 2. Create the review
    const { data, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        appointment_id: appointmentId,
        client_id: clientId,
        lawyer_id: appointment.lawyer_id,
        rating,
        comment
      })
      .select()
      .single();

    if (reviewError) {
      if (reviewError.code === '23505') {
        return res.status(400).json({ message: 'You have already reviewed this appointment' });
      }
      throw reviewError;
    }

    res.status(201).json({ message: 'Review submitted successfully', data });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
};

const getLawyerReviews = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        client:users!reviews_client_id_fkey(name)
      `)
      .eq('lawyer_id', lawyerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

module.exports = {
  createReview,
  getLawyerReviews
};
