/**
 * Supabase Client Configuration
 * 
 * Initializes the Supabase client for database, authentication, and edge functions.
 * 
 * SECURITY: This file uses environment variables for credentials.
 * Never hardcode keys in production code.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Your Supabase project URL (e.g., https://xxxxx.supabase.co)
 * - VITE_SUPABASE_ANON_KEY: Public anon key (safe for client-side use)
 * 
 * The anon key is safe to expose as it only grants access defined by
 * Row Level Security (RLS) policies in your database.
 * 
 * Supabase Documentation:
 * @see https://supabase.com/docs/reference/javascript/initializing - Client initialization
 * @see https://supabase.com/docs/guides/auth - Authentication guide
 * @see https://supabase.com/docs/guides/database/postgres/row-level-security - RLS policies
 * @see https://supabase.com/docs/guides/functions - Edge Functions
 * 
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com/dashboard
 * 2. Copy your project URL and anon key from Settings > API
 * 3. Add them to your .env file:
 *    VITE_SUPABASE_URL=https://xxxxx.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key-here
 * 
 * Features Enabled:
 * - Auto refresh tokens (keeps users logged in)
 * - Persist session (saves auth state to localStorage)
 * - Detect session in URL (handles OAuth redirects)
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client or null if not configured
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  // Initialize Supabase client with auth configuration
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,      // Automatically refresh expired tokens
      persistSession: true,         // Save session to localStorage
      detectSessionInUrl: true,     // Handle OAuth callback URLs
    },
  });
} else {
  // Warn developers if Supabase is not configured
  console.warn('⚠️ Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.');
  console.warn('📖 See ENVIRONMENT_VARIABLES_GUIDE.md for setup instructions.');
}

// Export client (may be null if not configured)
export { supabase };
