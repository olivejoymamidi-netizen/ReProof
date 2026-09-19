import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { CLERK_PUBLISHABLE_KEY } from './config/clerk';
import { ErrorBoundary } from './components/common/ErrorBoundary';

/**
 * Root Application Component
 * 
 * Ensures the entire React application, authentication context, and router
 * are wrapped within a single <ClerkProvider> using the resolved publishable key.
 * Never renders routes outside of ClerkProvider to prevent useClerk/useAuth context errors.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
