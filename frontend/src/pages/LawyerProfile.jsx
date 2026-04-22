import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { MapPin, Briefcase, Star, CheckCircle2, GraduationCap, FileText, Clock, MessageSquare, Banknote } from 'lucide-react';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { lawyerApi, appointmentApi, availabilityApi, reviewApi } from '../services/api';
import { getDirectImageUrl } from '../utils/imageUtils';


export default function LawyerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const data = await lawyerApi.getLawyerById(id);
        const formatted = {
          id: data.id,
          fullName: data.name,
          profilePhoto: getDirectImageUrl(data.lawyer_profile?.profile_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a'),

          specialization: data.lawyer_profile?.specialization || 'General Practice',
          city: data.lawyer_profile?.city || 'Unknown',
          bio: data.lawyer_profile?.bio || '',
          consultationFee: data.lawyer_profile?.fees || 0,
          verified: data.lawyer_profile?.is_verified || false,
          rating: data.lawyer_profile?.rating || 4.8,
          yearsOfExperience: data.lawyer_profile?.years_of_experience || 5,
          education: data.lawyer_profile?.education || "Not specified",
          barLicenseNumber: data.lawyer_profile?.bar_license_number || "Not specified",
          officeAddress: data.lawyer_profile?.office_address || "Not specified"
        };
        setLawyer(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchLawyer();
      fetchAvailability();
      fetchReviews();
      fetchBookedSlots();
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const data = await reviewApi.getLawyerReviews(id);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const data = await appointmentApi.getBookedSlots(id);
      setBookedSlots(data);
    } catch (err) {
      console.error('Error fetching booked slots:', err);
    }
  };

  const fetchAvailability = async () => {
    try {
      const data = await availabilityApi.getLawyerAvailability(id);
      setAvailability(data);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

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

  const getAvailableSlotsForDate = (date) => {
    if (!date) return [];
    
    // We need the day of the week. 
    // Manual extraction avoids the UTC shift bug where 00:00 local becomes 19:00 previous day UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;
    
    const dayOfWeek = new Date(isoDate).getUTCDay();
    
    const daySchedule = availability.filter(a => a.day_of_week === dayOfWeek);
    
    const slots = [];
    daySchedule.forEach(block => {
      // Create 1-hour slots between startTime and endTime
      let start = parseInt(block.start_time.split(':')[0]);
      let end = parseInt(block.end_time.split(':')[0]);
      
      for (let hour = start; hour < end; hour++) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        slots.push(`${displayHour.toString().padStart(2, '0')}:00 ${period}`);
      }
    });
    
    // If selecting TODAY, filter out slots that have already passed
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    let filteredSlots = slots;
    if (isToday) {
      filteredSlots = slots.filter(slot => {
        const [time, period] = slot.split(' ');
        let [hours] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        // Compare with current hour
        return hours > now.getHours();
      });
    }

    // FILTER OUT ALREADY BOOKED SLOTS
    const dateStr = `${year}-${month}-${day}`;
    filteredSlots = filteredSlots.filter(slot => {
      // Convert "02:00 PM" to "14:00:00" for comparison
      const [timePart, period] = slot.split(' ');
      let [h, m] = timePart.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      const time24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;

      const isBooked = bookedSlots.some(b => 
        b.date === dateStr && b.time === time24
      );
      return !isBooked;
    });
    
    // Sort slots chronologically
    return filteredSlots.sort((a, b) => {
      const timeToMinutes = (t) => {
        const [time, period] = t.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return timeToMinutes(a) - timeToMinutes(b);
    });
  };

  const availableTimeSlots = getAvailableSlotsForDate(selectedDate);

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
      // Convert "09:00 AM" to "09:00:00" for the backend
      const [timePart, period] = selectedTime.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      await appointmentApi.create({ 
        lawyerId: lawyer.id, 
        date: dateString, 
        time: time24,
        legalIssue: description || 'Consultation Request'
      });
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
                      <Star className={`w-5 h-5 ${parseFloat(lawyer.rating) > 0 || reviews.length > 0 ? 'fill-[#a47731] text-[#a47731]' : 'text-[#cbd5e1]'}`} />
                      <span className="font-semibold text-[#1e293b]">
                        {parseFloat(lawyer.rating) > 0 ? lawyer.rating : (reviews.length > 0 ? lawyer.rating : 'New')}
                      </span>
                      <span className="text-[#64748b] text-sm ml-1">({reviews.length} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-3xl font-semibold text-[#1e293b]">
                      <Banknote className="w-8 h-8 text-[#a47731]" />
                      <span>PKR {lawyer.consultationFee.toLocaleString()}</span>
                    </div>
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

                <Button 
                  onClick={() => {
                    const userStr = localStorage.getItem('user');
                    if (!userStr) {
                      toast.error('Please sign in as a client to book an appointment');
                      navigate('/signin');
                      return;
                    }
                    const user = JSON.parse(userStr);
                    if (user.role !== 'CLIENT') {
                      toast.error('Only client accounts can book consultations');
                      return;
                    }
                    setIsBookingOpen(true);
                  }}
                  className="bg-[#a47731] hover:bg-[#8d6629] text-white w-full md:w-auto px-8"
                >
                  Book Consultation
                </Button>

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
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
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
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

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#1e293b]">
                          Briefly describe your legal issue
                        </label>
                        <Textarea 
                          placeholder="e.g., I need help with a property dispute in Lahore..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[100px] border-[#1e293b]/10 focus:border-[#a47731]"
                        />
                      </div>

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
          <div className="grid md:grid-cols-3 gap-6">
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

            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#a47731]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e293b] mb-2">Office Address</h3>
                  <p className="text-[#64748b] text-sm">{lawyer.officeAddress}</p>
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
                <h3 className="font-semibold text-[#1e293b] mb-2">Office Hours</h3>
                {availability.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                      const daySlots = availability.filter(a => a.day_of_week === idx);
                      if (daySlots.length === 0) return null;
                      return (
                        <div key={day} className="text-sm">
                          <span className="font-medium text-[#1e293b]">{day}:</span>
                          <div className="text-[#64748b]">
                            {daySlots.map((s, i) => (
                              <div key={i}>{s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}</div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[#64748b] text-sm italic">
                    Schedule not yet configured by the lawyer.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Reviews Section */}
          <Card className="p-8 bg-white border-[#1e293b]/10 mt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-[#a47731]" />
              </div>
              <div>
                <h2 className="text-2xl font-['Playfair_Display'] text-[#1e293b]">
                  Client Reviews
                </h2>
                <p className="text-sm text-[#64748b]">Real feedback from pLawo clients</p>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="pb-6 border-b border-[#1e293b]/5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-[#1e293b]">{rev.client?.name}</h4>
                      <span className="text-xs text-[#64748b]">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? 'fill-[#a47731] text-[#a47731]' : 'text-[#cbd5e1]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[#64748b] text-sm leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#64748b] text-sm italic">No reviews yet for this lawyer.</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
