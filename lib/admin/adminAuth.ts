/**
 * Secure Admin Authentication & Authorization Service
 * Enforces role-based access control (role = 'admin') across Supabase Auth
 * and development sessions.
 * Kalahari Pub & Restaurant — Phase 4
 */

import { cookies } from "next/headers";
import crypto from "crypto";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  user: AdminUser | null;
  error?: string;
}

const ADMIN_SESSION_COOKIE = "kalahari_admin_session";
// In production, configure ADMIN_DEV_PASSWORD in your environment variables.
const DEFAULT_DEV_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "owner@kalaharipub.com";
const DEFAULT_DEV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "KalahariOwner2026!";

/**
 * Server-side check for active administrator session.
 * Rejects unauthorized users, customers, and expired sessions.
 */
export async function getAdminSession(): Promise<AdminAuthSession> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) {
        return { isAuthenticated: false, user: null, error: "Database client unavailable." };
      }

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return { isAuthenticated: false, user: null };
      }

      // STRICT ROLE VERIFICATION: Only users with app_metadata.role === 'admin' are authorized
      const role = user.app_metadata?.role;
      if (role !== "admin") {
        return {
          isAuthenticated: false,
          user: null,
          error: "Access denied. Administrator privileges required.",
        };
      }

      return {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email || "",
          role: "admin",
        },
      };
    } catch (err: unknown) {
      console.error("[Admin Auth] Session verification error:", err);
      return { isAuthenticated: false, user: null };
    }
  }

  // In production, reject development fallback if Supabase is unconfigured
  if (process.env.NODE_ENV === "production") {
    return {
      isAuthenticated: false,
      user: null,
      error: "Production administrator authentication is not configured.",
    };
  }

  // Development Fallback: Verify secure session cookie (DEVELOPMENT ONLY)
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (!sessionCookie) {
      return { isAuthenticated: false, user: null };
    }

    // Verify token format (email:expires:signature)
    const [email, expiresStr, signature] = sessionCookie.split(":");
    if (!email || !expiresStr || !signature) {
      return { isAuthenticated: false, user: null };
    }

    const expires = parseInt(expiresStr, 10);
    if (Date.now() > expires) {
      return { isAuthenticated: false, user: null, error: "Session expired." };
    }

    const devSecret = process.env.DEV_SESSION_SECRET || "kalahari-dev-secret-key-salt";
    const expectedSig = crypto
      .createHmac("sha256", devSecret)
      .update(`${email}:${expiresStr}`)
      .digest("hex");

    if (signature !== expectedSig) {
      return { isAuthenticated: false, user: null, error: "Invalid session token." };
    }

    return {
      isAuthenticated: true,
      user: {
        id: "dev-owner-id",
        email,
        role: "admin",
      },
    };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

/**
 * Server Action: Authenticate Administrator
 */
export async function loginAdmin(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) {
        return { success: false, error: "Database client unavailable." };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || "Invalid credentials." };
      }

      // Check admin role
      const role = data.user.app_metadata?.role;
      if (role !== "admin") {
        await supabase.auth.signOut();
        return {
          success: false,
          error: "Unauthorized: Account does not have administrator privileges.",
        };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error.";
      return { success: false, error: msg };
    }
  }

  // Strictly disallow development authentication in production environment
  if (process.env.NODE_ENV === "production") {
    return {
      success: false,
      error: "Development authentication is strictly disabled in production. Please configure Supabase Auth.",
    };
  }

  // Development Fallback Authentication (LOCAL DEV ONLY)
  if (
    email === DEFAULT_DEV_ADMIN_EMAIL.toLowerCase() &&
    password === DEFAULT_DEV_ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const devSecret = process.env.DEV_SESSION_SECRET || "kalahari-dev-secret-key-salt";
    const signature = crypto
      .createHmac("sha256", devSecret)
      .update(`${email}:${expires}`)
      .digest("hex");

    cookieStore.set(ADMIN_SESSION_COOKIE, `${email}:${expires}:${signature}`, {
      httpOnly: true,
      secure: false, // Local development cookie fallback only
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return { success: true };
  }

  return { success: false, error: "Invalid email or password." };
}

/**
 * Server Action: Logout Administrator
 */
export async function logoutAdmin(): Promise<{ success: boolean }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("[Admin Auth] Logout error:", err);
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return { success: true };
}
