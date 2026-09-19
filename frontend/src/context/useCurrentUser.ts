import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './authContextDef';

export const useCurrentUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      backendUser: null,
      currentUser: {
        id: '',
        name: '',
        email: '',
        avatarUrl: '',
        handle: '',
        accreditationStatus: '',
        reProofScore: 0,
        completedProofs: 0,
        activeDomain: '',
      },
      initials: '',
      isLoading: false,
      authError: null,
      refetchUser: async () => {},
      isSignedIn: false,
    };
  }
  return context;
};
