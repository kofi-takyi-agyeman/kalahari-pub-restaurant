/**
 * Kalahari Pub & Restaurant — Production Menu & Categories Seeder Script
 * Developer: Data_Nova
 *
 * Description:
 * Connects to Supabase and populates menu_categories and menu_items tables
 * with idempotent upsert operations derived directly from canonical menu data.
 *
 * Usage:
 * npm run db:seed
 */

import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { categories as defaultCategories } from "../data/categories";
import { menuItems as defaultMenuItems } from "../data/menuItems";

type CategoryInsert = Database["public"]["Tables"]["menu_categories"]["Insert"];
type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer SERVICE_ROLE_KEY for administrative seeding to bypass RLS, or ANON_KEY if write policy permits
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Seeder Error: Missing Supabase credentials.");
  console.error(
    "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in .env.local."
  );
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log("🌱 Starting Kalahari Pub & Restaurant Production Menu Seed...");

  // 1. Categories
  const categories: CategoryInsert[] = defaultCategories.map((cat, index) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.id,
    description: cat.description,
    image_url: cat.image,
    display_order: index + 1,
    is_active: true,
  }));

  console.log(`📦 Upserting ${categories.length} categories...`);
  const { error: catError } = await supabase
    .from("menu_categories")
    .upsert(categories, { onConflict: "id" });

  if (catError) {
    console.error("❌ Failed to upsert categories:", catError.message);
    process.exit(1);
  }
  console.log("✅ Categories successfully synced.");

  // 2. Menu Items (17 Authentic Dishes & Drinks)
  const items: MenuItemInsert[] = defaultMenuItems.map((dish, index) => ({
    id: dish.id,
    category_id: dish.category,
    name: dish.name,
    slug: dish.id,
    description: dish.description,
    image_url: dish.image,
    price: dish.samplePrice,
    is_sample_price: dish.isSamplePrice,
    is_available: dish.isAvailable,
    is_featured: Boolean(dish.isFeatured),
    display_order: index + 1,
  }));

  console.log(`🥘 Upserting ${items.length} menu items...`);
  const { error: itemsError } = await supabase
    .from("menu_items")
    .upsert(items, { onConflict: "id" });

  if (itemsError) {
    console.error("❌ Failed to upsert menu items:", itemsError.message);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded all ${items.length} menu items and beverages!`);
  console.log("ℹ️ Items with unratified prices are flagged with is_sample_price: true.");
}

runSeed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
