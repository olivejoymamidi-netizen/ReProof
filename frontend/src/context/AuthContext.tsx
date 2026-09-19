import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { setApiTokenGetter, setOnUnauthorized } from '../api/client';
import { fetchCurrentBackendUser, type BackendUser } from '../api/auth';
import type { UserProfile } from '../types';
import { AuthContext } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Wire Clerk token retriever to the API client
  useEffect(() => {
    setApiTokenGetter(async () => {
      if (!isSignedIn) return null;
      try {
        return await getToken();
      } catch (err) {
        console.warn('[AuthContext] Failed to get Clerk session token:', err);
        return null;
      }
    });
  }, [isSignedIn, getToken]);

  // Handle 401 responses cleanly
  useEffect(() => {
    setOnUnauthorized(() => {
      setBackendUser(null);
      setAuthError('Session expired or unauthorized (401)');
    });
  }, []);

  // Fetch /api/auth/me from backend
  const fetchUser = useCallback(async () => {
    if (!isSignedIn) {
      setBackendUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const user = await fetchCurrentBackendUser();
      setBackendUser(user);
    } catch (err: any) {
      const errorMsg = err.status === 401
        ? 'Backend rejected authorization token (401 Unauthorized)'
        : err.message || 'Unable to connect to backend server';
      console.error('[AuthContext] Backend /api/auth/me request failed:', err);
      setAuthError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  // Automatically call /api/auth/me on sign-in
  useEffect(() => {
    let isCancelled = false;

    if (isLoaded && isSignedIn) {
      setIsLoading(true);
      fetchCurrentBackendUser()
        .then((user) => {
          if (!isCancelled) {
            setBackendUser(user);
            setAuthError(null);
          }
        })
        .catch((err: any) => {
          if (!isCancelled) {
            const errorMsg =
              err.status === 401
                ? 'Backend rejected authorization token (401 Unauthorized)'
                : err.message || 'Unable to connect to backend server';
            console.error('[AuthContext] Backend /api/auth/me request failed:', err);
            setAuthError(errorMsg);
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        });
    } else if (isLoaded && !isSignedIn) {
      setBackendUser(null);
      setAuthError(null);
      setIsLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  // Unified candidate profile: strictly reflects authentication state
  const { currentUser, initials } = useMemo(() => {
    if (!isSignedIn) {
      const emptyProfile: UserProfile = {
        id: '',
        name: '',
        email: '',
        avatarUrl: '',
        handle: '',
        accreditationStatus: '',
        reProofScore: 0,
        completedProofs: 0,
        activeDomain: '',
      };
      return { currentUser: emptyProfile, initials: '' };
    }

    const clerkFullName = clerkUser
      ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        clerkUser.fullName
      : null;

    const displayName =
      backendUser?.name ||
      backendUser?.fullName ||
      clerkFullName ||
      clerkUser?.username ||
      clerkUser?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
      'Candidate';

    const displayEmail =
      backendUser?.email ||
      clerkUser?.primaryEmailAddress?.emailAddress ||
      '';

    const displayId =
      backendUser?.id ||
      backendUser?.userId ||
      backendUser?.clerkId ||
      clerkUser?.id ||
      '';

    const idSuffix = displayId ? displayId.slice(-5).toUpperCase() : '';
    const displayHandle =
      backendUser?.handle ||
      (clerkUser?.username ? `@${clerkUser.username}` : (idSuffix ? `ID-${idSuffix}` : '@candidate'));

    const accreditationStatus =
      backendUser?.accreditationStatus ||
      (displayHandle ? `ACCREDITED // ${displayHandle}` : 'ACCREDITED CANDIDATE');

    const profile: UserProfile = {
      id: displayId,
      name: displayName,
      email: displayEmail,
      avatarUrl: backendUser?.avatarUrl || clerkUser?.imageUrl || '',
      handle: displayHandle,
      accreditationStatus,
      reProofScore: backendUser?.reProofScore ?? 92,
      completedProofs: backendUser?.completedProofs ?? 1,
      activeDomain: backendUser?.activeDomain || 'AI & Machine Learning',
    };

    const calculatedInitials = displayName
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || (clerkUser?.firstName ? clerkUser.firstName[0].toUpperCase() : 'CP');

    return { currentUser: profile, initials: calculatedInitials };
  }, [backendUser, clerkUser, isSignedIn]);

  return (
    <AuthContext.Provider
      value={{
        backendUser,
        currentUser,
        initials,
        isLoading,
        authError,
        refetchUser: fetchUser,
        isSignedIn: Boolean(isSignedIn),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
