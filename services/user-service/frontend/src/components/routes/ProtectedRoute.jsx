import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required, check for it
  if (roleRequired && userType !== roleRequired) {
    return <Navigate to="/dashboard" />;
  }

  // If user is authenticated and has required role (if specified), render the protected component
  return children;
};

export default ProtectedRoute;