/**
 * Supabase Client Configuration
 * 
 * SECURITY: This file initializes the Supabase client with credentials
 * from environment variables. Never hardcode keys in production.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Public anon key (safe for client-side)
 * 
 * The anon key is safe to expose as it only grants access defined by
 * Row Level Security (RLS) policies in your database.
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables - NO FALLBACKS for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

/**
 * Initialize Supabase client with authentication configuration
 * 
 * Options:
 * - autoRefreshToken: Automatically refresh auth tokens before expiry
 * - persistSession: Save session to localStorage for persistence
 * - detectSessionInUrl: Handle OAuth callbacks automatically
 */
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Export singleton instance
export { supabase };
