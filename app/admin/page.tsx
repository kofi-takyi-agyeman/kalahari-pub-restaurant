import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminDashboardMetrics } from "@/lib/admin/adminDataService";
import { getDeliveryConfig } from "@/lib/admin/settingsService";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UtensilsCrossed,
  ArrowRight,
  TrendingUp,
  MapPin,
  Settings,
  Plus,
  Truck,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Dashboard Overview | Admin | ${businessConfig.name}`,
};

export default async function AdminDashboardOverviewPage() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const metrics = await getAdminDashboardMetrics();
  const deliveryConfig = await getDeliveryConfig();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-charcoal-muted">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
              Management Portal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Operational Overview
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Live database status for {businessConfig.name} ({businessConfig.location})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-bold transition-all shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Incoming Queue ({metrics.counts.pending})</span>
            </Link>

            <Link
              href="/admin/menu/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-charcoal-card hover:bg-white/10 border border-brand-charcoal-muted text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Add Dish</span>
            </Link>

            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-charcoal-card hover:bg-white/10 border border-brand-charcoal-muted text-gray-300 text-xs font-bold transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Operational Status Alerts */}
        {metrics.counts.pending > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <strong className="text-sm font-bold text-white block">
                  {metrics.counts.pending} New Order{metrics.counts.pending === 1 ? "" : "s"} Awaiting Staff Review
                </strong>
                <span className="text-xs text-amber-200/80">
                  Please confirm dish availability with the kitchen and contact the customer by phone.
                </span>
              </div>
            </div>
            <Link
              href="/admin/orders?status=pending"
              className="px-3 py-1.5 rounded-lg bg-brand-yellow text-brand-charcoal font-bold text-xs shrink-0"
            >
              Review Now
            </Link>
          </div>
        )}

        {metrics.menuStats.samplePriceCount > 0 && (
          <div className="p-4 rounded-2xl bg-brand-charcoal-card border border-brand-charcoal-muted text-xs flex items-center justify-between gap-3 text-gray-300">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-brand-yellow shrink-0" />
              <span>
                <strong className="text-white font-bold">{metrics.menuStats.samplePriceCount} dishes</strong> currently have unconfirmed demonstration prices. Online customer orders remain blocked for these dishes until approved.
              </span>
            </div>
            <Link
              href="/admin/menu?filter=sample"
              className="text-brand-yellow hover:underline font-bold shrink-0"
            >
              Review Prices &rarr;
            </Link>
          </div>
        )}

        {/* 4-Card Primary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Pending Queue */}
          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-3">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span className="font-bold uppercase tracking-wider">Pending Orders</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{metrics.counts.pending}</div>
            <p className="text-[11px] text-gray-400">
              {metrics.counts.confirmed + metrics.counts.preparing + metrics.counts.ready} in kitchen preparation
            </p>
          </div>

          {/* Card 2: Completed Sales */}
          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-3">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span className="font-bold uppercase tracking-wider">Completed Sales</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {formatCurrency(metrics.revenue.completedSalesGHS)}
            </div>
            <p className="text-[11px] text-gray-400">
              {metrics.counts.completed} fulfilled customer orders
            </p>
          </div>

          {/* Card 3: Pending Order Pipeline */}
          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-3">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span className="font-bold uppercase tracking-wider">Pending Order Volume</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {formatCurrency(metrics.revenue.pendingPipelineGHS)}
            </div>
            <p className="text-[11px] text-gray-400">
              Orders awaiting completion/payment
            </p>
          </div>

          {/* Card 4: Menu Items Overview */}
          <div className="bg-brand-charcoal-card p-5 sm:p-6 rounded-2xl border border-brand-charcoal-muted space-y-3">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span className="font-bold uppercase tracking-wider">Menu Catalog</span>
              <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{metrics.menuStats.totalItems} Dishes</div>
            <p className="text-[11px] text-gray-400">
              {metrics.menuStats.availableItems} active &bull; {metrics.menuStats.unavailableItems} out of stock
            </p>
          </div>
        </div>

        {/* Operational Status Pill Row */}
        <div className="p-4 rounded-2xl bg-brand-charcoal-card border border-brand-charcoal-muted grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-brand-red shrink-0" />
            <div>
              <span className="text-gray-400 block font-medium">Pickup Service:</span>
              <span className="font-bold text-white">Active at A-Lang Taxi Rank</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-brand-yellow shrink-0" />
            <div>
              <span className="text-gray-400 block font-medium">Delivery Service:</span>
              <span className="font-bold text-white">
                {deliveryConfig.enabled ? (
                  <span className="text-emerald-400">Active ({deliveryConfig.zones.length} zones configured)</span>
                ) : (
                  <span className="text-amber-400">Pending Fee Ratification</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-gray-400 block font-medium">Primary Kitchen Phone:</span>
              <span className="font-bold text-white">{businessConfig.phones[0].formatted}</span>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-charcoal-muted">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Recent Orders Stream
              </h2>
              <p className="text-xs text-gray-400">
                Latest customer submissions recorded in the database
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-yellow hover:underline"
            >
              <span>View All ({metrics.counts.total})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics.recentOrders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-sm font-bold text-gray-400">No orders received yet.</p>
              <p className="text-xs text-gray-500">
                Incoming orders from the customer storefront will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-charcoal-muted text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pr-4">Order Ref</th>
                    <th className="pb-3 px-4">Customer</th>
                    <th className="pb-3 px-4">Fulfillment</th>
                    <th className="pb-3 px-4">Items</th>
                    <th className="pb-3 px-4">Total</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-charcoal-muted/50">
                  {metrics.recentOrders.map((order) => {
                    const statusColors: Record<string, string> = {
                      pending: "bg-amber-500/10 text-amber-300 border-amber-500/30",
                      confirmed: "bg-blue-500/10 text-blue-300 border-blue-500/30",
                      preparing: "bg-purple-500/10 text-purple-300 border-purple-500/30",
                      ready: "bg-teal-500/10 text-teal-300 border-teal-500/30",
                      completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                      cancelled: "bg-red-500/10 text-red-300 border-red-500/30",
                    };

                    return (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 pr-4 font-mono font-bold text-white">
                          {order.order_number}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{order.customer_name}</span>
                          <span className="text-[11px] text-gray-400">{order.customer_phone}</span>
                        </td>
                        <td className="py-3.5 px-4 capitalize text-gray-300">
                          {order.order_type}
                        </td>
                        <td className="py-3.5 px-4 text-gray-300">
                          {order.order_items.length} {order.order_items.length === 1 ? "dish" : "dishes"}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                              statusColors[order.status] || "bg-gray-800 text-gray-300 border-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 pl-4 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-yellow hover:underline"
                          >
                            <span>Manage</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
