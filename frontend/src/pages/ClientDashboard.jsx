import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Calendar, Clock, MapPin, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { appointmentApi, reviewApi } from '../services/api';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
    
    appointmentApi.getMyAppointments()
      .then(data => {
        const mapped = data.map((apt) => {
          // Format time from "09:00:00" to "09:00 AM"
          const [h, m] = apt.time.split(':');
          const hr = parseInt(h);
          const period = hr >= 12 ? 'PM' : 'AM';
          const displayHr = hr > 12 ? hr - 12 : (hr === 0 ? 12 : hr);
          const formattedTime = `${displayHr.toString().padStart(2, '0')}:${m} ${period}`;
          
          return {
            id: apt.id.toString(),
            lawyerName: apt.lawyer?.name || 'Unknown',
            legalIssue: apt.legal_issue || 'Consultation Request',
            date: new Date(apt.date).toLocaleDateString(),
            time: formattedTime,
            status: apt.status.toLowerCase(),
            review: apt.review && apt.review.length > 0 ? apt.review[0] : (apt.reviews && apt.reviews.length > 0 ? apt.reviews[0] : null)
          };
        });
        setUserAppointments(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      await reviewApi.create({
        appointmentId: selectedAppointment,
        rating,
        comment: review
      });
      
      toast.success('Review submitted successfully!');
      setReviewDialogOpen(false);
      setRating(0);
      setReview('');
      
      // Update local state to show review is done
      setUserAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment 
          ? { ...apt, review: { rating, comment: review } } 
          : apt
      ));
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    }
  };

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#1e293b] mb-2">
            My Dashboard
          </h1>
          <p className="text-[#64748b]">Welcome back, {currentUser?.name}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white border-[#1e293b]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-sm mb-1">Total Appointments</p>
                  <p className="text-3xl font-semibold text-[#1e293b]">{userAppointments.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#a47731]/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#a47731]" />
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
                    {userAppointments.filter(a => a.status === 'confirmed').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
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
                    {userAppointments.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Appointments Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-slate-100/50 p-1">
              <TabsTrigger value="all" className="data-[state=active]:shadow-sm">All Appointments</TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:shadow-sm">Upcoming</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:shadow-sm">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {userAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-6 bg-white border-[#1e293b]/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1e293b] mb-1">
                            {appointment.lawyerName}
                          </h3>
                          <p className="text-[#64748b] text-sm">{appointment.legalIssue}</p>
                        </div>
                        <Badge className={getStatusBadge(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </div>
                      </div>
                    </div>

                    {appointment.status === 'completed' && !appointment.review && (
                      <Dialog 
                        open={reviewDialogOpen && selectedAppointment === appointment.id}
                        onOpenChange={(open) => {
                          setReviewDialogOpen(open);
                          if (open) setSelectedAppointment(appointment.id);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-[#a47731] text-[#a47731] hover:bg-[#a47731]/10"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Leave Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-['Playfair_Display'] text-2xl">
                              Review Your Experience
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                                Rating
                              </label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`w-8 h-8 ${
                                        star <= rating
                                          ? 'fill-[#a47731] text-[#a47731]'
                                          : 'text-[#cbd5e1]'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                                Your Review
                              </label>
                              <Textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share your experience..."
                                className="min-h-[100px] border-[#1e293b]/20"
                              />
                            </div>

                            <Button
                              onClick={handleSubmitReview}
                              className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
                            >
                              Submit Review
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {appointment.review && (
                      <div className="flex items-center gap-2 text-[#a47731]">
                        <Star className="w-5 h-5 fill-[#a47731]" />
                        <span className="font-semibold">{appointment.review.rating}.0</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {userAppointments.length === 0 && (
                <Card className="p-12 bg-white border-[#1e293b]/10 text-center">
                  <Calendar className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
                    No appointments yet
                  </h3>
                  <p className="text-[#64748b] mb-4">
                    Start by finding the right lawyer for your case
                  </p>
                  <Button 
                    className="bg-[#a47731] hover:bg-[#8d6629] text-white"
                    onClick={() => navigate('/search')}
                  >
                    Search Lawyers
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {userAppointments
                .filter((a) => a.status === 'confirmed' || a.status === 'pending')
                .map((appointment) => (
                  <Card key={appointment.id} className="p-6 bg-white border-[#1e293b]/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[#1e293b] mb-1">
                              {appointment.lawyerName}
                            </h3>
                            <p className="text-[#64748b] text-sm">{appointment.legalIssue}</p>
                          </div>
                          <Badge className={getStatusBadge(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {userAppointments
                .filter((a) => a.status === 'completed')
                .map((appointment) => (
                  <Card key={appointment.id} className="p-6 bg-white border-[#1e293b]/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[#1e293b] mb-1">
                              {appointment.lawyerName}
                            </h3>
                            <p className="text-[#64748b] text-sm">{appointment.legalIssue}</p>
                          </div>
                          <Badge className={getStatusBadge(appointment.status)}>
                            Completed
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                        </div>

                        {appointment.review && (
                          <div className="mt-3 p-3 bg-[#f8f8f8] rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(appointment.review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-[#a47731] text-[#a47731]" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-[#64748b]">{appointment.review.comment}</p>
                          </div>
                        )}
                      </div>

                      {!appointment.review && (
                        <Dialog 
                          open={reviewDialogOpen && selectedAppointment === appointment.id}
                          onOpenChange={(open) => {
                            setReviewDialogOpen(open);
                            if (open) setSelectedAppointment(appointment.id);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-[#a47731] text-[#a47731] hover:bg-[#a47731]/10"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Leave Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="font-['Playfair_Display'] text-2xl">
                                Review Your Experience
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="block text-sm font-medium text-[#1e293b] mb-2">
                                  Rating
                                </label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setRating(star)}
                                      className="focus:outline-none"
                                    >
                                      <Star
                                        className={`w-8 h-8 ${
                                          star <= rating
                                            ? 'fill-[#a47731] text-[#a47731]'
                                            : 'text-[#cbd5e1]'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-[#1e293b] mb-2">
                                  Your Review
                                </label>
                                <Textarea
                                  value={review}
                                  onChange={(e) => setReview(e.target.value)}
                                  placeholder="Share your experience..."
                                  className="min-h-[100px] border-[#1e293b]/20"
                                />
                              </div>

                              <Button
                                onClick={handleSubmitReview}
                                className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
                              >
                                Submit Review
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
