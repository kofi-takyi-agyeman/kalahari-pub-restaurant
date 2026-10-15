import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminOrders, getAdminMenuItems } from "@/lib/admin/adminDataService";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Operational Reports | Admin | ${businessConfig.name}`,
};

export default async function AdminReportsPage() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const orders = await getAdminOrders();
  const menuItems = await getAdminMenuItems();

  // Metrics computation from real database records
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "preparing", "ready"].includes(o.status)
  );

  const pickupOrdersCount = orders.filter((o) => o.order_type === "pickup").length;
  const deliveryOrdersCount = orders.filter((o) => o.order_type === "delivery").length;

  const completedRevenueGHS = completedOrders.reduce(
    (sum, o) => sum + (Number(o.total) || 0),
    0
  );

  const avgCompletedValueGHS =
    completedOrders.length > 0 ? completedRevenueGHS / completedOrders.length : 0;

  // Top selling dishes by frequency
  const dishCounts: Record<string, { name: string; count: number; totalGHS: number }> = {};
  for (const o of orders) {
    if (o.status !== "cancelled") {
      for (const item of o.order_items) {
        if (!dishCounts[item.item_name]) {
          dishCounts[item.item_name] = { name: item.item_name, count: 0, totalGHS: 0 };
        }
        dishCounts[item.item_name].count += item.quantity;
        dishCounts[item.item_name].totalGHS += Number(item.line_total) || 0;
      }
    }
  }

  const topDishes = Object.values(dishCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-brand-charcoal-muted">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
            Business Insights
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Operational Reports &amp; Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Genuine sales metrics, fulfillment breakdowns, and popular dishes for {businessConfig.name}
          </p>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Fulfilled Revenue
            </span>
            <div className="text-3xl font-black text-emerald-400">
              {formatCurrency(completedRevenueGHS)}
            </div>
            <p className="text-[11px] text-gray-400">
              From {completedOrders.length} completed customer orders
            </p>
          </div>

          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Average Order Value
            </span>
            <div className="text-3xl font-black text-white">
              {formatCurrency(avgCompletedValueGHS)}
            </div>
            <p className="text-[11px] text-gray-400">
              Per completed pickup/delivery transaction
            </p>
          </div>

          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Orders Logged
            </span>
            <div className="text-3xl font-black text-white">{totalOrders}</div>
            <p className="text-[11px] text-gray-400">
              {activeOrders.length} in pipeline &bull; {cancelledOrders.length} cancelled
            </p>
          </div>

          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Menu Item Availability
            </span>
            <div className="text-3xl font-black text-white">
              {menuItems.filter((i) => i.is_available).length} / {menuItems.length}
            </div>
            <p className="text-[11px] text-gray-400">
              Active dishes available for online discovery
            </p>
          </div>
        </div>

        {/* 2-Column Grid: Fulfillment & Top Dishes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Fulfillment Breakdown */}
          <div className="lg:col-span-5 bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-base font-bold text-white pb-3 border-b border-brand-charcoal-muted">
              Fulfillment Method Distribution
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5 font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-brand-red" />
                    <span>Self Pickup (A-Lang Taxi Rank)</span>
                  </span>
                  <span>{pickupOrdersCount} ({totalOrders ? Math.round((pickupOrdersCount / totalOrders) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-brand-charcoal overflow-hidden border border-brand-charcoal-muted">
                  <div
                    className="h-full bg-brand-red rounded-full"
                    style={{
                      width: `${totalOrders ? (pickupOrdersCount / totalOrders) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-brand-yellow" />
                    <span>Home &amp; Office Delivery</span>
                  </span>
                  <span>{deliveryOrdersCount} ({totalOrders ? Math.round((deliveryOrdersCount / totalOrders) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-brand-charcoal overflow-hidden border border-brand-charcoal-muted">
                  <div
                    className="h-full bg-brand-yellow rounded-full"
                    style={{
                      width: `${totalOrders ? (deliveryOrdersCount / totalOrders) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-charcoal border border-brand-charcoal-muted text-[11px] text-gray-400 leading-relaxed">
              <strong>Reporting Integrity Notice:</strong> Revenue calculations strictly tally orders in status <span className="text-white font-bold">COMPLETED</span>. Orders in pending or cancelled states are excluded from confirmed gross turnover.
            </div>
          </div>

          {/* Top Selling Dishes Table */}
          <div className="lg:col-span-7 bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-base font-bold text-white pb-3 border-b border-brand-charcoal-muted flex items-center justify-between">
              <span>Top Dishes by Ordering Volume</span>
              <UtensilsCrossed className="w-4 h-4 text-brand-yellow" />
            </h3>

            {topDishes.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                Dishes will rank here as orders are submitted.
              </p>
            ) : (
              <div className="divide-y divide-brand-charcoal-muted/50 text-xs">
                {topDishes.map((dish, rank) => (
                  <div
                    key={dish.name}
                    className="py-3.5 first:pt-0 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-charcoal border border-brand-charcoal-muted text-[11px] font-bold text-brand-yellow flex items-center justify-center">
                        {rank + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white text-sm block">{dish.name}</span>
                        <span className="text-gray-400 text-[11px]">
                          {dish.count} {dish.count === 1 ? "portion ordered" : "portions ordered"}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      {formatCurrency(dish.totalGHS)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
