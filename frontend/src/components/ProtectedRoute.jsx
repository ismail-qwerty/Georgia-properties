import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute - Wrapper for routes requiring authentication
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/user-login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * AdminRoute - Wrapper for routes requiring admin privileges
 * Redirects to dashboard if not admin
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/user-login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    // Redirect regular users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * PublicRoute - Wrapper for public routes (login, register)
 * Redirects to dashboard if already authenticated
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isChatSupport, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated()) {
    // Redirect authenticated users to their appropriate dashboard
    if (isAdmin()) {
      return <Navigate to="/administration" replace />;
    }
    if (isChatSupport()) {
      return <Navigate to="/support" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
