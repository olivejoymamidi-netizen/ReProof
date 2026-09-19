import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || 'pk_test_c291bmQtYnJlYW0tNDI4NS5jbGVyay5hY2NvdW50cy5kZXYk',
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
};

