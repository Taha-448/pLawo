import { createBrowserRouter, Navigate } from 'react-router';
import LandingPage from './pages/LandingPage';
import SearchResults from './pages/SearchResults';
import LawyerProfile from './pages/LawyerProfile';
import ClientDashboard from './pages/ClientDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AdminPanel from './pages/AdminPanel';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

import LegalResources from './pages/LegalResources';
import ContactUs from './pages/ContactUs';

// Helper to protect routes
const ProtectedRoute = ({ children, allowedRole }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/signin" replace />;
  
  const user = JSON.parse(userStr);
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/search',
    Component: SearchResults,
  },
  {
    path: '/lawyer/:id',
    Component: LawyerProfile,
  },
  {
    path: '/resources',
    Component: LegalResources,
  },
  {
    path: '/contact',
    Component: ContactUs,
  },
  {
    path: '/client-dashboard',
    element: <ProtectedRoute allowedRole="CLIENT"><ClientDashboard /></ProtectedRoute>,
  },
  {
    path: '/lawyer-dashboard',
    element: <ProtectedRoute allowedRole="LAWYER"><LawyerDashboard /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRole="ADMIN"><AdminPanel /></ProtectedRoute>,
  },
  {
    path: '/signin',
    Component: SignIn,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
