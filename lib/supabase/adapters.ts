import { Category, CategoryId, MenuItem } from "@/types";
import { MenuCategoryRow, MenuItemWithCategory } from "@/types/database.types";

/**
 * Maps a Supabase menu_categories row to the UI Category interface
 */
export function toCategory(row: MenuCategoryRow): Category {
  return {
    id: row.slug as CategoryId,
    name: row.name,
    description: row.description || "",
    image: row.image_url || "/images/placeholder-category.jpg",
  };
}

/**
 * Maps a Supabase menu_items row to the UI MenuItem interface
 */
export function toMenuItem(row: MenuItemWithCategory): MenuItem {
  // Determine category slug from joined category or fallback
  const categorySlug = (row.category?.slug || "local-dishes") as CategoryId;

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    category: categorySlug,
    samplePrice: Number(row.price),
    currency: "GHS",
    image: row.image_url || "/images/placeholder-dish.jpg",
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    isSamplePrice: row.is_sample_price !== undefined ? Boolean(row.is_sample_price) : true,
    prepTimeNote: row.is_featured ? "House Specialty" : "Prepared fresh",
    tags: row.is_featured ? ["Specialty"] : undefined,
  };
}
