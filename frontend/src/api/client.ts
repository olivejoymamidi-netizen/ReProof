/**
 * Reusable Authenticated API Client for ReProof
 *
 * Communicates with backend at VITE_API_URL (http://localhost:5000)
 * Automatically injects Clerk JWT session token as Authorization: Bearer <token>
 * Gracefully handles 401 Unauthorized responses.
 * Uses standard CORS fetch without workarounds or mode: 'no-cors'.
 */

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type TokenGetter = () => Promise<string | null>;
type UnauthorizedHandler = (url: string) => void;

let globalTokenGetter: TokenGetter | null = null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Register a function to dynamically fetch the latest Clerk session token.
 */
export const setApiTokenGetter = (getter: TokenGetter) => {
  globalTokenGetter = getter;
};

/**
 * Register a listener for 401 Unauthorized responses.
 */
export const setOnUnauthorized = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

/**
 * Retrieves the Clerk session token dynamically.
 * Prioritizes registered getter (from useAuth), then falls back to window.Clerk.
 */
export async function getSessionToken(): Promise<string | null> {
  if (globalTokenGetter) {
    try {
      const token = await globalTokenGetter();
      if (token) return token;
    } catch (err) {
      console.warn('[API Client] Error resolving token from getter:', err);
    }
  }

  // Fallback check on window.Clerk in case window is available
  if (typeof window !== 'undefined') {
    try {
      const clerk = (window as any).Clerk;
      if (clerk?.session) {
        return await clerk.session.getToken();
      }
    } catch (err) {
      console.warn('[API Client] Error resolving token from window.Clerk:', err);
    }
  }

  return null;
}

export const getBaseUrl = (): string => {
  return (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000'
  );
};

/**
 * Main authenticated fetch function
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  let fullUrl =
    endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${baseUrl.replace(/\/$/, '')}${cleanEndpoint}`;

  // Append query params if specified
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers = new Headers(options.headers || {});

  // Add default content-type if sending body and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject Authorization: Bearer <Clerk session token> unless skipAuth is true
  if (!options.skipAuth) {
    const token = await getSessionToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      console.log(
        `[API Client] Request to ${fullUrl} includes Authorization: Bearer <token (${token.slice(0, 10)}...)>`
      );
    } else {
      console.log(`[API Client] Request to ${fullUrl} without token (not signed in or token unavailable)`);
    }
  }

  try {
    console.log(`[API Client] Executing: ${options.method || 'GET'} ${fullUrl}`);
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log(`[API Client] Response status: ${response.status} from ${fullUrl}`);

    // Handle 401 Unauthorized cleanly
    if (response.status === 401) {
      console.warn(`[API Client] 401 Unauthorized for ${fullUrl}`);
      if (unauthorizedHandler) {
        try {
          unauthorizedHandler(fullUrl);
        } catch (e) {
          console.error('[API Client] Error in unauthorized handler:', e);
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('reproof:unauthorized', { detail: { url: fullUrl } })
        );
      }
      throw new ApiError(401, 'Unauthorized: session expired or invalid credentials');
    }

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        try {
          errorData = await response.text();
        } catch {
          errorData = null;
        }
      }
      const message =
        (errorData && (errorData.message || errorData.error)) ||
        `HTTP request failed with status ${response.status}`;
      throw new ApiError(response.status, message, errorData);
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.warn(`[API Client] Network or fetch error for ${fullUrl}:`, error);
    const message = error instanceof Error ? error.message : 'Network error';
    throw new ApiError(0, message, error);
  }
}

/**
 * Convenient API method verbs
 */
export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
