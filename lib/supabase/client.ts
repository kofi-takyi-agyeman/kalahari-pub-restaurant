import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";
import { getSupabaseConfig } from "./config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or retrieves a browser-safe Supabase client singleton.
 * Returns null gracefully if environment configuration has not yet been set up.
 */
export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    return null;
  }

  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(url, anonKey);
  }

  return browserClient;
}
