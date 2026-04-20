import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Calendar, Clock, CheckCircle, XCircle, Upload, FileText, User, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { lawyerApi, appointmentApi, availabilityApi } from '../services/api';
import ManageAvailability from '../components/ManageAvailability';

export default function LawyerDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [lawyerProfile, setLawyerProfile] = useState(null);
  const [lawyerAppointments, setLawyerAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const profileData = await lawyerApi.getLawyerById(user.id);
          const formattedProfile = {
            id: profileData.id,
            fullName: profileData.name,
            specialization: profileData.lawyerProfile?.specialization || '',
            bio: profileData.lawyerProfile?.bio || '',
            consultationFee: profileData.lawyerProfile?.fees || 0,
            verified: profileData.lawyerProfile?.isVerified || false,
            rating: profileData.lawyerProfile?.rating || 4.8,
            education: profileData.lawyerProfile?.education || '',
            barLicenseNumber: profileData.lawyerProfile?.barLicenseNumber || '',
            barLicenseFile: profileData.lawyerProfile?.barLicenseFile || null,
            city: profileData.lawyerProfile?.city || '',
          };
          setLawyerProfile(formattedProfile);
        }

        const apts = await appointmentApi.getMyAppointments();
        const mappedApts = apts.map((apt) => {
          // Format time from "09:00:00" to "09:00 AM"
          const [h, m] = apt.time.split(':');
          const hr = parseInt(h);
          const period = hr >= 12 ? 'PM' : 'AM';
          const displayHr = hr > 12 ? hr - 12 : (hr === 0 ? 12 : hr);
          const formattedTime = `${displayHr.toString().padStart(2, '0')}:${m} ${period}`;

          return {
            id: apt.id.toString(),
            clientName: apt.client?.name || 'Unknown',
            legalIssue: apt.legalIssue || 'Consultation Request',
            date: new Date(apt.date).toLocaleDateString(),
            time: formattedTime,
            status: apt.status.toLowerCase(),
          };
        });
        setLawyerAppointments(mappedApts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        toast.success('License document selected');
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleUploadLicense = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('barLicenseFile', selectedFile);
    // Append other existing fields to avoid clearing them if the backend expects them
    formData.append('specialization', lawyerProfile.specialization);
    formData.append('fees', lawyerProfile.consultationFee);
    formData.append('city', lawyerProfile.city);

    try {
      await lawyerApi.updateLawyerProfile(formData);
      toast.success('License uploaded successfully and sent for verification');
      setSelectedFile(null);
      // Refresh data
      setLawyerProfile(prev => ({ ...prev, barLicenseFile: 'uploaded' }));
    } catch (err) {
      toast.error('Failed to upload license');
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      await appointmentApi.updateStatus(appointmentId, 'CONFIRMED');
      toast.success('Appointment accepted');
      setLawyerAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt));
    } catch (err) {
      toast.error('Failed to accept');
    }
  };

  const handleDecline = async (appointmentId) => {
    try {
      await appointmentApi.updateStatus(appointmentId, 'CANCELLED');
      toast.error('Appointment declined');
      setLawyerAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt));
    } catch (err) {
      toast.error('Failed to decline');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('specialization', e.target.specialization.value);
    formData.append('fees', e.target.fee.value);
    formData.append('bio', e.target.bio.value);
    formData.append('education', e.target.education.value);
    formData.append('barLicenseNumber', e.target.barLicenseNumber.value);
    formData.append('city', lawyerProfile.city); // From state since it's a Select now
    
    if (e.target.profilePhoto.files[0]) {
      formData.append('profilePhoto', e.target.profilePhoto.files[0]);
    }

    try {
      const response = await lawyerApi.updateLawyerProfile(formData);
      toast.success('Profile updated successfully');
      
      // Update local state
      const updated = response || {}; // Backend returns updated profile
      setLawyerProfile(prev => ({
        ...prev,
        specialization: updated.specialization,
        consultationFee: updated.fees,
        bio: updated.bio,
        education: updated.education,
        barLicenseNumber: updated.barLicenseNumber,
        city: updated.city
      }));
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleViewMyLicense = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const response = await fetch(`http://localhost:5000/api/admin/license/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      const { url } = await response.json();
      window.open(url, '_blank');
    } catch (err) {
      toast.error('Failed to open document');
    }
  };

  const pakistaniCities = [
    "Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta", 
    "Sialkot", "Gujranwala", "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Sukkur", 
    "Jhang", "Larkana", "Sheikhupura", "Rahim Yar Khan", "Mardan", "Kasur", "Sahiwal", 
    "Okara", "Wah Cantt", "Dera Ghazi Khan", "Mirpur Khas", "Nawabshah", "Chiniot"
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-0',
      confirmed: 'bg-blue-100 text-blue-700 border-0',
      completed: 'bg-green-100 text-green-700 border-0',
      cancelled: 'bg-red-100 text-red-700 border-0',
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#1e293b] mb-2">
            Lawyer Dashboard
          </h1>
          <p className="text-[#64748b]">Welcome back, {lawyerProfile?.fullName}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-sm mb-1">Pending</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">
                    {lawyerAppointments.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
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
                  <p className="text-[#64748b] text-sm mb-1">Confirmed</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">
                    {lawyerAppointments.filter(a => a.status === 'confirmed').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
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
                  <p className="text-[#64748b] text-sm mb-1">Completed</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">
                    {lawyerAppointments.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
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
                  <p className="text-[#64748b] text-sm mb-1">Rating</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">
                    {lawyerProfile?.rating}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#a47731]" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="bg-white border border-[#1e293b]/10">
              <TabsTrigger value="appointments">Appointment Requests</TabsTrigger>
              <TabsTrigger value="schedule">Manage Schedule</TabsTrigger>
              <TabsTrigger value="profile">Profile Management</TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card className="bg-white border-[#1e293b]/10">
                <div className="p-6 border-b border-[#1e293b]/10">
                  <h2 className="text-xl font-['Playfair_Display'] text-[#1e293b]">
                    Incoming Requests
                  </h2>
                  <p className="text-[#64748b] text-sm mt-1">
                    Review and manage appointment requests from clients
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Legal Issue</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lawyerAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.clientName}</TableCell>
                          <TableCell className="text-[#64748b]">{appointment.legalIssue}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm">{appointment.date}</span>
                              <span className="text-xs text-[#64748b]">{appointment.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {appointment.status === 'pending' && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAccept(appointment.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDecline(appointment.id)}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            )}
                            {appointment.status === 'confirmed' && (
                              <span className="text-sm text-[#64748b]">Confirmed</span>
                            )}
                            {appointment.status === 'completed' && (
                              <span className="text-sm text-[#64748b]">Completed</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {lawyerAppointments.length === 0 && (
                    <div className="p-12 text-center">
                      <Calendar className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
                        No appointment requests
                      </h3>
                      <p className="text-[#64748b]">
                        You'll see new appointment requests from clients here
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            {/* Manage Schedule Tab */}
            <TabsContent value="schedule">
              <ManageAvailability />
            </TabsContent>

            {/* Profile Management Tab */}
            <TabsContent value="profile">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* License Upload */}
                <Card className="p-6 bg-white border-[#1e293b]/10">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-[#a47731]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-1">
                        Bar Council License
                      </h3>
                      <p className="text-sm text-[#64748b]">
                        Upload your Bar Council license PDF for verification
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="license">Upload License Document</Label>
                      <div className="mt-2 flex items-center gap-3">
                        <Input
                          id="license"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="flex-1 border-[#1e293b]/20"
                        />
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-[#64748b] mt-2">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleUploadLicense}
                      disabled={!selectedFile}
                      className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload for Verification
                    </Button>

                    {lawyerProfile?.verified ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">License Verified</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Your Bar Council license has been verified by pLawo
                        </p>
                      </div>
                    ) : lawyerProfile?.barLicenseFile ? (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-medium">Verification Pending</span>
                        </div>
                        <p className="text-sm text-blue-600 mt-1 flex items-center justify-between">
                          Your document is being reviewed by our team
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={handleViewMyLicense}
                            className="text-blue-700 p-0 h-auto font-semibold"
                          >
                            <Eye className="w-3 h-3 mr-1" /> View Submitted
                          </Button>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-medium">License Required</span>
                        </div>
                        <p className="text-sm text-yellow-600 mt-1">
                          Please upload your Bar Council license to be listed for clients
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Profile Info */}
                <Card className="p-6 bg-white border-[#1e293b]/10">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-[#a47731]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1e293b] mb-1">
                        Profile Information
                      </h3>
                      <p className="text-sm text-[#64748b]">
                        Update your professional information
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          name="specialization"
                          defaultValue={lawyerProfile?.specialization}
                          className="mt-2 border-[#1e293b]/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select 
                          value={lawyerProfile?.city} 
                          onValueChange={(val) => setLawyerProfile(prev => ({ ...prev, city: val }))}
                        >
                          <SelectTrigger className="mt-2 border-[#1e293b]/20">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {pakistaniCities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fee">Consultation Fee (PKR/hour)</Label>
                        <Input
                          id="fee"
                          name="fee"
                          type="number"
                          defaultValue={lawyerProfile?.consultationFee}
                          className="mt-2 border-[#1e293b]/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="barLicenseNumber">Bar License Number</Label>
                        <Input
                          id="barLicenseNumber"
                          name="barLicenseNumber"
                          defaultValue={lawyerProfile?.barLicenseNumber}
                          className="mt-2 border-[#1e293b]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="profilePhoto">Update Profile Photo</Label>
                      <Input
                        id="profilePhoto"
                        name="profilePhoto"
                        type="file"
                        accept="image/*"
                        className="mt-2 border-[#1e293b]/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="education">Education</Label>
                      <Input
                        id="education"
                        name="education"
                        defaultValue={lawyerProfile?.education}
                        className="mt-2 border-[#1e293b]/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={lawyerProfile?.bio}
                        className="mt-2 min-h-[120px] border-[#1e293b]/20"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white">
                      Save Changes
                    </Button>
                  </form>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
