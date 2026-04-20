import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Scale } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../config/supabaseClient';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      const user = data.user;
      if (!user) throw new Error('Login failed: No user data returned');

      // 2. Fetch role from public.User table
      const { data: dbUser, error: roleError } = await supabase
        .from('User')
        .select('role, name')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle to avoid 406 if profile doesn't exist yet
      
      if (roleError) {
        console.error("Database fetch error:", roleError);
        throw new Error('Could not fetch user profile. Please check if your account is fully set up.');
      }

      if (!dbUser) {
        throw new Error('User profile not found. If you just signed up, please wait a few seconds for the system to sync.');
      }

      const role = dbUser.role || 'CLIENT';
      
      // Store user info for easy access
      const userData = {
        id: user.id,
        email: user.email,
        name: dbUser.name || user.email,
        role: role
      };
      
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Signed in successfully!');

      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'LAWYER') {
        navigate('/lawyer-dashboard');
      } else {
        navigate('/client-dashboard');
      }
    } catch (err) {
      console.error("Sign In Error:", err);
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Welcome Back
            </h1>
            <p className="text-[#64748b]">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-[#1e293b]/20"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 border-[#1e293b]/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#64748b] text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#a47731] hover:text-[#8d6629] font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
