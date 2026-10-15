import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import { getSupabaseConfig } from "./config";

/**
 * Creates a server-side Supabase client for Next.js 15 App Router.
 * Returns null if Supabase environment variables are unconfigured.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // In Server Components, setAll can throw if headers were already sent.
          // This is expected and safe to ignore.
        }
      },
    },
  });
}
