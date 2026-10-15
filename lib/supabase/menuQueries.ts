import { createSupabaseServerClient } from "./server";
import { isSupabaseConfigured } from "./config";
import { toCategory, toMenuItem } from "./adapters";
import { Category, MenuItem } from "@/types";
import { categories as fallbackCategories } from "@/data/categories";
import { menuItems as fallbackMenuItems } from "@/data/menuItems";
import { MenuItemWithCategory } from "@/types/database.types";

import { devAdminStore } from "@/lib/admin/devAdminStore";
import { CategoryId } from "@/types";

export interface MenuQueryResult {
  categories: Category[];
  items: MenuItem[];
  isDatabaseConnected: boolean;
  isFallback: boolean;
  error: string | null;
}

function getLocalStoreMenuData(): { categories: Category[]; items: MenuItem[] } {
  const devCats = devAdminStore.getAllCategories();
  const devItems = devAdminStore.getAllMenuItems();

  const categories: Category[] = devCats
    .filter((c) => c.is_active)
    .map(toCategory);

  const items: MenuItem[] = devItems
    .filter((item) => item.is_available)
    .map((item) => {
      const cat = devCats.find((c) => c.id === item.category_id || c.slug === item.category_id);
      return {
        id: item.id,
        name: item.name,
        description: item.description || "",
        category: (cat?.slug || item.category_id || "local-dishes") as CategoryId,
        samplePrice: Number(item.price),
        currency: "GHS",
        image: item.image_url || "/images/placeholder-dish.jpg",
        isAvailable: item.is_available,
        isFeatured: item.is_featured,
        isSamplePrice: Boolean(item.is_sample_price),
        prepTimeNote: item.is_featured ? "House Specialty" : "Prepared fresh",
        tags: item.is_featured ? ["Specialty"] : undefined,
      };
    });

  return {
    categories: categories.length > 0 ? categories : fallbackCategories,
    items: items.length > 0 ? items : fallbackMenuItems,
  };
}

/**
 * Fetches active menu categories and available menu items from Supabase or local store.
 * Respects database Row Level Security (RLS).
 */
export async function getLiveMenuData(): Promise<MenuQueryResult> {
  const configured = isSupabaseConfigured();

  // If Supabase environment is not yet set up, read from dynamic local store
  if (!configured) {
    const local = getLocalStoreMenuData();
    return {
      categories: local.categories,
      items: local.items,
      isDatabaseConnected: false,
      isFallback: true,
      error: null,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      const local = getLocalStoreMenuData();
      return {
        categories: local.categories,
        items: local.items,
        isDatabaseConnected: false,
        isFallback: true,
        error: "Supabase client initialization failed.",
      };
    }

    // 1. Fetch active categories
    const { data: categoriesData, error: catError } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (catError) {
      console.error("[Kalahari Supabase] Error fetching menu_categories:", catError.message);
      return {
        categories: [],
        items: [],
        isDatabaseConnected: true,
        isFallback: false,
        error: `Database category query failed: ${catError.message}`,
      };
    }

    // 2. Fetch active menu items joined with their category
    const { data: itemsData, error: itemsError } = await supabase
      .from("menu_items")
      .select("*, category:menu_categories(*)")
      .eq("is_available", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (itemsError) {
      console.error("[Kalahari Supabase] Error fetching menu_items:", itemsError.message);
      return {
        categories: (categoriesData || []).map(toCategory),
        items: [],
        isDatabaseConnected: true,
        isFallback: false,
        error: `Database menu items query failed: ${itemsError.message}`,
      };
    }

    // Convert database rows to typed UI entities
    const mappedCategories = (categoriesData || []).map(toCategory);
    const mappedItems = ((itemsData || []) as unknown as MenuItemWithCategory[])
      // Filter out items whose joined category is inactive (RLS also enforces this)
      .filter((item) => item.category?.is_active !== false)
      .map(toMenuItem);

    return {
      categories: mappedCategories,
      items: mappedItems,
      isDatabaseConnected: true,
      isFallback: false,
      error: null,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unexpected database connection error occurred.";
    console.error("[Kalahari Supabase] Unexpected exception in getLiveMenuData:", errorMessage);
    return {
      categories: [],
      items: [],
      isDatabaseConnected: true,
      isFallback: false,
      error: errorMessage,
    };
  }
}
