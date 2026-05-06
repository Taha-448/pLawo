const User = require('../models/User');
const Appointment = require('../models/Appointment');
const LawyerProfile = require('../models/LawyerProfile');

// ─────────────────────────────────────────────────────────────────────────────
// adminDashboard
// Fetches high-level stats, pending verifications, and platform activity.
// Replaces multiple Supabase count/select calls with optimized Mongoose queries.
// ─────────────────────────────────────────────────────────────────────────────
const adminDashboard = async (req, res) => {
  try {
    const { timeRange = '6months' } = req.query;
    
    let startDate = new Date();
    if (timeRange === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (timeRange === '3months') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (timeRange === '6months') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (timeRange === 'allTime') {
      startDate = new Date(0);
    }

    const [
      totalLawyers,
      totalClients,
      totalAppointments,
      pendingLawyers,
      appointmentsForTrend,
      globalActivity
    ] = await Promise.all([
      User.countDocuments({ role: 'LAWYER' }),
      User.countDocuments({ role: 'CLIENT' }),
      Appointment.countDocuments({ date: { $gte: startDate } }),
      User.find({ role: 'LAWYER' }).populate({
        path: 'lawyer_profile',
        match: { is_verified: false }
      }).then(users => users.filter(u => u.lawyer_profile)), // Filter out those whose profile is verified
      Appointment.find({ date: { $gte: startDate } })
        .populate({
          path: 'lawyer_id',
          populate: { path: 'lawyer_profile' }
        }),
      Appointment.find()
        .populate('client_id', 'name')
        .populate('lawyer_id', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // ─────────────────────────────────────────────────────────────────────────
    // DATA PROCESSING (Trends & Distributions)
    // ─────────────────────────────────────────────────────────────────────────
    const monthlyTrendMap = {};
    let totalRevenue = 0;
    const specializationMap = {};
    
    appointmentsForTrend.forEach(apt => {
      // Monthly Trend
      const month = new Date(apt.date).toLocaleString('default', { month: 'short' });
      monthlyTrendMap[month] = (monthlyTrendMap[month] || 0) + 1;
      
      // Revenue calculation (from booked fees)
      const fee = apt.lawyer_id?.lawyer_profile?.fees || 0;
      totalRevenue += fee;

      // Specialization Distribution
      const spec = apt.lawyer_id?.lawyer_profile?.specialization || 'General';
      specializationMap[spec] = (specializationMap[spec] || 0) + 1;
    });

    const monthlyTrend = Object.keys(monthlyTrendMap).map(month => ({
      month,
      count: monthlyTrendMap[month]
    }));

    const specializationDistribution = Object.keys(specializationMap).map(name => ({
      name,
      value: specializationMap[name]
    }));

    // Format global activity for frontend
    const formattedActivity = globalActivity.map(act => ({
      id: act._id,
      date: act.date,
      time: act.time,
      status: act.status,
      legal_issue: act.legal_issue,
      client: { name: act.client_id?.name || 'Deleted User' },
      lawyer: { name: act.lawyer_id?.name || 'Deleted User' }
    }));

    res.status(200).json({ 
      message: 'Admin Dashboard Data Fetched Successfully',
      stats: { 
        totalLawyers, 
        totalClients, 
        totalAppointments,
        totalRevenue,
        monthlyTrend,
        specializationDistribution,
        globalActivity: formattedActivity
      },
      pendingLawyers
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// verifyLawyer
// Approves a lawyer's profile so they appear in search results.
// ─────────────────────────────────────────────────────────────────────────────
const verifyLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    
    const profile = await LawyerProfile.findOneAndUpdate(
      { user_id: lawyerId },
      { is_verified: true },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: 'Lawyer profile not found' });
    
    res.status(200).json({ message: 'Lawyer successfully verified' });
  } catch (error) {
    console.error('Verify lawyer error:', error);
    res.status(500).json({ message: 'Server error verifying lawyer' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getLicenseUrl
// Note: This logic depends on the storage layer. For now, it returns the 
// stored path. Proper signed URLs will be added in the storage step.
// ─────────────────────────────────────────────────────────────────────────────
const getLicenseUrl = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    // Security: Only the lawyer themselves or an admin can see the license
    if (req.user.role !== 'ADMIN' && req.user.userId !== lawyerId) {
      return res.status(403).json({ message: 'Unauthorized access to document' });
    }

    const profile = await LawyerProfile.findOne({ user_id: lawyerId }).select('bar_license_file');

    if (!profile || !profile.bar_license_file) {
      return res.status(404).json({ message: 'License file not found' });
    }

    // Placeholder for storage integration
    res.status(200).json({ url: profile.bar_license_file });
  } catch (error) {
    console.error('Error getting license URL:', error);
    res.status(500).json({ message: 'Server error getting license URL' });
  }
};

module.exports = {
  adminDashboard,
  verifyLawyer,
  getLicenseUrl
};
