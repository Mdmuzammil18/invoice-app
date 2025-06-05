import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Auth utility functions
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getStoredUser = (): string | null => {
  return localStorage.getItem('username');
};

export const storeAuthData = (username: string): void => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('username', username);};

export const clearAuthData = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
};

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status when the component mounts
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };
    
    checkAuth();
    
    // Listen for storage changes to handle logouts from other tabs
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Show loading state while checking auth status
  if (isAuth === null) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
