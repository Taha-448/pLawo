import { Link, useNavigate } from 'react-router';
import { Scale, User, Menu, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
export default function Navigation() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Initial load from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    // Since we're using plain localStorage now, the component will re-mount 
    // on route changes from SignIn/SignUp, so initial load is sufficient.
    // However, if we need cross-tab sync, we could listen for 'storage' events.
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/signin';
    const role = currentUser.role?.toLowerCase();
    if (role === 'admin') return '/admin';
    if (role === 'lawyer') return '/lawyer-dashboard';
    return '/client-dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFDFD] border-b border-[#1e293b]/10 backdrop-blur-sm">
      <div className="container">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-[#a47731] flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-['Playfair_Display'] text-[#1e293b] font-semibold tracking-tight">
              pLawo
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium">Expertise</Link>
            <Link to="/" className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#a47731]" />
              AI Lawyer
            </Link>
            <Link to="/resources" className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium">Resources</Link>
            <Link to="/contact" className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium">Contact</Link>


            
            {currentUser ? (
              <>
                <Link to={getDashboardLink()} className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {currentUser.role?.toLowerCase() === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <Button onClick={handleSignOut} variant="outline" className="border-[#1e293b]/20">Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/signin"><Button variant="outline" className="border-[#1e293b]/20">Sign In</Button></Link>
                <Link to="/signup"><Button className="bg-[#a47731] hover:bg-[#8d6629] text-white">Get Started</Button></Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block font-medium">Expertise</Link>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-[#a47731]" />
              AI Lawyer
            </Link>
            <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="block font-medium">Resources</Link>
            {currentUser ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block font-medium">Dashboard</Link>
                <Button onClick={handleSignOut} variant="outline" className="w-full border-[#1e293b]/20">Sign Out</Button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full">Sign In</Button></Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}><Button className="w-full bg-[#a47731] text-white">Get Started</Button></Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
