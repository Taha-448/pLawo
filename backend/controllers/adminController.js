const { supabase } = require('../config/supabase');

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

    const isoStartDate = startDate.toISOString();

    const [
      { count: totalLawyers },
      { count: totalClients },
      { count: totalAppointments },
      { data: pendingLawyers },
      { data: appointments }
    ] = await Promise.all([
      supabase.from('User').select('*', { count: 'exact', head: true }).eq('role', 'LAWYER'),
      supabase.from('User').select('*', { count: 'exact', head: true }).eq('role', 'CLIENT'),
      supabase.from('Appointment').select('*', { count: 'exact', head: true }).gte('date', isoStartDate),
      supabase.from('User').select('*, lawyerProfile:LawyerProfile!inner(*)').eq('role', 'LAWYER').eq('LawyerProfile.isVerified', false),
      supabase.from('Appointment').select(`
        date,
        lawyer:User!Appointment_lawyerId_fkey(
          lawyerProfile:LawyerProfile(specialization)
        )
      `).gte('date', isoStartDate)
    ]);

    // Monthly Trend
    const monthlyTrendMap = {};
    appointments?.forEach(apt => {
      const month = new Date(apt.date).toLocaleString('default', { month: 'short' });
      monthlyTrendMap[month] = (monthlyTrendMap[month] || 0) + 1;
    });

    const monthlyTrend = Object.keys(monthlyTrendMap).map(month => ({
      month,
      count: monthlyTrendMap[month]
    }));

    // Specialization Distribution
    const specializationMap = {};
    appointments?.forEach(apt => {
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
    
    const { data: profile, error: findError } = await supabase
      .from('LawyerProfile')
      .select('id')
      .eq('userId', lawyerId)
      .single();

    if (findError || !profile) return res.status(404).json({ message: 'Lawyer profile not found' });

    const { error: updateError } = await supabase
      .from('LawyerProfile')
      .update({ isVerified: true })
      .eq('userId', lawyerId);

    if (updateError) throw updateError;
    
    res.status(200).json({ message: 'Lawyer successfully verified' });
  } catch (error) {
    console.error('Verify lawyer error:', error);
    res.status(500).json({ message: 'Server error verifying lawyer' });
  }
};

const getLicenseUrl = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const { getSignedUrl } = require('../utils/storageUtils');

    const { data: profile, error } = await supabase
      .from('LawyerProfile')
      .select('barLicenseFile')
      .eq('userId', lawyerId)
      .single();

    if (error || !profile?.barLicenseFile) {
      return res.status(404).json({ message: 'License file not found' });
    }

    // Generate signed URL (expires in 5 minutes)
    const signedUrl = await getSignedUrl('bar-licenses', profile.barLicenseFile);
    
    res.status(200).json({ url: signedUrl });
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
