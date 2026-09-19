/**
 * Clerk Authentication Configuration
 * Resolves the publishable key with multiple environment variable fallbacks
 * to support Vercel, Vite, and other deployment environments.
 */

const getPublishableKey = (): string => {
  const env = import.meta.env;
  const key =
    env.VITE_CLERK_PUBLISHABLE_KEY ||
    (env as any).VITE_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    (env as any).CLERK_PUBLISHABLE_KEY ||
    (env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    (env as any).REACT_APP_CLERK_PUBLISHABLE_KEY ||
    'pk_test_c291bmQtYnJlYW0tNDI4NS5jbGVyay5hY2NvdW50cy5kZXYk';

  if (typeof key === 'string') {
    const trimmed = key.trim().replace(/^["']|["']$/g, '');
    if (trimmed) return trimmed;
  }

  return 'pk_test_c291bmQtYnJlYW0tNDI4NS5jbGVyay5hY2NvdW50cy5kZXYk';
};

export const CLERK_PUBLISHABLE_KEY = getPublishableKey();
