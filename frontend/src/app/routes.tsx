import { createBrowserRouter } from 'react-router';
import LandingPage from './pages/LandingPage';
import SearchResults from './pages/SearchResults';
import LawyerProfile from './pages/LawyerProfile';
import ClientDashboard from './pages/ClientDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AdminPanel from './pages/AdminPanel';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

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
    path: '/client-dashboard',
    Component: ClientDashboard,
  },
  {
    path: '/lawyer-dashboard',
    Component: LawyerDashboard,
  },
  {
    path: '/admin',
    Component: AdminPanel,
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
