const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminDashboard = async (req, res) => {
  try {
    const { timeRange = '6months' } = req.query;
    
    // Calculate start date based on timeRange
    let startDate = new Date();
    if (timeRange === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (timeRange === '3months') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (timeRange === '6months') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (timeRange === 'allTime') {
      startDate = new Date(0); // Epoch start
    }

    const totalLawyers = await prisma.user.count({ where: { role: 'LAWYER' } });
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });
    
    const totalAppointments = await prisma.appointment.count({
      where: {
        date: { gte: startDate }
      }
    });

    const pendingLawyers = await prisma.user.findMany({
      where: {
        role: 'LAWYER',
        lawyerProfile: { isVerified: false }
      },
      include: { lawyerProfile: true }
    });

    // Monthly Apppointments Trend
    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: startDate } },
      select: { date: true }
    });

    const monthlyTrendMap = {};
    appointments.forEach(apt => {
      const month = apt.date.toLocaleString('default', { month: 'short' });
      monthlyTrendMap[month] = (monthlyTrendMap[month] || 0) + 1;
    });

    const monthlyTrend = Object.keys(monthlyTrendMap).map(month => ({
      month,
      count: monthlyTrendMap[month]
    }));

    // Specialization Distribution (based on appointments)
    const appointmentsWithSpecialization = await prisma.appointment.findMany({
      where: { date: { gte: startDate } },
      include: {
        lawyer: {
          include: { lawyerProfile: true }
        }
      }
    });

    const specializationMap = {};
    appointmentsWithSpecialization.forEach(apt => {
      const spec = apt.lawyer?.lawyerProfile?.specialization || 'General';
      specializationMap[spec] = (specializationMap[spec] || 0) + 1;
    });

    const specializationDistribution = Object.keys(specializationMap).map(name => ({
      name,
      value: specializationMap[name]
    }));

    res.status(200).json({ 
      message: 'Admin Dashboard Data Fetched Successfully',
      stats: { 
        totalLawyers, 
        totalClients, 
        totalAppointments,
        monthlyTrend,
        specializationDistribution
      },
      pendingLawyers
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
};

const verifyLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    
    const profile = await prisma.lawyerProfile.findUnique({ where: { userId: parseInt(lawyerId) } });
    if (!profile) return res.status(404).json({ message: 'Lawyer profile not found' });

    await prisma.lawyerProfile.update({
      where: { userId: parseInt(lawyerId) },
      data: { isVerified: true }
    });
    
    res.status(200).json({ message: 'Lawyer successfully verified' });
  } catch (error) {
    console.error('Verify lawyer error:', error);
    res.status(500).json({ message: 'Server error verifying lawyer' });
  }
};

module.exports = {
  adminDashboard,
  verifyLawyer
};
