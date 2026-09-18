import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  if (!PUBLISHABLE_KEY) {
    return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ClerkProvider>
  );
}
