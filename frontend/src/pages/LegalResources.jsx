import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BookOpen, Scale, Shield, Gavel } from 'lucide-react';
import { miscApi } from '../services/api';
import { motion } from 'motion/react';

export default function LegalResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* Hero Section - Using Bootstrap Container */}
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full p-6 hover:shadow-lg transition-shadow border-[#1e293b]/10 bg-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#a47731]/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-[#a47731]" />
                        </div>
                        <Badge className="bg-[#1e293b]/5 text-[#1e293b] border-0">
                          {resource.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-['Playfair_Display'] text-[#1e293b] mb-3">
                        {resource.title}
                      </h3>
                      <p className="text-[#64748b] text-sm mb-4 line-clamp-3">
                        {resource.description}
                      </p>
                      <div className="pt-4 border-t border-[#1e293b]/5 flex justify-between items-center text-xs text-[#94a3b8]">
                        <span>By {resource.author}</span>
                        <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  </motion.div>
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
