import { clerkClient } from '@clerk/express';
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

/**
 * User provisioning service.
 * 1. Checks if a database user with this clerk_id exists; if so, returns it.
 * 2. If no user with clerk_id exists, fetches profile from Clerk.
 * 3. Checks if a user with that email already exists; if so, links clerk_id.
 * 4. Otherwise, creates the new user record in the database.
 * Does not create duplicate users.
 */
export const findOrCreateUserByClerkId = async (
  clerkId: string,
): Promise<ApplicationUser | null> => {
  if (!config.supabaseUrl || !config.supabaseSecretKey) {
    return null;
  }

  try {
    // 1. Check if user already exists by clerk_id
    const existingUser = await findUserByClerkId(clerkId);
    if (existingUser) {
      return existingUser;
    }

    // 2. Fetch user information from Clerk
    let name = 'Candidate User';
    let email = `${clerkId}@placeholder.reproof.dev`;

    try {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
      if (fullName) {
        name = fullName;
      } else if (clerkUser.username) {
        name = clerkUser.username;
      }

      const primaryEmail =
        clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
        clerkUser.emailAddresses?.[0]?.emailAddress;

      if (primaryEmail) {
        email = primaryEmail;
      }
    } catch (clerkErr) {
      console.error('Error retrieving user details from Clerk:', clerkErr);
    }

    const { supabase } = await import('../config/supabase');

    // 3. Prevent duplicates: check if a user with this email already exists
    const { data: userWithEmail, error: emailQueryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!emailQueryError && userWithEmail) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          clerk_id: clerkId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userWithEmail.id)
        .select('*')
        .single();

      if (!updateError && updatedUser) {
        return updatedUser as ApplicationUser;
      }
    }

    // 4. Create new user record
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkId,
        name,
        email,
      })
      .select('*')
      .single();

    if (insertError) {
      // If a race condition occurred, check if the record was inserted concurrently
      const retryUser = await findUserByClerkId(clerkId);
      if (retryUser) {
        return retryUser;
      }
      console.error('Error creating user in database:', insertError.message);
      return null;
    }

    return newUser as ApplicationUser;
  } catch (err) {
    console.error('Database error in findOrCreateUserByClerkId:', err);
    return null;
  }
};

