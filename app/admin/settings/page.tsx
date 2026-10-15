import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getDeliveryConfig, getOperatingHours } from "@/lib/admin/settingsService";
import { SettingsManagerClient } from "./SettingsManagerClient";
import { businessConfig } from "@/lib/businessConfig";

export const metadata: Metadata = {
  title: `Settings | Admin | ${businessConfig.name}`,
};

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const deliveryConfig = await getDeliveryConfig();
  const operatingHours = await getOperatingHours();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="pb-6 border-b border-brand-charcoal-muted">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
            Restaurant Operations
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Business Settings
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Control delivery enablement, zone pricing, opening hours, and integrations
          </p>
        </div>

        <SettingsManagerClient
          initialDelivery={deliveryConfig}
          initialHours={operatingHours}
        />
      </div>
    </div>
  );
}
