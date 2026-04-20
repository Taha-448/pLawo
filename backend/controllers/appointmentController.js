const { supabase } = require('../config/supabase');

const createAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time } = req.body;
    const clientId = req.user.userId;

    if (!lawyerId || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields (lawyerId, date, time)' });
    }

    // 1. Validate Lawyer Availability
    // Use getUTCDay() because 'YYYY-MM-DD' strings are parsed as UTC midnight
    const dayOfWeek = new Date(date).getUTCDay(); 
    
    const { data: availability, error: availError } = await supabase
      .from('Availability')
      .select('*')
      .eq('lawyerId', lawyerId)
      .eq('dayOfWeek', dayOfWeek)
      .lte('startTime', time)
      .gte('endTime', time);

    if (availError) throw availError;

    if (!availability || availability.length === 0) {
      return res.status(400).json({ message: 'Lawyer is not available at this day or time' });
    }

    // 2. Check for Conflicts (Existing Appointments)
    const { data: conflict, error: conflictError } = await supabase
      .from('Appointment')
      .select('id')
      .eq('lawyerId', lawyerId)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (conflictError) throw conflictError;
    if (conflict) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // 3. Create Appointment
    const { data: appointment, error: insertError } = await supabase
      .from('Appointment')
      .insert({
        clientId: clientId,
        lawyerId: lawyerId,
        date: date,
        time,
        legalIssue: req.body.legalIssue || 'Consultation Request',
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
