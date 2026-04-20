import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapPin, Briefcase, Banknote, Star, CheckCircle2, Filter, Sparkles, Gavel, Scale } from 'lucide-react';
import { lawyerApi } from '../services/api';
import { getDirectImageUrl } from '../utils/imageUtils';


export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const apiResult = location.state?.apiResult;
  const searchQuery = searchParams.get('q') || '';
  
  // Transform backend data if available, otherwise fetch from api
  const [allLawyers, setAllLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const aiCategory = apiResult?.aiAssignedCategory;
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  useEffect(() => {
    if (apiResult?.lawyers) {
      const lawyers = apiResult.lawyers.map((l) => ({
        id: l.id,
        fullName: l.name,
        profilePhoto: getDirectImageUrl(l.lawyerProfile?.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a'),
        specialization: l.lawyerProfile?.specialization || 'General Practice',
        rating: l.lawyerProfile?.rating || 4.5,
        verified: l.lawyerProfile?.isVerified || false,
        city: l.lawyerProfile?.city || 'Unknown',
        yearsOfExperience: l.lawyerProfile?.yearsOfExperience || 0,
        consultationFee: l.lawyerProfile?.fees || 0,
        bio: l.lawyerProfile?.bio || '',
      }));
      setAllLawyers(lawyers);
      setIsLoading(false);

    } else {
      lawyerApi.getLawyers().then(data => {
        // Assume data contains { lawyers: [...] } or is just an array
        const lawyersList = Array.isArray(data) ? data : (data.lawyers || []);
        const lawyers = lawyersList.map((l) => ({
          id: l.id,
          fullName: l.name,
          profilePhoto: getDirectImageUrl(l.lawyerProfile?.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a'),
          specialization: l.lawyerProfile?.specialization || 'General Practice',
          rating: l.lawyerProfile?.rating || 4.5,
          verified: l.lawyerProfile?.isVerified || false,
          city: l.lawyerProfile?.city || 'Unknown',
          yearsOfExperience: l.lawyerProfile?.yearsOfExperience || 0,
          consultationFee: l.lawyerProfile?.fees || 0,
          bio: l.lawyerProfile?.bio || '',
        }));
        setAllLawyers(lawyers);

      }).catch(err => {
        console.error('Failed to fetch lawyers:', err);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [apiResult]);

  useEffect(() => {
    let results = [...allLawyers];
    
    // Filter by city
    if (selectedCity !== 'all') {
      results = results.filter(lawyer => lawyer.city === selectedCity);
    }
    
    // Filter by rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      results = results.filter(lawyer => lawyer.rating >= minRating);
    }
    
    setFilteredLawyers(results);
  }, [selectedCity, selectedRating, allLawyers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD]">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#a47731]">
          Loading lawyers...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#1e293b] mb-2">
            Recommended Lawyers
          </h1>
          {searchQuery && (
            <p className="text-[#64748b]">
              Based on your query: <span className="text-[#1e293b] font-medium">"{searchQuery}"</span>
            </p>
          )}
        </motion.div>

        {/* AI Analysis Section */}
        {apiResult?.aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-[#1e293b] to-[#2d3a4f] text-white">
              <div className="p-8 relative">
                {/* Decorative background icon */}
                <Scale className="absolute right-8 top-8 w-32 h-32 text-white/5 -rotate-12 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#a47731] flex items-center justify-center shadow-lg shadow-[#a47731]/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-['Playfair_Display'] text-white">pLawo AI Case Analysis</h2>
                      <Badge className="bg-[#a47731]/20 text-[#a47731] border-[#a47731]/30 hover:bg-[#a47731]/30">
                        {apiResult.aiAssignedCategory}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[#a47731] font-medium text-sm tracking-wider uppercase">
                        <Sparkles className="w-4 h-4" />
                        <span>Situation Summary</span>
                      </div>
                      <p className="text-lg leading-relaxed text-white/90 font-light italic">
                        "{apiResult.aiAnalysis}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[#a47731] font-medium text-sm tracking-wider uppercase">
                        <Gavel className="w-4 h-4" />
                        <span>Relevant Pakistani Laws</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {apiResult.aiApplicableLaws?.map((law, idx) => (
                          <div 
                            key={idx}
                            className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg text-sm text-white/90 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#a47731]" />
                            {law}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-[#a47731] via-[#c69c5d] to-[#a47731]" />
            </Card>
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-[#64748b]">
            Found {filteredLawyers.length} verified legal professionals
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-24 bg-white border-[#1e293b]/10">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-[#a47731]" />
                <h2 className="text-lg font-semibold text-[#1e293b]">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[#1e293b] mb-2">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-white border-[#1e293b]/20">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Karachi">Karachi</SelectItem>
                      <SelectItem value="Lahore">Lahore</SelectItem>
                      <SelectItem value="Islamabad">Islamabad</SelectItem>
                      <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                      <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                      <SelectItem value="Multan">Multan</SelectItem>
                      <SelectItem value="Peshawar">Peshawar</SelectItem>
                      <SelectItem value="Quetta">Quetta</SelectItem>
                      <SelectItem value="Sialkot">Sialkot</SelectItem>
                      <SelectItem value="Gujranwala">Gujranwala</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Abbottabad">Abbottabad</SelectItem>
                      <SelectItem value="Bahawalpur">Bahawalpur</SelectItem>
                      <SelectItem value="Sargodha">Sargodha</SelectItem>
                      <SelectItem value="Sukkur">Sukkur</SelectItem>
                      <SelectItem value="Jhang">Jhang</SelectItem>
                      <SelectItem value="Larkana">Larkana</SelectItem>
                      <SelectItem value="Sheikhupura">Sheikhupura</SelectItem>
                      <SelectItem value="Rahim Yar Khan">Rahim Yar Khan</SelectItem>
                      <SelectItem value="Mardan">Mardan</SelectItem>
                      <SelectItem value="Kasur">Kasur</SelectItem>
                      <SelectItem value="Sahiwal">Sahiwal</SelectItem>
                      <SelectItem value="Okara">Okara</SelectItem>
                      <SelectItem value="Wah Cantt">Wah Cantt</SelectItem>
                      <SelectItem value="Dera Ghazi Khan">Dera Ghazi Khan</SelectItem>
                      <SelectItem value="Mirpur Khas">Mirpur Khas</SelectItem>
                      <SelectItem value="Nawabshah">Nawabshah</SelectItem>
                      <SelectItem value="Chiniot">Chiniot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-[#1e293b] mb-2">Minimum Rating</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="bg-white border-[#1e293b]/20">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="4.8">4.8+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    setSelectedCity('all');
                    setSelectedRating('all');
                  }}
                  variant="outline"
                  className="w-full border-[#1e293b]/20"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </motion.aside>

          {/* Lawyers Grid */}
          <div className="lg:col-span-3 space-y-6">
            {filteredLawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-shadow bg-white border-[#1e293b]/10">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      <img
                        src={lawyer.profilePhoto}
                        alt={lawyer.fullName}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-2 border-[#a47731]/20"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b]">
                              {lawyer.fullName}
                            </h3>
                            {lawyer.verified && (
                              <Badge className="bg-[#a47731] text-white border-0">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-[#a47731] font-medium">{lawyer.specialization}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-[#a47731] text-[#a47731]" />
                          <span className="font-semibold text-[#1e293b]">{lawyer.rating}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-[#64748b]">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{lawyer.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#64748b]">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-sm">{lawyer.yearsOfExperience} years exp.</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1e293b] font-semibold">
                          <Banknote className="w-4 h-4 text-[#a47731]" />
                          <span className="text-sm">PKR {lawyer.consultationFee.toLocaleString()}/hr</span>
                        </div>
                      </div>

                      <p className="text-[#64748b] text-sm mb-4 line-clamp-2">
                        {lawyer.bio}
                      </p>

                      <Button
                        onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                        className="bg-[#a47731] hover:bg-[#8d6629] text-white"
                      >
                        View Profile & Book
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
