import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { setApiTokenGetter, setOnUnauthorized } from '../api/client';
import { fetchCurrentBackendUser, type BackendUser } from '../api/auth';
import { mockUser } from '../data/mockData';
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

  // Unified candidate profile (seamless fallback hierarchy: backend -> Clerk -> mock defaults)
  const { currentUser, initials } = useMemo(() => {
    const clerkFullName = clerkUser
      ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        clerkUser.fullName
      : null;

    const displayName =
      backendUser?.name ||
      backendUser?.fullName ||
      clerkFullName ||
      mockUser.name;

    const displayEmail =
      backendUser?.email ||
      clerkUser?.primaryEmailAddress?.emailAddress ||
      mockUser.email;

    const displayId =
      backendUser?.id ||
      backendUser?.userId ||
      backendUser?.clerkId ||
      clerkUser?.id ||
      mockUser.id;

    const idSuffix = displayId ? displayId.slice(-5).toUpperCase() : '88241';
    const displayHandle =
      backendUser?.handle ||
      (clerkUser?.username ? `@${clerkUser.username}` : `ID-${idSuffix}`);

    const accreditationStatus =
      backendUser?.accreditationStatus ||
      `ACCREDITED // ${displayHandle}`;

    const profile: UserProfile = {
      id: displayId,
      name: displayName,
      email: displayEmail,
      avatarUrl: backendUser?.avatarUrl || clerkUser?.imageUrl || mockUser.avatarUrl,
      handle: displayHandle,
      accreditationStatus,
      reProofScore: backendUser?.reProofScore ?? mockUser.reProofScore,
      completedProofs: backendUser?.completedProofs ?? mockUser.completedProofs,
      activeDomain: backendUser?.activeDomain || mockUser.activeDomain,
    };

    const calculatedInitials = displayName
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'CP';

    return { currentUser: profile, initials: calculatedInitials };
  }, [backendUser, clerkUser]);

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
