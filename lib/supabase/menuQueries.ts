import { createSupabaseServerClient } from "./server";
import { isSupabaseConfigured } from "./config";
import { toCategory, toMenuItem } from "./adapters";
import { Category, MenuItem } from "@/types";
import { categories as fallbackCategories } from "@/data/categories";
import { menuItems as fallbackMenuItems } from "@/data/menuItems";
import { MenuItemWithCategory } from "@/types/database.types";

export interface MenuQueryResult {
  categories: Category[];
  items: MenuItem[];
  isDatabaseConnected: boolean;
  isFallback: boolean;
  error: string | null;
}

/**
 * Fetches active menu categories and available menu items from Supabase.
 * Respects database Row Level Security (RLS).
 *
 * Behavior:
 * 1. If Supabase credentials are not configured:
 *    Returns fallback demo data with `isFallback: true` and `isDatabaseConnected: false`,
 *    allowing the UI to display a clear development advisory banner.
 * 2. If Supabase IS configured, but query returns an error:
 *    Returns the honest error and empty array (does NOT silently hide database failures).
 * 3. If Supabase query succeeds:
 *    Maps rows to UI models with `isDatabaseConnected: true` and `isFallback: false`.
 */
export async function getLiveMenuData(): Promise<MenuQueryResult> {
  const configured = isSupabaseConfigured();

  // If Supabase environment is not yet set up
  if (!configured) {
    return {
      categories: fallbackCategories,
      items: fallbackMenuItems,
      isDatabaseConnected: false,
      isFallback: true,
      error: null,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return {
        categories: fallbackCategories,
        items: fallbackMenuItems,
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
