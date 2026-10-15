/**
 * Supabase Environment Configuration and Validation
 * Kalahari Pub & Restaurant — Phase 2
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  isConfigured: boolean;
}

/**
 * Validates and retrieves Supabase configuration safely
 * without throwing unhandled exceptions if variables are missing.
 */
export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.trim() !== "" &&
    anonKey.trim() !== "" &&
    !url.includes("your-supabase-project") &&
    !anonKey.includes("your-anon-key")
  );

  return {
    url: url || "",
    anonKey: anonKey || "",
    serviceRoleKey: serviceRoleKey || undefined,
    isConfigured,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}
