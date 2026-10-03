import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-surface">
        <Loader2 className="w-10 h-10 animate-spin text-accent mb-4" />
        <p className="text-slate-600 font-medium text-sm">Verifying access...</p>
      </div>
    );
  }

  if (!session) {
    // Redirect to /login and preserve destination in state for smooth post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
