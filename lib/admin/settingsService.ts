/**
 * Operational Settings Service
 * Retrieves and updates restaurant configuration from Supabase or local store.
 * Kalahari Pub & Restaurant — Phases 4 & 5
 */

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { devAdminStore } from "./devAdminStore";
import { DeliveryConfig, OperatingHoursConfig, Json } from "@/types/database.types";

export const DEFAULT_DELIVERY_CONFIG: DeliveryConfig = {
  enabled: false,
  policy_notice: "Pending owner delivery fee and coverage ratification",
  zones: [
    { area: "A-Lang", fee: 15.0 },
    { area: "Sowutuom", fee: 20.0 },
    { area: "Kwashieman", fee: 25.0 },
    { area: "Santa Maria", fee: 25.0 },
  ],
  min_order: 0.0,
};

export const DEFAULT_HOURS_CONFIG: OperatingHoursConfig = {
  monday_saturday: "10:00 AM - 11:00 PM",
  sunday: "12:00 PM - 11:00 PM",
  pickup_enabled: true,
  location: "Kalahari Pub, A-Lang Taxi Rank",
};

export async function getDeliveryConfig(): Promise<DeliveryConfig> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("restaurant_settings")
          .select("value")
          .eq("key", "delivery_config")
          .maybeSingle();

        if (!error && data?.value) {
          return data.value as unknown as DeliveryConfig;
        }
      }
    } catch (err) {
      console.error("[Settings Service] Error reading delivery_config from DB:", err);
    }
  }

  return devAdminStore.getSettings<DeliveryConfig>("delivery_config") || DEFAULT_DELIVERY_CONFIG;
}

export async function getOperatingHours(): Promise<OperatingHoursConfig> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("restaurant_settings")
          .select("value")
          .eq("key", "operating_hours")
          .maybeSingle();

        if (!error && data?.value) {
          return data.value as unknown as OperatingHoursConfig;
        }
      }
    } catch (err) {
      console.error("[Settings Service] Error reading operating_hours from DB:", err);
    }
  }

  return devAdminStore.getSettings<OperatingHoursConfig>("operating_hours") || DEFAULT_HOURS_CONFIG;
}

export async function updateSettingOnServer(
  key: string,
  value: DeliveryConfig | OperatingHoursConfig | Json
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return { success: false, error: "Database client failed." };

      const { error } = await supabase.from("restaurant_settings").upsert({
        key,
        value: value as unknown as Json,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update setting.";
      return { success: false, error: msg };
    }
  }

  devAdminStore.updateSettings(key, value);
  return { success: true };
}
