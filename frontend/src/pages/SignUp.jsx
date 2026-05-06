import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Scale, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../services/api';

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    specialization: '',
    fees: '',
    bio: '',
    yearsOfExperience: '',
    education: '',
    barLicenseNumber: '',
    officeAddress: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [barLicenseFile, setBarLicenseFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'profilePhoto') setProfilePhoto(files[0]);
      if (name === 'barLicenseFile') setBarLicenseFile(files[0]);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData to handle all fields and files in one go
      const registerData = new FormData();
      registerData.append('name', formData.name);
      registerData.append('email', formData.email);
      registerData.append('password', formData.password);
      registerData.append('role', role.toUpperCase());

      if (role === 'lawyer') {
        if (!formData.city || !formData.specialization || !barLicenseFile || !formData.officeAddress) {
          toast.error("Please fill in all fields and upload your Bar License");
          setIsSubmitting(false);
          return;
        }

        registerData.append('city', formData.city);
        registerData.append('specialization', formData.specialization);
        registerData.append('fees', formData.fees);
        registerData.append('bio', formData.bio);
        registerData.append('yearsOfExperience', formData.yearsOfExperience);
        registerData.append('education', formData.education);
        registerData.append('barLicenseNumber', formData.barLicenseNumber);
        registerData.append('officeAddress', formData.officeAddress);
        
        if (profilePhoto) {
          registerData.append('profilePhoto', profilePhoto);
        }
        if (barLicenseFile) {
          registerData.append('barLicenseFile', barLicenseFile);
        }
      }

      // 1. Register with our backend API
      const data = await authApi.register(registerData, true);
      
      const { token, user } = data;

      // 2. Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(data.message || 'Registration successful!');
      setIsSubmitted(true);
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const user = JSON.parse(localStorage.getItem('user'));
    const dashboardPath = user?.role === 'ADMIN' ? '/admin' : (user?.role === 'LAWYER' ? '/lawyer-dashboard' : '/client-dashboard');
    
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-10 bg-white border-[#1e293b]/10 text-center">
            <div className="w-20 h-20 rounded-full bg-[#a47731]/10 flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-[#a47731]" />
            </div>
            <h2 className="text-3xl font-['Playfair_Display'] text-[#1e293b] mb-4">
              Welcome to pLawo
            </h2>
            <p className="text-[#64748b] leading-relaxed mb-8">
              Your account has been created successfully. You can now start using the platform.
            </p>
            <Button 
              className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
              onClick={() => navigate(dashboardPath)}
            >
              Go to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-[#a47731] flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-['Playfair_Display'] text-[#1e293b] font-semibold">
              pLawo
            </span>
          </Link>
        </div>

        <Card className="p-8 bg-white border-[#1e293b]/10">
          <div className="mb-8">
            <h1 className="text-2xl font-['Playfair_Display'] text-[#1e293b] mb-2">
              Create Your Account
            </h1>
            <p className="text-[#64748b]">Join the pLawo legal community</p>
          </div>

          <div className="mb-6">
            <Label className="mb-3 block">Choose Your Role</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  role === 'client' ? 'border-[#a47731] bg-[#a47731]/5' : 'border-[#1e293b]/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === 'client' ? 'bg-[#a47731]' : 'bg-[#f8f8f8]'}`}>
                    <User className={`w-6 h-6 ${role === 'client' ? 'text-white' : 'text-[#64748b]'}`} />
                  </div>
                  <span className={`font-medium ${role === 'client' ? 'text-[#a47731]' : 'text-[#64748b]'}`}>Client</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('lawyer')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  role === 'lawyer' ? 'border-[#a47731] bg-[#a47731]/5' : 'border-[#1e293b]/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === 'lawyer' ? 'bg-[#a47731]' : 'bg-[#f8f8f8]'}`}>
                    <Briefcase className={`w-6 h-6 ${role === 'lawyer' ? 'text-white' : 'text-[#64748b]'}`} />
                  </div>
                  <span className={`font-medium ${role === 'lawyer' ? 'text-[#a47731]' : 'text-[#64748b]'}`}>Lawyer</span>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
              </div>
            </div>

            {role === 'lawyer' && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#1e293b]/10">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" name="specialization" type="text" value={formData.specialization} onChange={handleInputChange} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" type="text" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="fees">Consultation Fee (PKR)</Label>
                  <Input id="fees" name="fees" type="number" placeholder="e.g. 5000" value={formData.fees} onChange={handleInputChange} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="barLicenseNumber">Bar License Number</Label>
                  <Input id="barLicenseNumber" name="barLicenseNumber" type="text" placeholder="e.g. BAL-12345" value={formData.barLicenseNumber} onChange={handleInputChange} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input id="yearsOfExperience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleInputChange} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="education">Education</Label>
                  <Input id="education" name="education" type="text" placeholder="e.g. LLB, LLM" value={formData.education} onChange={handleInputChange} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="profilePhoto">Profile Photo</Label>
                  <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="barLicenseFile">Bar License (PDF/Image)</Label>
                  <Input id="barLicenseFile" name="barLicenseFile" type="file" accept="image/*,application/pdf" onChange={handleFileChange} required />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="officeAddress">Office Address</Label>
                  <Input id="officeAddress" name="officeAddress" type="text" placeholder="e.g. Office #12, 3rd Floor, Liberty Plaza, Lahore" value={formData.officeAddress} onChange={handleInputChange} required />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="bio">About / Bio</Label>
                  <textarea
                    id="bio" name="bio" value={formData.bio} onChange={handleInputChange}
                    placeholder="Tell clients about your expertise..."
                    className="mt-2 w-full p-3 rounded-md border border-[#1e293b]/20 min-h-[80px] text-sm"
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#a47731] hover:text-[#8d6629] font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
