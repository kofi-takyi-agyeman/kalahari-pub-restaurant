/**
 * Admin Account Provisioning Script
 * Safely creates or updates a restaurant administrator account using the Supabase Service Role Key.
 *
 * Usage:
 *   npx tsx scripts/provisionAdmin.ts <admin-email> <admin-password>
 *
 * Example:
 *   npx tsx scripts/provisionAdmin.ts owner@kalaharipub.com StrongSecret2026!
 *
 * Developer: Data_Nova
 */

import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "../lib/supabase/config";

async function provisionAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL;
  const password = args[1] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("\n❌ Usage: npx tsx scripts/provisionAdmin.ts <email> <password>");
    console.error("Or define ADMIN_EMAIL and ADMIN_PASSWORD in your environment.\n");
    process.exit(1);
  }

  const { url, serviceRoleKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured || !serviceRoleKey) {
    console.log("\n⚠️  Supabase environment is not configured in .env.local.");
    console.log("In local development mode without cloud credentials, you can log in with:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: (provided in CLI/environment)\n`);
    return;
  }

  console.log(`\nConnecting to Supabase at: ${url}`);
  console.log(`Provisioning administrator account for: ${email}`);

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Check if user already exists
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("❌ Failed to query users:", listError.message);
    process.exit(1);
  }

  const existingUser = usersData.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    console.log(`User ${email} already exists (ID: ${existingUser.id}). Promoting to admin role...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password,
        app_metadata: { role: "admin" },
        email_confirm: true,
      }
    );

    if (updateError) {
      console.error("❌ Failed to update admin role:", updateError.message);
      process.exit(1);
    }
    console.log("✅ Successfully granted administrator role to existing user!");
  } else {
    console.log(`Creating new user with administrator role...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
      user_metadata: { name: "Kalahari Restaurant Owner" },
    });

    if (createError) {
      console.error("❌ Failed to create administrator:", createError.message);
      process.exit(1);
    }
    console.log(`✅ Administrator created successfully! (ID: ${newUser.user.id})`);
  }

  console.log("Admin provisioning completed.\n");
}

provisionAdmin().catch((err) => {
  console.error("Provisioning script failed:", err);
  process.exit(1);
});
