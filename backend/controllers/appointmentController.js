const { supabase } = require('../config/supabase');

const createAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time } = req.body;
    const { userId: clientId, role } = req.user;
 
    if (role !== 'CLIENT') {
      return res.status(403).json({ message: 'Only clients can book appointments' });
    }

    if (!lawyerId || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields (lawyerId, date, time)' });
    }

    // 1. Validate Lawyer Availability
    const dayOfWeek = new Date(date).getUTCDay(); 
    
    const { data: availability, error: availError } = await supabase
      .from('availability')
      .select('*')
      .eq('lawyer_id', lawyerId)
      .eq('day_of_week', dayOfWeek)
      .lte('start_time', time)
      .gte('end_time', time);

    if (availError) throw availError;

    if (!availability || availability.length === 0) {
      return res.status(400).json({ message: 'Lawyer is not available at this day or time' });
    }

    // 2. Check for Conflicts (Model 1: Strict Reservation)
    const { data: conflict, error: conflictError } = await supabase
      .from('appointments')
      .select('id')
      .eq('lawyer_id', lawyerId)
      .eq('date', date)
      .eq('time', time)
      .in('status', ['PENDING', 'CONFIRMED', 'COMPLETED'])
      .maybeSingle();

    if (conflictError) throw conflictError;

    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already reserved or booked. Please choose another.' });
    }

    // 3. Create Appointment
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert({
        client_id: clientId,
        lawyer_id: lawyerId,
        date: date,
        time,
        legal_issue: req.body.legalIssue || 'Consultation Request',
        status: 'PENDING'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment', error);
    res.status(500).json({ message: 'Server error creating appointment' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const selectQuery = `
      *,
      lawyer:users!lawyer_id(
        name,
        lawyer_profile:lawyer_profiles(*)
      ),
      client:users!client_id(
        name,
        email
      ),
      reviews:reviews(id, rating, comment)
    `;

    let query = supabase.from('appointments').select(selectQuery);

    if (role === 'CLIENT') {
      query = query.eq('client_id', userId);
    } else if (role === 'LAWYER') {
      query = query.eq('lawyer_id', userId);
    } else {
      return res.status(403).json({ message: 'Not authorized for appointments' });
    }

    const { data: appointments, error } = await query.order('date', { ascending: true });

    if (error) {
      console.error('Supabase Query Error:', error);
      throw error;
    }

    // MANUAL JOIN: Fetch all reviews for these appointments to ensure visibility
    const appointmentIds = appointments.map(a => a.id);
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .in('appointment_id', appointmentIds);

    const appointmentsWithReviews = appointments.map(apt => ({
      ...apt,
      reviews: reviews?.filter(r => r.appointment_id === apt.id) || []
    }));

    res.status(200).json(appointmentsWithReviews);
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
      .from('appointments')
      .select('id')
      .eq('id', id)
      .eq('lawyer_id', lawyerId)
      .single();

    if (findError || !appointment) {
      return res.status(404).json({ message: 'Appointment not found or not authorized' });
    }

    const { data: updated, error: updateError } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating appointment', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLawyerBookedSlots = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const { data, error } = await supabase
      .from('appointments')
      .select('date, time')
      .eq('lawyer_id', lawyerId)
      .in('status', ['PENDING', 'CONFIRMED', 'COMPLETED']);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching booked slots' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  getLawyerBookedSlots
};
