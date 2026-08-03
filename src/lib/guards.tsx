// guards.tsx — Route protection components.
// Responsibilities:
//   - Show a branded loading spinner while the auth session is still being
//     restored (avoids a flash of the wrong page).
//   - ProtectedRoute: only renders children when signed in; otherwise
//     redirects to /auth and remembers where the user wanted to go so they
//     can be returned there after logging in.
//   - AdminRoute: same as ProtectedRoute but additionally requires the
//     'admin' role; non-admins are sent to /dashboard.
//   - PublicOnlyRoute: only renders for signed-OUT visitors (used by /auth);
//     signed-in users are redirected to /dashboard.
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[#dbc1ba] border-t-[#6f250f] rounded-full animate-spin"></div>
      <p className="font-label-md text-sm text-[#55423e]">Loading UBUNTU-GEN...</p>
    </div>
  </div>
);

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;
  if (!session) return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading, isAdmin } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!session) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (session) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
