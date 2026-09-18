import { api } from './client';

export interface BackendUser {
  id?: string;
  userId?: string;
  clerkId?: string;
  email?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  handle?: string;
  role?: string;
  accreditationStatus?: string;
  reProofScore?: number;
  completedProofs?: number;
  activeDomain?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface AuthMeResponse {
  user?: BackendUser;
  data?: BackendUser;
  [key: string]: any;
}

/**
 * Call GET /api/auth/me to fetch current authenticated user profile from backend.
 * Automatically injects Clerk Bearer token via the API client.
 */
export async function fetchCurrentBackendUser(): Promise<BackendUser> {
  const response = await api.get<any>('/api/auth/me');

  if (response && typeof response === 'object') {
    if (response.data && typeof response.data === 'object') {
      const data = response.data;
      if (data.user && typeof data.user === 'object') {
        return {
          clerkId: data.clerkUserId,
          ...data.user,
        };
      }
      return {
        clerkId: data.clerkUserId,
        userId: data.clerkUserId,
        ...data,
      };
    }
    if (response.user && typeof response.user === 'object') {
      return response.user;
    }
    return response as BackendUser;
  }

  return response as BackendUser;
}
