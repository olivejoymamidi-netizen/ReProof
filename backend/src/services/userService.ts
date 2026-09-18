import { config } from '../config/env';
import { ApplicationUser } from '../types/auth';

/**
 * Minimal user lookup service.
 * Finds the application user corresponding to an authenticated Clerk user ID.
 */
export const findUserByClerkId = async (
  clerkId: string,
): Promise<ApplicationUser | null> => {
  if (!config.supabaseUrl || !config.supabaseSecretKey) {
    return null;
  }

  try {
    const { supabase } = await import('../config/supabase');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .maybeSingle();

    if (error) {
      console.error('Error querying user by clerk_id:', error.message);
      return null;
    }

    return data as ApplicationUser | null;
  } catch (err) {
    console.error('Database error in findUserByClerkId:', err);
    return null;
  }
};
