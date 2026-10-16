"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DeliveryConfig, OperatingHoursConfig, DeliveryZone } from "@/types/database.types";
import {
  saveDeliverySettingsAction,
  saveOperatingHoursAction,
} from "@/app/actions/adminSettingsActions";
import { formatCurrency } from "@/lib/utils";
import {
  Truck,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  CreditCard,
  Bell,
} from "lucide-react";

interface SettingsManagerClientProps {
  initialDelivery: DeliveryConfig;
  initialHours: OperatingHoursConfig;
}

export function SettingsManagerClient({
  initialDelivery,
  initialHours,
}: SettingsManagerClientProps) {
  const router = useRouter();

  // Delivery state
  const [deliveryEnabled, setDeliveryEnabled] = useState(initialDelivery.enabled);
  const [zones, setZones] = useState<DeliveryZone[]>(initialDelivery.zones || []);
  const [newZoneArea, setNewZoneArea] = useState("");
  const [newZoneFee, setNewZoneFee] = useState("");

  // Operating Hours state
  const [mondaySaturday, setMondaySaturday] = useState(initialHours.monday_saturday);
  const [sunday, setSunday] = useState(initialHours.sunday);
  const [pickupEnabled, setPickupEnabled] = useState(initialHours.pickup_enabled);

  // Status & Feedback
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);
  const [isSavingHours, setIsSavingHours] = useState(false);
  const [deliveryMsg, setDeliveryMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hoursMsg, setHoursMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddZone = () => {
    if (!newZoneArea.trim()) return;
    const fee = parseFloat(newZoneFee);
    if (isNaN(fee) || fee < 0) return;

    setZones([...zones, { area: newZoneArea.trim(), fee }]);
    setNewZoneArea("");
    setNewZoneFee("");
  };

  const handleRemoveZone = (index: number) => {
    setZones(zones.filter((_, i) => i !== index));
  };

  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDelivery(true);
    setDeliveryMsg(null);

    const config: DeliveryConfig = {
      enabled: deliveryEnabled,
      policy_notice: deliveryEnabled ? undefined : "Pending owner delivery fee and coverage ratification",
      zones,
      min_order: initialDelivery.min_order || 0,
    };

    const result = await saveDeliverySettingsAction(config);
    setIsSavingDelivery(false);
    if (result.success) {
      setDeliveryMsg({ type: "success", text: "Delivery settings updated successfully!" });
      router.refresh();
    } else {
      setDeliveryMsg({ type: "error", text: result.error || "Failed to update delivery settings." });
    }
  };

  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHours(true);
    setHoursMsg(null);

    const config: OperatingHoursConfig = {
      monday_saturday: mondaySaturday,
      sunday,
      pickup_enabled: pickupEnabled,
      location: initialHours.location,
    };

    const result = await saveOperatingHoursAction(config);
    setIsSavingHours(false);
    if (result.success) {
      setHoursMsg({ type: "success", text: "Hours and fulfillment updated successfully!" });
      router.refresh();
    } else {
      setHoursMsg({ type: "error", text: result.error || "Failed to update operating hours." });
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Delivery Configuration Section */}
      <form
        onSubmit={handleSaveDelivery}
        className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-charcoal-muted">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white">
                Delivery Enablement &amp; Fee Schedule
              </h2>
              <p className="text-xs text-gray-400">
                Activate online delivery and set approved zone fees in Ghanaian cedi (GHS)
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs font-bold text-gray-300">
              {deliveryEnabled ? (
                <span className="text-emerald-400 font-black">DELIVERY ENABLED</span>
              ) : (
                <span className="text-amber-400 font-bold">DELIVERY HELD</span>
              )}
            </span>
            <input
              type="checkbox"
              checked={deliveryEnabled}
              onChange={(e) => setDeliveryEnabled(e.target.checked)}
              className="w-5 h-5 rounded text-brand-yellow focus:ring-brand-yellow bg-brand-charcoal border-brand-charcoal-muted cursor-pointer"
            />
          </label>
        </div>

        {deliveryMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
              deliveryMsg.type === "success"
                ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                : "bg-red-950/60 border-red-800 text-red-200"
            }`}
          >
            {deliveryMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <span>{deliveryMsg.text}</span>
          </div>
        )}

        {!deliveryEnabled ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
            <strong className="text-white block font-bold">
              Notice: Online Delivery Orders Currently Held
            </strong>
            <p className="leading-relaxed">
              Per restaurant policy, automated checkout blocks delivery orders when disabled. Check &quot;Delivery Enabled&quot; above, confirm your approved zones and fees below, and click &quot;Save Delivery Settings&quot; to open delivery to customers.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
            <strong className="text-white block font-bold">
              Delivery Active for Approved Zones
            </strong>
            <p className="leading-relaxed">
              Customers ordering to any of the approved zones below will have the corresponding delivery fee automatically computed and included on the server.
            </p>
          </div>
        )}

        {/* Zones Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Approved Delivery Zones &amp; Flat Charges
          </h3>

          <div className="border border-brand-charcoal-muted rounded-2xl overflow-hidden divide-y divide-brand-charcoal-muted/60 text-xs">
            {zones.map((zone, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between bg-brand-charcoal">
                <span className="font-bold text-white text-sm">{zone.area}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-brand-yellow text-sm">
                    {formatCurrency(zone.fee)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveZone(idx)}
                    className="p-1 text-gray-500 hover:text-red-400"
                    title="Remove zone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Zone Inline Controls */}
          <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-charcoal-muted grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
            <div className="sm:col-span-6">
              <label className="block text-gray-400 font-bold mb-1">Area / Neighborhood</label>
              <input
                type="text"
                value={newZoneArea}
                onChange={(e) => setNewZoneArea(e.target.value)}
                placeholder="e.g. A-Lang, Sowutuom, Kwashieman..."
                className="w-full px-3 py-2 rounded-xl bg-brand-charcoal-card border border-brand-charcoal-muted text-white text-xs placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-gray-400 font-bold mb-1">Delivery Fee (GHS)</label>
              <input
                type="number"
                step="1"
                min="0"
                value={newZoneFee}
                onChange={(e) => setNewZoneFee(e.target.value)}
                placeholder="e.g. 20"
                className="w-full px-3 py-2 rounded-xl bg-brand-charcoal-card border border-brand-charcoal-muted text-white text-xs placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddZone}
                className="w-full py-2 px-3 rounded-xl bg-brand-charcoal-card hover:bg-white/10 border border-brand-charcoal-muted text-brand-yellow font-bold text-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSavingDelivery}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-black transition-all shadow-md active:scale-98 disabled:opacity-60"
          >
            {isSavingDelivery ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>Save Delivery Settings</span>
          </button>
        </div>
      </form>

      {/* 2. Operating Hours & Fulfillment Section */}
      <form
        onSubmit={handleSaveHours}
        className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-charcoal-muted">
          <div className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white">
              Operating Hours &amp; Pickup Fulfillment
            </h2>
            <p className="text-xs text-gray-400">
              Kitchen opening times and self-collection availability
            </p>
          </div>
        </div>

        {hoursMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
              hoursMsg.type === "success"
                ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                : "bg-red-950/60 border-red-800 text-red-200"
            }`}
          >
            {hoursMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <span>{hoursMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 font-bold mb-1">Monday – Saturday Hours</label>
            <input
              type="text"
              value={mondaySaturday}
              onChange={(e) => setMondaySaturday(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-bold mb-1">Sunday Hours</label>
            <input
              type="text"
              value={sunday}
              onChange={(e) => setSunday(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        {/* Pickup Toggle */}
        <label className="flex items-start gap-3 p-4 rounded-2xl bg-brand-charcoal border border-brand-charcoal-muted cursor-pointer hover:border-brand-yellow/40 transition-colors">
          <input
            type="checkbox"
            checked={pickupEnabled}
            onChange={(e) => setPickupEnabled(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brand-yellow focus:ring-brand-yellow bg-brand-charcoal-card border-brand-charcoal-muted"
          />
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-white block">
              Pickup at Kalahari Dine Enabled ({initialHours.location})
            </span>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Allows customers to place pickup orders for in-person collection with zero delivery charges.
            </p>
          </div>
        </label>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSavingHours}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-black transition-all shadow-md active:scale-98 disabled:opacity-60"
          >
            {isSavingHours ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>Save Operating Hours</span>
          </button>
        </div>
      </form>

      {/* 3. Integrations Status Cards (Payments & Notifications) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Payments Status */}
        <div className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 space-y-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <CreditCard className="w-4 h-4 text-brand-yellow" />
            <span className="font-bold uppercase tracking-wider">Online Payment Gateways</span>
          </div>
          <h3 className="font-display text-sm font-bold text-white">
            Mobile Money &amp; Card Payments: Pending Credentials
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Per Phase 5 architecture, the online payment integration interface is ready for Paystack or Hubtel. Payment remains in cash/pay-at-pickup mode until the owner supplies merchant API keys in production configuration.
          </p>
          <div className="pt-2 text-[11px] text-brand-yellow font-medium">
            Active Mode: Pay at Pickup / Direct Transfer
          </div>
        </div>

        {/* Notifications Status */}
        <div className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 space-y-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Bell className="w-4 h-4 text-brand-red" />
            <span className="font-bold uppercase tracking-wider">Automated SMS Gateways</span>
          </div>
          <h3 className="font-display text-sm font-bold text-white">
            SMS &amp; External Notifications: Pending Provider Setup
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Direct telephone dials and one-click WhatsApp summary links are active. Automated SMS integration (e.g. Hubtel SMS / Arkesel) is prepared and can be linked when SMS credentials are configured.
          </p>
          <div className="pt-2 text-[11px] text-brand-yellow font-medium">
            Active Mode: In-Dashboard Alert + Direct WhatsApp Links
          </div>
        </div>
      </div>
    </div>
  );
}
