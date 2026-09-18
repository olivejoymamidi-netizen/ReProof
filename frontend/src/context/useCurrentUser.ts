import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './authContextDef';
import { mockUser } from '../data/mockData';

export const useCurrentUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      backendUser: null,
      currentUser: mockUser,
      initials: 'HV',
      isLoading: false,
      authError: null,
      refetchUser: async () => {},
      isSignedIn: false,
    };
  }
  return context;
};
