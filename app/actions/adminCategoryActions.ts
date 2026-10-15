"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { devAdminStore } from "@/lib/admin/devAdminStore";

export async function saveCategoryAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: "Unauthorized." };
  }

  const id = (formData.get("id") as string)?.trim() || crypto.randomUUID();
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const isEditing = formData.get("is_editing") === "true";

  if (!name || name.length < 2) {
    return { success: false, error: "Category name must be at least 2 characters." };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return { success: false, error: "Database unavailable." };

      if (isEditing) {
        const { error } = await supabase
          .from("menu_categories")
          .update({
            name,
            description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) return { success: false, error: error.message };
      } else {
        const { error } = await supabase.from("menu_categories").insert({
          id,
          name,
          slug,
          description,
          display_order: 10,
          is_active: true,
        });

        if (error) return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Database error.";
      return { success: false, error: msg };
    }
  } else {
    if (isEditing) {
      devAdminStore.updateCategory(id, { name, description });
    } else {
      devAdminStore.createCategory({
        id,
        name,
        slug,
        description,
        image_url: null,
        display_order: 10,
        is_active: true,
      });
    }
  }

  revalidatePath("/menu");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/menu");
  return { success: true };
}
