import { createClient } from '@supabase/supabase-js';

// Accessing environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Safety check: Ensure variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');