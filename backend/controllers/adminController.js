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
      { data: appointments },
      { data: globalActivity }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'LAWYER'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'CLIENT'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('date', isoStartDate),
      supabase.from('users').select('*, lawyer_profile:lawyer_profiles!inner(*)').eq('role', 'LAWYER').eq('lawyer_profiles.is_verified', false),
      supabase.from('appointments').select(`
        date,
        lawyer:users!appointments_lawyer_id_fkey(
          lawyer_profile:lawyer_profiles(specialization, fees)
        )
      `).gte('date', isoStartDate),
      supabase.from('appointments').select(`
        id,
        date,
        time,
        status,
        legal_issue,
        client:users!appointments_client_id_fkey(name),
        lawyer:users!appointments_lawyer_id_fkey(name)
      `).order('created_at', { ascending: false }).limit(10)
    ]);

    // Monthly Trend
    const monthlyTrendMap = {};
    let totalRevenue = 0;
    
    appointments?.forEach(apt => {
      const month = new Date(apt.date).toLocaleString('default', { month: 'short' });
      monthlyTrendMap[month] = (monthlyTrendMap[month] || 0) + 1;
      
      // Calculate revenue from booked fees
      totalRevenue += (apt.lawyer?.lawyer_profile?.fees || 0);
    });

    const monthlyTrend = Object.keys(monthlyTrendMap).map(month => ({
      month,
      count: monthlyTrendMap[month]
    }));

    // Specialization Distribution
    const specializationMap = {};
    appointments?.forEach(apt => {
      const spec = apt.lawyer?.lawyer_profile?.specialization || 'General';
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
        totalRevenue,
        monthlyTrend,
        specializationDistribution,
        globalActivity: globalActivity || []
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
      .from('lawyer_profiles')
      .select('id')
      .eq('user_id', lawyerId)
      .single();

    if (findError || !profile) return res.status(404).json({ message: 'Lawyer profile not found' });

    const { error: updateError } = await supabase
      .from('lawyer_profiles')
      .update({ is_verified: true, updated_at: new Date().toISOString() })
      .eq('user_id', lawyerId);

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

    // Security: Only the lawyer themselves or an admin can see the license
    if (req.user.role !== 'ADMIN' && req.user.userId !== lawyerId) {
      return res.status(403).json({ message: 'Unauthorized access to document' });
    }

    const { data: profile, error } = await supabase
      .from('lawyer_profiles')
      .select('bar_license_file')
      .eq('user_id', lawyerId)
      .single();

    if (error || !profile?.bar_license_file) {
      return res.status(404).json({ message: 'License file not found' });
    }

    // Generate signed URL (expires in 1 hour as per storageUtils)
    const signedUrl = await getSignedUrl('bar-licenses', profile.bar_license_file);
    
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
