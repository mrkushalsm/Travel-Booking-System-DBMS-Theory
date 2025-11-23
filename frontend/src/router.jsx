import { createBrowserRouter } from 'react-router-dom';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FlightsPage from './pages/FlightsPage';
import HotelsPage from './pages/HotelsPage';
import PackagesPage from './pages/PackagesPage';
import BookingsPage from './pages/BookingsPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'flights', element: <FlightsPage /> },
      { path: 'hotels', element: <HotelsPage /> },
      { path: 'packages', element: <PackagesPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <LoginPage /> },
]);

export default router;
