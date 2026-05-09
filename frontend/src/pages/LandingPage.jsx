import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Shield, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { searchApi } from '../services/api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const result = await searchApi.smartSearch(searchQuery);
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`, { state: { apiResult: result } });
      } catch (error) {
        console.error("Smart search failed:", error);
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a47731]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1e293b]/5 rounded-full blur-3xl -z-10" />
        
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] text-[#1e293b] mb-6 leading-tight">
                  Find Your Perfect
                  <span className="block text-[#a47731]">Legal Counsel</span>
                </h1>
                <p className="text-lg md:text-xl text-[#64748b] mb-12 max-w-2xl mx-auto">
                  Describe your legal issue in plain English, our AI handles the vetting.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative max-w-3xl mx-auto"
              >
                <div className="relative flex flex-col md:flex-row gap-3 p-3 bg-white rounded-2xl shadow-2xl border border-[#1e293b]/10 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute !left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] z-10" />
                    <Input
                      type="text"
                      placeholder="e.g., I need help with a property dispute in Lahore..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="!pl-16 !pr-4 !py-7 text-base border-0 focus-visible:ring-0 bg-transparent w-full"
                      disabled={isSearching}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-[#a47731] hover:bg-[#8d6629] text-white px-8 py-7 !rounded-lg h-auto w-full md:w-auto"
                  >
                    {isSearching ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Case...
                      </>
                    ) : (
                      <>
                        Analyze Case
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-[#64748b] flex items-center justify-center gap-2"
                  >
                    <div className="w-2 h-2 bg-[#a47731] rounded-full animate-pulse" />
                    Scanning legal database and matching with verified counsel...
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-20 px-4 bg-white border-y border-[#1e293b]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#1e293b] text-center mb-16">
            Why Choose pLawo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center p-8 rounded-2xl hover:bg-[#FDFDFD] transition-colors"
            >
              <div className="w-16 h-16 bg-[#a47731]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#a47731]" />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b] mb-4">
                Sovereign Privacy
              </h3>
              <p className="text-[#64748b] leading-relaxed">
                Your legal matters remain confidential. We never share your data with third
                parties. End-to-end encrypted consultations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-8 rounded-2xl hover:bg-[#FDFDFD] transition-colors"
            >
              <div className="w-16 h-16 bg-[#a47731]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#a47731]" />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b] mb-4">
                Vetted Counsel
              </h3>
              <p className="text-[#64748b] leading-relaxed">
                Every lawyer is verified by our team. Bar Council licenses authenticated.
                Only top-rated professionals join our platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-8 rounded-2xl hover:bg-[#FDFDFD] transition-colors"
            >
              <div className="w-16 h-16 bg-[#a47731]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#a47731]" />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b] mb-4">
                Semantic Precision
              </h3>
              <p className="text-[#64748b] leading-relaxed">
                Our AI understands legal context in Urdu and English. Matches you with
                specialists based on case complexity and location.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#1e293b] mb-6">
            Ready to Find Your Legal Expert?
          </h2>
          <p className="text-lg text-[#64748b] mb-8">
            Join hundreds of clients who found the right lawyer through pLawo
          </p>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-[#a47731] hover:bg-[#8d6629] text-white px-8 py-6 text-lg h-auto"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e293b]/10 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#a47731] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-['Playfair_Display'] text-[#1e293b] font-semibold">
              pLawo
            </span>
          </div>
          <p className="text-[#64748b] mb-2">
            Smart AI Lawyer Finder & Consultation Platform
          </p>
          <p className="text-sm text-[#64748b]">
            © 2026 pLawo. All rights reserved. Serving justice across Pakistan.
          </p>
        </div>
      </footer>
    </div>
  );
}
