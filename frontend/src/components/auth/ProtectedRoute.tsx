import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

/**
 * Route protection guard for authenticated pages.
 * Redirects unauthenticated users to /login.
 * Displays an archival loading state while Clerk initializes.
 */
export const ProtectedRoute: React.FC = () => {
  const { isLoaded, isSignedIn } = useAuth();

  // Archival loading indicator while authentication status resolves
  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 font-mono">
        <div className="flex items-center gap-2.5 text-xs text-graphite-600 uppercase tracking-widest">
          <span className="inline-block w-2 h-2 rounded-full bg-cobalt-700 animate-pulse" />
          <span className="font-semibold">SYS.VERIFY // AUTHENTICATING SESSION</span>
        </div>
        <p className="text-[10px] text-graphite-400 uppercase tracking-wider">
          Checking candidate credentials against ledger...
        </p>
      </div>
    );
  }

  // Redirect unauthenticated visitors to /login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Render protected child route
  return <Outlet />;
};
