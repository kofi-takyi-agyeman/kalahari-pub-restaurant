"use server";

/**
 * Server Actions: Admin Authentication & Session Management
 * Provides callable server endpoints for client components (AdminNavbar, AdminLoginPage).
 * Kalahari Pub & Restaurant — Phases 4 & 6
 */

import { loginAdmin, logoutAdmin } from "@/lib/admin/adminAuth";

export async function adminLoginAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  return loginAdmin(formData);
}

export async function adminLogoutAction(): Promise<{ success: boolean }> {
  return logoutAdmin();
}
