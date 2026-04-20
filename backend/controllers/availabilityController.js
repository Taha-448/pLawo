const { supabase } = require('../config/supabase');

const setAvailability = async (req, res) => {
  try {
    const lawyerId = req.user.userId;
    const { availability } = req.body; // Expecting array of { dayOfWeek, startTime, endTime }

    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'Availability must be an array' });
    }

    // 1. Delete existing availability for this lawyer
    const { error: deleteError } = await supabase
      .from('Availability')
      .delete()
      .eq('lawyerId', lawyerId);

    if (deleteError) throw deleteError;

    // 2. Insert new availability
    const availabilityToInsert = availability.map(slot => ({
      lawyerId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime
    }));

    const { data, error: insertError } = await supabase
      .from('Availability')
      .insert(availabilityToInsert)
      .select();

    if (insertError) throw insertError;

    res.status(200).json({ message: 'Availability updated successfully', data });
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLawyerAvailability = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const { data: availability, error } = await supabase
      .from('Availability')
      .select('*')
      .eq('lawyerId', lawyerId)
      .order('dayOfWeek', { ascending: true })
      .order('startTime', { ascending: true });

    if (error) throw error;

    res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  setAvailability,
  getLawyerAvailability
};
