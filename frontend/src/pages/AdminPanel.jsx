import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Users, Calendar, UserCheck, AlertCircle, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';
import { adminApi } from '../services/api';

export default function AdminPanel() {
  const [stats, setStats] = useState({ 
    totalLawyers: 0, 
    totalClients: 0, 
    totalAppointments: 0,
    monthlyTrend: [],
    specializationDistribution: []
  });
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [timeRange, setTimeRange] = useState('6months');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await adminApi.getDashboard(timeRange);
        setStats(data.stats);
        
        const mappedPending = data.pendingLawyers.map((lawyer) => ({
          id: lawyer.id,
          fullName: lawyer.name,
          email: lawyer.email,
          specialization: lawyer.lawyerProfile?.specialization || 'General',
          city: lawyer.lawyerProfile?.city || 'Unknown',
          barLicenseNumber: lawyer.lawyerProfile?.barLicenseNumber || 'N/A',
          submittedDate: new Date(lawyer.createdAt).toLocaleDateString()
        }));
        setPendingLawyers(mappedPending);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [timeRange]);

  const handleApprove = async (lawyerId, name) => {
    try {
      await adminApi.verifyLawyer(lawyerId);
      toast.success(`${name} has been approved and verified`);
      setPendingLawyers(prev => prev.filter(l => l.id !== lawyerId));
    } catch (err) {
      toast.error('Failed to verify lawyer');
    }
  };

  const handleViewDocument = async (lawyerId) => {
    try {
      toast.info('Generating secure link...');
      const { url } = await adminApi.getLicenseUrl(lawyerId);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      toast.error('Failed to open document. Ensure it was uploaded correctly.');
    }
  };

  const handleReject = (lawyerId, name) => {
    toast.error(`${name}'s application has been rejected`);
    setPendingLawyers(prev => prev.filter(l => l.id !== lawyerId));
  };

  const COLORS = ['#a47731', '#1e293b', '#64748b', '#cbd5e1'];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#1e293b] mb-2">
                Admin Command Center
              </h1>
              <p className="text-[#64748b]">Platform overview and verification management</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#1e293b]/10">
              <Clock className="w-4 h-4 text-[#a47731]" />
              <span className="text-sm font-medium text-[#1e293b]">Time Range:</span>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] h-9 border-0 bg-transparent focus:ring-0">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="allTime">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#a47731] to-[#8d6629] text-white border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Total Appointments</p>
                  <p className="text-4xl font-semibold">{stats.totalAppointments}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>In selected period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-sm mb-1">Active Clients</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">
                    {stats.totalClients}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-sm mb-1">Active Lawyers</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">
                    {stats.totalLawyers}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-sm mb-1">Pending Verifications</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">
                    {pendingLawyers.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs defaultValue="verification" className="space-y-6">
            <TabsList className="bg-white border border-[#1e293b]/10">
              <TabsTrigger value="verification">Verification Queue</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Verification Queue */}
            <TabsContent value="verification">
              <Card className="bg-white border-[#1e293b]/10">
                <div className="p-6 border-b border-[#1e293b]/10">
                  <h2 className="text-xl font-['Playfair_Display'] text-[#1e293b]">
                    Lawyer Verification Queue
                  </h2>
                  <p className="text-[#64748b] text-sm mt-1">
                    Review and verify new lawyer applications
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lawyer Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Bar License</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id}>
                          <TableCell className="font-medium">{lawyer.fullName}</TableCell>
                          <TableCell className="text-[#64748b]">{lawyer.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-[#a47731] text-[#a47731]">
                              {lawyer.specialization}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#64748b]">{lawyer.city}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium">{lawyer.barLicenseNumber}</span>
                              <Button
                                variant="link"
                                className="p-0 h-auto text-[#a47731] hover:text-[#8d6629] text-xs justify-start"
                                onClick={() => handleViewDocument(lawyer.id)}
                              >
                                View Document →
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#64748b] text-sm">
                            {lawyer.submittedDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(lawyer.id, lawyer.fullName)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(lawyer.id, lawyer.fullName)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {pendingLawyers.length === 0 && (
                    <div className="p-12 text-center">
                      <UserCheck className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
                        No pending verifications
                      </h3>
                      <p className="text-[#64748b]">
                        All lawyer applications have been processed
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Monthly Appointments Chart */}
              <Card className="p-6 bg-white border-[#1e293b]/10">
                <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b] mb-6">
                  {timeRange === 'allTime' ? 'All-Time Appointments Trend' : 'Appointments Trend'}
                </h3>
                {stats.monthlyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="count" fill="#a47731" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-[#64748b] bg-[#f8f8f8] rounded-xl border-2 border-dashed border-[#1e293b]/10">
                    <Calendar className="w-12 h-12 mb-3 opacity-20" />
                    <p>No appointment data found for this period</p>
                  </div>
                )}
              </Card>

              {/* Specialization Distribution */}
              <Card className="p-6 bg-white border-[#1e293b]/10">
                <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b] mb-6">
                  Cases by Specialization
                </h3>
                {stats.specializationDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.specializationDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.specializationDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-[#64748b] bg-[#f8f8f8] rounded-xl border-2 border-dashed border-[#1e293b]/10">
                    <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                    <p>No cases recorded for this period</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
