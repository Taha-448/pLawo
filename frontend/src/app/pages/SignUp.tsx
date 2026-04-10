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
  const [role, setRole] = useState<'client' | 'lawyer'>('client');
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
    profilePhoto: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      let data;
      if (role === 'client') {
        data = await authApi.registerClient({
          name: formData.name, email: formData.email, password: formData.password
        });
      } else {
        if (!formData.city || !formData.specialization) {
          toast.error("Please fill in City and Specialization");
          return;
        }

        // Use FormData for lawyer registration (with photo)
        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('city', formData.city);
        form.append('specialization', formData.specialization);
        form.append('fees', formData.fees);
        form.append('bio', formData.bio);
        form.append('yearsOfExperience', formData.yearsOfExperience);
        form.append('education', formData.education);
        form.append('barLicenseNumber', formData.barLicenseNumber);
        
        if (selectedFile) {
          form.append('profilePhoto', selectedFile);
        }

        data = await authApi.registerLawyer(form);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Account created successfully!');

      if (data.user.role === 'LAWYER') {
        navigate('/lawyer-dashboard');
      } else {
        navigate('/client-dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
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

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="mb-3 block">Choose Your Role</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  role === 'client'
                    ? 'border-[#a47731] bg-[#a47731]/5'
                    : 'border-[#1e293b]/10 hover:border-[#1e293b]/30'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      role === 'client' ? 'bg-[#a47731]' : 'bg-[#f8f8f8]'
                    }`}
                  >
                    <User className={`w-6 h-6 ${role === 'client' ? 'text-white' : 'text-[#64748b]'}`} />
                  </div>
                  <span
                    className={`font-medium ${
                      role === 'client' ? 'text-[#a47731]' : 'text-[#64748b]'
                    }`}
                  >
                    Client
                  </span>
                  <span className="text-xs text-[#64748b] text-center">
                    Find legal counsel
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('lawyer')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  role === 'lawyer'
                    ? 'border-[#a47731] bg-[#a47731]/5'
                    : 'border-[#1e293b]/10 hover:border-[#1e293b]/30'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      role === 'lawyer' ? 'bg-[#a47731]' : 'bg-[#f8f8f8]'
                    }`}
                  >
                    <Briefcase
                      className={`w-6 h-6 ${role === 'lawyer' ? 'text-white' : 'text-[#64748b]'}`}
                    />
                  </div>
                  <span
                    className={`font-medium ${
                      role === 'lawyer' ? 'text-[#a47731]' : 'text-[#64748b]'
                    }`}
                  >
                    Lawyer
                  </span>
                  <span className="text-xs text-[#64748b] text-center">
                    Offer your services
                  </span>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 border-[#1e293b]/20"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2 border-[#1e293b]/20"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-2 border-[#1e293b]/20"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-2 border-[#1e293b]/20"
                required
              />
            </div>

            {role === 'lawyer' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    placeholder="e.g. Criminal Law"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="mt-2 border-[#1e293b]/20"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="e.g. Lahore"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-2 border-[#1e293b]/20"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="fees">Consultation Fee (PKR)</Label>
                  <Input
                    id="fees"
                    name="fees"
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.fees}
                    onChange={handleInputChange}
                    className="mt-2 border-[#1e293b]/20"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    placeholder="e.g. 10"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="mt-2 border-[#1e293b]/20"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    name="education"
                    type="text"
                    placeholder="e.g. LLB, LLM"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="mt-2 border-[#1e293b]/20"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="barLicenseNumber">Bar License Number</Label>
                  <Input
                    id="barLicenseNumber"
                    name="barLicenseNumber"
                    type="text"
                    placeholder="e.g. LHR-2012-4567"
                    value={formData.barLicenseNumber}
                    onChange={handleInputChange}
                    className="mt-2 border-[#1e293b]/20"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="profilePhoto">Profile Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        id="profilePhoto"
                        name="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer border-[#a47731]/20 file:bg-[#a47731]/10 file:text-[#a47731] file:border-0 file:rounded-md file:px-3 file:mr-4 hover:file:bg-[#a47731]/20"
                      />
                    </div>
                    {selectedFile && (
                      <div className="text-xs text-[#64748b] bg-[#f8f8f8] px-2 py-1 rounded">
                        Selected: {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="bio">About / Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell clients about your experience..."
                    value={formData.bio}
                    onChange={handleInputChange as any}
                    className="mt-2 w-full p-3 rounded-md border border-[#1e293b]/20 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-[#a47731]/50"
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 rounded border-[#1e293b]/20" required />
              <span className="text-[#64748b]">
                I agree to the{' '}
                <button type="button" className="text-[#a47731] hover:text-[#8d6629]">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-[#a47731] hover:text-[#8d6629]">
                  Privacy Policy
                </button>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#64748b] text-sm">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#a47731] hover:text-[#8d6629] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
