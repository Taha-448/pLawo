const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time } = req.body;
    const clientId = req.user.userId;

    // Optional validation logic here

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        lawyerId: parseInt(lawyerId),
        date: new Date(date),
        time,
        status: 'PENDING'
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment', error);
    res.status(500).json({ message: 'Server error creating appointment' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let appointments = [];
    if (role === 'CLIENT') {
      appointments = await prisma.appointment.findMany({
        where: { clientId: userId },
        include: { lawyer: { select: { name: true, lawyerProfile: true } } },
        orderBy: { date: 'asc' }
      });
    } else if (role === 'LAWYER') {
      appointments = await prisma.appointment.findMany({
        where: { lawyerId: userId },
        include: { client: { select: { name: true, email: true } } },
        orderBy: { date: 'asc' }
      });
    } else {
      return res.status(403).json({ message: 'Not authorized for appointments' });
    }
    
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
    const appointment = await prisma.appointment.findFirst({
      where: { id: parseInt(id), lawyerId }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or not authorized' });
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status }
    });

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
