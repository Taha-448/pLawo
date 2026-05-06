import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { miscApi } from '../services/api';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await miscApi.submitContact(formData);
      toast.success('Your message has been sent to the pLawo team!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navigation />

      <div className="container py-20">
        <div className="row g-5">
          {/* Contact Info Column */}
          <div className="col-lg-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-['Playfair_Display'] text-[#1e293b] mb-6">
                Get in Touch
              </h1>
              <p className="text-[#64748b] text-lg mb-10">
                Have questions about our platform or need technical support? 
                Our team is here to help you navigate pLawo.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#a47731]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#a47731]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1e293b]">Email Us</h4>
                    <p className="text-[#64748b]">support@plawo.com.pk</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#a47731]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#a47731]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1e293b]">Call Us</h4>
                    <p className="text-[#64748b]">+92 (51) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#a47731]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#a47731]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1e293b]">Visit Us</h4>
                    <p className="text-[#64748b]">NUST H-12, Islamabad, Pakistan</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Column */}
          <div className="col-lg-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 border-[#1e293b]/10 shadow-xl bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="block text-sm font-medium text-[#1e293b] mb-2">Full Name</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="bg-white border-[#1e293b]/20"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="block text-sm font-medium text-[#1e293b] mb-2">Email Address</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="bg-white border-[#1e293b]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e293b] mb-2">Subject</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="General Inquiry"
                      className="bg-white border-[#1e293b]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e293b] mb-2">Message</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="How can we help you?"
                      rows={6}
                      className="bg-white border-[#1e293b]/20 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white py-6"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
