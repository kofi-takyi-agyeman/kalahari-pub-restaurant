"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { devAdminStore } from "@/lib/admin/devAdminStore";

export interface MenuActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Approve Official Price
 * Sets is_sample_price = false, unlocking commercial customer checkout.
 */
export async function approveMenuPriceAction(dishId: string): Promise<MenuActionResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: "Unauthorized." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return { success: false, error: "Database unavailable." };

      const { error } = await supabase
        .from("menu_items")
        .update({
          is_sample_price: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dishId);

      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve price.";
      return { success: false, error: msg };
    }
  } else {
    devAdminStore.approveMenuPrice(dishId);
  }

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/admin");
  return { success: true };
}

/**
 * Server Action: Toggle Dish Availability
 */
export async function toggleMenuAvailabilityAction(dishId: string): Promise<MenuActionResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: "Unauthorized." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return { success: false, error: "Database unavailable." };

      const { data: item } = await supabase
        .from("menu_items")
        .select("is_available")
        .eq("id", dishId)
        .maybeSingle();

      if (!item) return { success: false, error: "Dish not found." };

      const { error } = await supabase
        .from("menu_items")
        .update({
          is_available: !item.is_available,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dishId);

      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle availability.";
      return { success: false, error: msg };
    }
  } else {
    devAdminStore.toggleMenuAvailability(dishId);
  }

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { success: true };
}

/**
 * Server Action: Save / Create Menu Item
 */
export async function saveMenuItemAction(formData: FormData): Promise<MenuActionResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: "Unauthorized." };
  }

  const id = (formData.get("id") as string)?.trim() || crypto.randomUUID();
  const name = (formData.get("name") as string)?.trim();
  const category_id = (formData.get("category_id") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const priceRaw = parseFloat(formData.get("price") as string);
  const is_sample_price = formData.get("is_sample_price") === "true";
  const is_available = formData.get("is_available") !== "false";
  const is_featured = formData.get("is_featured") === "true";
  const image_url = (formData.get("image_url") as string)?.trim() || null;
  const isEditing = formData.get("is_editing") === "true";

  if (!name || name.length < 2) {
    return { success: false, error: "Dish name must be at least 2 characters." };
  }
  if (!category_id) {
    return { success: false, error: "Please select a valid menu category." };
  }
  if (isNaN(priceRaw) || priceRaw <= 0) {
    return { success: false, error: "Price must be a positive number in Ghanaian cedi (GHS)." };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return { success: false, error: "Database unavailable." };

      if (isEditing) {
        const { error } = await supabase
          .from("menu_items")
          .update({
            name,
            category_id,
            description,
            price: priceRaw,
            is_sample_price,
            is_available,
            is_featured,
            image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) return { success: false, error: error.message };
      } else {
        const { error } = await supabase.from("menu_items").insert({
          id,
          name,
          slug,
          category_id,
          description,
          price: priceRaw,
          is_sample_price,
          is_available,
          is_featured,
          image_url,
          display_order: 99,
        });

        if (error) return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Database error.";
      return { success: false, error: msg };
    }
  } else {
    if (isEditing) {
      devAdminStore.updateMenuItem(id, {
        name,
        category_id,
        description,
        price: priceRaw,
        is_sample_price,
        is_available,
        is_featured,
        image_url,
      });
    } else {
      devAdminStore.createMenuItem({
        id,
        name,
        slug,
        category_id,
        description,
        price: priceRaw,
        is_sample_price,
        is_available,
        is_featured,
        image_url,
        display_order: 99,
      });
    }
  }

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/admin");
  return { success: true };
}

/**
 * Server Action: Delete Menu Item
 */
export async function deleteMenuItemAction(dishId: string): Promise<MenuActionResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: "Unauthorized." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return { success: false, error: "Database unavailable." };

      const { error } = await supabase.from("menu_items").delete().eq("id", dishId);
      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Database error.";
      return { success: false, error: msg };
    }
  } else {
    devAdminStore.deleteMenuItem(dishId);
  }

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { success: true };
}
