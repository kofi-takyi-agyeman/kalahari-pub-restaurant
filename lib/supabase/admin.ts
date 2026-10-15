import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getSupabaseConfig } from "./config";

/**
 * Privileged Supabase Admin Client (Service Role).
 *
 * CRITICAL SECURITY NOTICE:
 * This client bypasses Row Level Security (RLS) and must STRICTLY NEVER
 * be exposed to the browser or imported in client components.
 */
export function getSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: getSupabaseAdminClient() was called in a client/browser environment. This is strictly prohibited."
    );
  }

  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey || serviceRoleKey.trim() === "") {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
