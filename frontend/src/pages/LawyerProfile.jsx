import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { MapPin, Briefcase, Star, CheckCircle2, GraduationCap, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { lawyerApi, appointmentApi } from '../services/api';
import { getDirectImageUrl } from '../utils/imageUtils';


export default function LawyerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const data = await lawyerApi.getLawyerById(id);
        const formatted = {
          id: data.id,
          fullName: data.name,
          profilePhoto: getDirectImageUrl(data.lawyerProfile?.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a'),

          specialization: data.lawyerProfile?.specialization || 'General Practice',
          city: data.lawyerProfile?.city || 'Unknown',
          bio: data.lawyerProfile?.bio || '',
          consultationFee: data.lawyerProfile?.fees || 0,
          verified: data.lawyerProfile?.isVerified || false,
          rating: data.lawyerProfile?.rating || 4.8,
          yearsOfExperience: data.lawyerProfile?.yearsOfExperience || 5,
          education: data.lawyerProfile?.education || "Not specified",
          barLicenseNumber: data.lawyerProfile?.barLicenseNumber || "Not specified"
        };
        setLawyer(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchLawyer();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD]">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-xl text-[#64748b]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-[#FDFDFD]">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-['Playfair_Display'] text-[#1e293b]">Lawyer not found</h1>
          <Button onClick={() => navigate('/search')} className="mt-6 bg-[#a47731] hover:bg-[#8d6629]">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  const availableTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleBookAppointment = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please sign in to book an appointment');
      navigate('/signin');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      await appointmentApi.create({ lawyerId: lawyer.id, date: selectedDate, time: selectedTime });
      toast.success('Appointment booked successfully!');
      setIsBookingOpen(false);
      
      const user = JSON.parse(userStr);
      if (user.role === 'CLIENT') {
        navigate('/client-dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={() => navigate('/search')}
          variant="outline"
          className="mb-6 border-[#1e293b]/20"
        >
          ← Back to Results
        </Button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 bg-white border-[#1e293b]/10 mb-6">
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={lawyer.profilePhoto}
                alt={lawyer.fullName}
                className="w-40 h-40 rounded-2xl object-cover border-4 border-[#a47731]/20"
              />
              
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-['Playfair_Display'] text-[#1e293b]">
                        {lawyer.fullName}
                      </h1>
                      {lawyer.verified && (
                        <Badge className="bg-[#a47731] text-white border-0">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xl text-[#a47731] font-medium mb-3">{lawyer.specialization}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-5 h-5 fill-[#a47731] text-[#a47731]" />
                      <span className="font-semibold text-[#1e293b]">{lawyer.rating}</span>
                      <span className="text-[#64748b] text-sm ml-1">(48 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-3xl font-semibold text-[#1e293b]">
                      PKR {lawyer.consultationFee.toLocaleString()}
                    </p>
                    <p className="text-[#64748b]">per hour</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[#64748b]">
                    <MapPin className="w-5 h-5" />
                    <span>{lawyer.city}, Pakistan</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#64748b]">
                    <Briefcase className="w-5 h-5" />
                    <span>{lawyer.yearsOfExperience} years of experience</span>
                  </div>
                </div>

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#a47731] hover:bg-[#8d6629] text-white w-full md:w-auto px-8">
                      Book Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-['Playfair_Display'] text-2xl">
                        Schedule Appointment
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1e293b] mb-3">
                          Select Date
                        </label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border border-[#1e293b]/10"
                        />
                      </div>
                      
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium text-[#1e293b] mb-3">
                            Available Time Slots
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {availableTimeSlots.map((time) => (
                              <Button
                                key={time}
                                variant={selectedTime === time ? 'default' : 'outline'}
                                onClick={() => setSelectedTime(time)}
                                className={
                                  selectedTime === time
                                    ? 'bg-[#a47731] hover:bg-[#8d6629] text-white'
                                    : 'border-[#1e293b]/20'
                                }
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleBookAppointment}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>

          {/* Bio Section */}
          <Card className="p-8 bg-white border-[#1e293b]/10 mb-6">
            <h2 className="text-2xl font-['Playfair_Display'] text-[#1e293b] mb-4">
              About
            </h2>
            <p className="text-[#64748b] leading-relaxed">{lawyer.bio}</p>
          </Card>

          {/* Credentials */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#a47731]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e293b] mb-2">Education</h3>
                  <p className="text-[#64748b] text-sm">{lawyer.education}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#a47731]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e293b] mb-2">Bar License</h3>
                  <p className="text-[#64748b] text-sm">{lawyer.barLicenseNumber}</p>
                  <Badge className="mt-2 bg-green-100 text-green-700 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified by pLawo
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Availability */}
          <Card className="p-6 bg-white border-[#1e293b]/10 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#a47731]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1e293b] mb-2">Availability</h3>
                <p className="text-[#64748b] text-sm">
                  Monday - Friday: 9:00 AM - 5:00 PM | Saturday: 10:00 AM - 2:00 PM
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
