import { Link, useNavigate } from 'react-router';
import { Scale, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-[#a47731] flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-['Playfair_Display'] text-[#1e293b] font-semibold tracking-tight">
              pLawo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/search"
              className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium"
            >
              Expertise
            </Link>
            <Link
              to="/#about"
              className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium"
            >
              The Firm
            </Link>
            {currentUser ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-[#1e293b] hover:text-[#a47731] transition-colors font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {currentUser.role?.toLowerCase() === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-[#1e293b]/20"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" className="border-[#1e293b]/20">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#a47731] hover:bg-[#8d6629] text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#1e293b]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1e293b]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1e293b] hover:text-[#a47731] transition-colors font-medium"
            >
              Expertise
            </Link>
            <Link
              to="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#1e293b] hover:text-[#a47731] transition-colors font-medium"
            >
              The Firm
            </Link>
            {currentUser ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#1e293b] hover:text-[#a47731] transition-colors font-medium"
                >
                  {currentUser.role?.toLowerCase() === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <Button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-[#1e293b]/20"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-[#1e293b]/20">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#a47731] hover:bg-[#8d6629] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
