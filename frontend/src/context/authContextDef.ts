import { createContext } from 'react';
import type { BackendUser } from '../api/auth';
import type { UserProfile } from '../types';

export interface AuthContextType {
  backendUser: BackendUser | null;
  currentUser: UserProfile;
  initials: string;
  isLoading: boolean;
  authError: string | null;
  refetchUser: () => Promise<void>;
  isSignedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
