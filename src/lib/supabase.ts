import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Versioned storage key to avoid cache conflicts
const STORAGE_KEY = 'smartap-v2-auth';

// Singleton pattern - reuse same client instance
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: STORAGE_KEY,
        storage: {
          getItem: (key: string) => {
            try {
              return localStorage.getItem(key);
            } catch {
              return null;
            }
          },
          setItem: (key: string, value: string) => {
            try {
              localStorage.setItem(key, value);
            } catch (e) {
              console.error('Error saving session:', e);
            }
          },
          removeItem: (key: string) => {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.error('Error removing session:', e);
            }
          },
        },
      },
    });
  }
  return supabaseClient;
}

// Default export for backward compatibility
export const supabase = getSupabaseClient();
