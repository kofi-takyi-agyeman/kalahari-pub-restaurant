/**
 * Kalahari Pub & Restaurant — Demonstration Menu Seeder Script
 * Developer: Data_Nova
 *
 * Description:
 * Connects to Supabase and populates the menu_categories and menu_items tables
 * with idempotent upsert operations.
 *
 * Usage:
 * npx tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

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
  console.log("🌱 Starting Kalahari Pub & Restaurant Menu Seed...");

  // 1. Categories
  const categories: CategoryInsert[] = [
    {
      id: "c0000001-0000-0000-0000-000000000001",
      name: "Local Dishes",
      slug: "local-dishes",
      description: "Authentic Ghanaian soups, swallows, and stews prepared with traditional aromatic spices.",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      display_order: 1,
      is_active: true,
    },
    {
      id: "c0000001-0000-0000-0000-000000000002",
      name: "Grilled Food",
      slug: "grilled-food",
      description: "Charcoal-grilled whole tilapia, seasoned meats, and savory kebabs hot off the flames.",
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      display_order: 2,
      is_active: true,
    },
    {
      id: "c0000001-0000-0000-0000-000000000003",
      name: "Rice Meals",
      slug: "rice-meals",
      description: "Richly spiced Ghanaian Jollof rice, fried rice, and succulent protein pairings.",
      image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      display_order: 3,
      is_active: true,
    },
    {
      id: "c0000001-0000-0000-0000-000000000004",
      name: "Drinks",
      slug: "drinks",
      description: "Chilled lagers, stout, malt, soft drinks, and cold pub beverages.",
      image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
      display_order: 4,
      is_active: true,
    },
  ];

  console.log(`📦 Upserting ${categories.length} categories...`);
  const { error: catError } = await supabase
    .from("menu_categories")
    .upsert(categories, { onConflict: "slug" });

  if (catError) {
    console.error("❌ Failed to upsert categories:", catError.message);
    process.exit(1);
  }
  console.log("✅ Categories successfully synced.");

  // 2. Menu Items
  const items: MenuItemInsert[] = [
    {
      id: "d0000001-0000-0000-0000-000000000001",
      category_id: "c0000001-0000-0000-0000-000000000001",
      name: "Banku and Tilapia with Okro Stew",
      slug: "banku-tilapia-okro-stew",
      description: "Freshly molded corn and cassava dough paired with seasoned grilled tilapia fish and rich, savory Ghanaian okro stew.",
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      price: 95.0,
      is_sample_price: true,
      is_available: true,
      is_featured: true,
      display_order: 1,
    },
    {
      id: "d0000001-0000-0000-0000-000000000002",
      category_id: "c0000001-0000-0000-0000-000000000001",
      name: "Fufu with Goat Meat and Okro Soup",
      slug: "fufu-goat-meat-okro-soup",
      description: "Soft, silky pounded cassava and plantain fufu served submerged in traditional seasoned okro soup with tender goat meat pieces.",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      price: 85.0,
      is_sample_price: true,
      is_available: true,
      is_featured: true,
      display_order: 2,
    },
    {
      id: "d0000001-0000-0000-0000-000000000003",
      category_id: "c0000001-0000-0000-0000-000000000001",
      name: "Omo Tuo with Assorted Meat",
      slug: "omo-tuo-assorted-meat",
      description: "Smooth, rounded rice balls paired with rich groundnut (peanut) soup or palm nut soup, enriched with assorted meats and fish.",
      image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      price: 75.0,
      is_sample_price: true,
      is_available: true,
      is_featured: true,
      display_order: 3,
    },
    {
      id: "d0000001-0000-0000-0000-000000000004",
      category_id: "c0000001-0000-0000-0000-000000000002",
      name: "Charcoal Grilled Tilapia",
      slug: "charcoal-grilled-tilapia",
      description: "Whole fresh tilapia seasoned with ginger, garlic, chili, and local spices, charcoal-grilled to smoky tenderness and served with hot shito and sliced onions.",
      image_url: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
      price: 110.0,
      is_sample_price: true,
      is_available: true,
      is_featured: true,
      display_order: 4,
    },
    {
      id: "d0000001-0000-0000-0000-000000000005",
      category_id: "c0000001-0000-0000-0000-000000000003",
      name: "Ghanaian Jollof Rice with Chicken",
      slug: "jollof-rice-with-chicken",
      description: "Smoky, aromatic long-grain rice slow-cooked in rich seasoned tomato stew, served with seasoned fried chicken, fried sweet plantain (kelewele), and coleslaw.",
      image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
      price: 60.0,
      is_sample_price: true,
      is_available: true,
      is_featured: true,
      display_order: 5,
    },
    {
      id: "d0000001-0000-0000-0000-000000000006",
      category_id: "c0000001-0000-0000-0000-000000000001",
      name: "Fufu with Light Soup",
      slug: "fufu-with-light-soup",
      description: "Classic Ghanaian fufu served in fragrant, spicy tomato-based light soup loaded with seasoned fish and assorted meat cuts.",
      image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
      price: 80.0,
      is_sample_price: true,
      is_available: true,
      is_featured: true,
      display_order: 6,
    },
    {
      id: "d0000001-0000-0000-0000-000000000007",
      category_id: "c0000001-0000-0000-0000-000000000001",
      name: "Kokonte with Palm Nut Soup",
      slug: "kokonte-with-palm-nut-soup",
      description: "Hearty brown cassava flour swallow accompanied by richly simmered aromatic palm nut soup and slow-cooked meat cuts.",
      image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
      price: 70.0,
      is_sample_price: true,
      is_available: true,
      is_featured: true,
      display_order: 7,
    },
    {
      id: "d0000001-0000-0000-0000-000000000008",
      category_id: "c0000001-0000-0000-0000-000000000002",
      name: "Grilled Spiced Quarter Chicken",
      slug: "grilled-spiced-quarter-chicken",
      description: "Juicy chicken quarter marinated in Ghanaian pepper blend, flame-grilled and served with chili glaze and fresh garnish.",
      image_url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
      price: 65.0,
      is_sample_price: true,
      is_available: true,
      is_featured: false,
      display_order: 8,
    },
    {
      id: "d0000001-0000-0000-0000-000000000009",
      category_id: "c0000001-0000-0000-0000-000000000003",
      name: "Kalahari Special Fried Rice",
      slug: "kalahari-special-fried-rice",
      description: "Wok-tossed rice with crisp diced bell peppers, carrots, spring onions, and oriental spices, served with golden crispy chicken.",
      image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
      price: 60.0,
      is_sample_price: true,
      is_available: true,
      is_featured: false,
      display_order: 9,
    },
    {
      id: "d0000001-0000-0000-0000-000000000010",
      category_id: "c0000001-0000-0000-0000-000000000004",
      name: "Chilled Club / Star Lager Beer (Large)",
      slug: "chilled-club-star-lager-beer",
      description: "Ice-cold large bottle of Ghana crisp lager beer, straight from the Kalahari pub cooler.",
      image_url: "https://images.unsplash.com/photo-1608270116666-3d23f7bb54c9?auto=format&fit=crop&w=800&q=80",
      price: 25.0,
      is_sample_price: true,
      is_available: true,
      is_featured: false,
      display_order: 10,
    },
    {
      id: "d0000001-0000-0000-0000-000000000011",
      category_id: "c0000001-0000-0000-0000-000000000004",
      name: "Guinness Foreign Extra Stout",
      slug: "guinness-foreign-extra-stout",
      description: "Rich, dark, and bittersweet iconic stout served chilled.",
      image_url: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=80",
      price: 28.0,
      is_sample_price: true,
      is_available: true,
      is_featured: false,
      display_order: 11,
    },
    {
      id: "d0000001-0000-0000-0000-000000000012",
      category_id: "c0000001-0000-0000-0000-000000000004",
      name: "Chilled Malta Guinness / Alvaro",
      slug: "chilled-malta-guinness-alvaro",
      description: "Non-alcoholic nourishing malt beverage or refreshing malted pear drink served ice-cold.",
      image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
      price: 18.0,
      is_sample_price: true,
      is_available: true,
      is_featured: false,
      display_order: 12,
    },
  ];

  console.log(`🥘 Upserting ${items.length} menu items...`);
  const { error: itemsError } = await supabase
    .from("menu_items")
    .upsert(items, { onConflict: "slug" });

  if (itemsError) {
    console.error("❌ Failed to upsert menu items:", itemsError.message);
    process.exit(1);
  }

  console.log("✅ Successfully seeded all 12 demonstration dishes and beverages!");
  console.log("ℹ️ All dishes are flagged with is_sample_price: true.");
}

runSeed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
