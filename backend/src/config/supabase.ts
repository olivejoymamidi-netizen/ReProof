import { createClient } from '@supabase/supabase-js';
import { config } from './env';

const supabaseUrl = config.supabaseUrl;
const supabaseSecretKey = config.supabaseSecretKey || config.supabaseServiceRoleKey;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    'Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_SECRET_KEY are set in .env',
  );
}

// Service role client — used server-side only.
// NEVER expose this key to the frontend or commit it to version control.
export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
