import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '../components/ui/dialog';
import { BookOpen, Scale, Shield, Gavel, Calendar, User } from 'lucide-react';
import { miscApi } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

export default function LegalResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    miscApi.getResources().then(data => {
      setResources(data);
    }).catch(err => {
      console.error('Error fetching resources:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navigation />

      {/* Hero Section */}
      <div className="container py-12">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-['Playfair_Display'] text-[#1e293b] mb-4">
                Legal Resources & Guides
              </h1>
              <p className="text-[#64748b] text-lg">
                Stay informed about your rights and the latest legal developments in Pakistan.
              </p>
            </motion.div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#a47731]">Loading resources...</div>
        ) : (
          <div className="row g-4">
            {resources.length > 0 ? (
              resources.map((resource, index) => (
                <div key={resource._id} className="col-md-6 col-lg-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full cursor-pointer"
                        onClick={() => setSelectedResource(resource)}
                      >
                        <Card className="h-full p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-[#1e293b]/10 bg-white group">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#a47731]/10 flex items-center justify-center group-hover:bg-[#a47731] transition-colors">
                              <BookOpen className="w-5 h-5 text-[#a47731] group-hover:text-white transition-colors" />
                            </div>
                            <Badge className="bg-[#1e293b]/5 text-[#1e293b] border-0">
                              {resource.category}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b] mb-3 group-hover:text-[#a47731] transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-[#64748b] text-sm mb-4 line-clamp-3">
                            {resource.description}
                          </p>
                          <div className="pt-4 border-t border-[#1e293b]/5 flex justify-between items-center text-xs text-[#94a3b8]">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {resource.author}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(resource.createdAt).toLocaleDateString()}</span>
                          </div>
                        </Card>
                      </motion.div>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl p-0">
                      <div className="h-2 bg-[#a47731]" />
                      <div className="p-8">
                        <DialogHeader className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-[#a47731]/10 text-[#a47731] hover:bg-[#a47731]/20 border-0">
                              {resource.category}
                            </Badge>
                            <span className="text-xs text-[#94a3b8]">• {new Date(resource.createdAt).toLocaleDateString()}</span>
                          </div>
                          <DialogTitle className="text-3xl font-['Playfair_Display'] text-[#1e293b] leading-tight">
                            {resource.title}
                          </DialogTitle>
                          <div className="flex items-center gap-2 mt-4 text-[#64748b] text-sm">
                            <div className="w-8 h-8 rounded-full bg-[#1e293b]/5 flex items-center justify-center">
                              <User className="w-4 h-4 text-[#1e293b]" />
                            </div>
                            <span>By <span className="font-semibold text-[#1e293b]">{resource.author}</span></span>
                          </div>
                        </DialogHeader>

                        <div className="prose prose-slate max-w-none">
                          <p className="text-lg text-[#1e293b] font-medium leading-relaxed mb-6 bg-[#f8fafc] p-4 border-l-4 border-[#a47731] rounded-r-lg">
                            {resource.description}
                          </p>
                          <div className="text-[#334155] leading-loose whitespace-pre-wrap text-base">
                            {resource.content}
                          </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-[#a47731]">
                              <Shield className="w-3 h-3" />
                              Verified Legal Guide
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 italic">
                            Disclaimer: This guide is for informational purposes only and does not constitute formal legal advice.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-10 text-[#64748b]">
                No legal resources available at the moment. Check back soon!
              </div>
            )}
          </div>
        )}
      </div>


      {/* Informational Section - Bootstrap Layout */}
      <div className="bg-[#1e293b] text-white py-20 mt-20">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="text-3xl font-['Playfair_Display'] mb-4">Empowering Citizens through Legal Knowledge</h2>
              <p className="text-white/70 mb-6">
                Our mission is to make legal information accessible to every citizen of Pakistan, 
                ensuring that everyone understands their constitutional rights and protections.
              </p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#a47731]" />
                    <span className="text-sm">Verified Info</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-[#a47731]" />
                    <span className="text-sm">Constitutional Rights</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Scale className="w-20 h-20 text-[#a47731] mx-auto mb-4" />
                <p className="font-['Playfair_Display'] text-xl italic text-white/90">
                  "Justice for all is the foundation of a prosperous society."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
