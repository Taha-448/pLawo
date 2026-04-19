const { supabase } = require('../config/supabase');

const createAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time } = req.body;
    const clientId = req.user.userId;

    const { data: appointment, error } = await supabase
      .from('Appointment')
      .insert({
        lawyerId: lawyerId,
        date: date, // date is already in YYYY-MM-DD or ISO format from frontend
        time,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment', error);
    res.status(500).json({ message: 'Server error creating appointment' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let query = supabase.from('Appointment').select(`
      *,
      lawyer:User!Appointment_lawyerId_fkey(
        name,
        lawyerProfile:LawyerProfile(*)
      ),
      client:User!Appointment_clientId_fkey(
        name,
        email
      )
    `);

    if (role === 'CLIENT') {
      query = query.eq('clientId', userId);
    } else if (role === 'LAWYER') {
      query = query.eq('lawyerId', userId);
    } else {
      return res.status(403).json({ message: 'Not authorized for appointments' });
    }

    const { data: appointments, error } = await query.order('date', { ascending: true });

    if (error) throw error;
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const lawyerId = req.user.userId;

    // Verify appointment belongs to this lawyer
    const { data: appointment, error: findError } = await supabase
      .from('Appointment')
      .select('id')
      .eq('id', id)
      .eq('lawyerId', lawyerId)
      .single();

    if (findError || !appointment) {
      return res.status(404).json({ message: 'Appointment not found or not authorized' });
    }

    const { data: updated, error: updateError } = await supabase
      .from('Appointment')
      .update({ status })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating appointment', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus
};
