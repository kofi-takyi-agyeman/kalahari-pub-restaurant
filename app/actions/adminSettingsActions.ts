"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { updateSettingOnServer } from "@/lib/admin/settingsService";
import { DeliveryConfig, OperatingHoursConfig } from "@/types/database.types";

export async function saveDeliverySettingsAction(
  config: DeliveryConfig
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: "Unauthorized." };
  }

  // Validate zones
  if (config.enabled) {
    if (!config.zones || config.zones.length === 0) {
      return {
        success: false,
        error: "At least one delivery zone and fee must be defined when delivery is enabled.",
      };
    }

    for (const z of config.zones) {
      if (!z.area || z.area.trim().length < 2) {
        return { success: false, error: "Zone area name is required." };
      }
      if (typeof z.fee !== "number" || z.fee < 0) {
        return { success: false, error: `Invalid fee for zone "${z.area}". Must be a non-negative amount.` };
      }
    }
  }

  const result = await updateSettingOnServer("delivery_config", config);
  if (result.success) {
    revalidatePath("/checkout");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");
  }
  return result;
}

export async function saveOperatingHoursAction(
  config: OperatingHoursConfig
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: "Unauthorized." };
  }

  const result = await updateSettingOnServer("operating_hours", config);
  if (result.success) {
    revalidatePath("/admin/settings");
    revalidatePath("/contact");
    revalidatePath("/");
  }
  return result;
}
