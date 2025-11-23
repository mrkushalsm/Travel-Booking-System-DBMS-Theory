import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';
import LoadingScreen from '../components/LoadingScreen';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking session" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedLayout;
