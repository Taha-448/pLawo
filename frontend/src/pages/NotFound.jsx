import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Scale, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-[#a47731] flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-8xl font-['Playfair_Display'] text-[#1e293b] mb-4">404</h1>
          <h2 className="text-2xl font-['Playfair_Display'] text-[#1e293b] mb-4">
            Page Not Found
          </h2>
          <p className="text-[#64748b] mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/">
          <Button className="bg-[#a47731] hover:bg-[#8d6629] text-white">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
