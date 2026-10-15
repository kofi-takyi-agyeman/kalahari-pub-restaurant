import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminOrders } from "@/lib/admin/adminDataService";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  ArrowRight,
  Clock,
  Phone,
  Building2,
  Truck,
  RotateCcw,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Orders Queue | Admin | ${businessConfig.name}`,
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const { status = "all", search = "" } = await searchParams;
  const orders = await getAdminOrders({ status, search });

  const statusTabs = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending Review" },
    { id: "confirmed", label: "Confirmed" },
    { id: "preparing", label: "Preparing" },
    { id: "ready", label: "Ready" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    confirmed: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    preparing: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    ready: "bg-teal-500/10 text-teal-300 border-teal-500/30",
    completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    cancelled: "bg-red-500/10 text-red-300 border-red-500/30",
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-charcoal-muted">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
              Order Fulfillment Pipeline
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Incoming Orders Queue
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Process customer pickup and delivery requests in real time
            </p>
          </div>

          <div className="text-xs text-gray-400">
            Showing <strong className="text-white">{orders.length}</strong> {orders.length === 1 ? "order" : "orders"}
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {statusTabs.map((tab) => {
              const isActive = status === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={`/admin/orders?status=${tab.id}${search ? `&search=${search}` : ""}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-brand-yellow text-brand-charcoal shadow-sm"
                      : "bg-brand-charcoal-card text-gray-300 hover:text-white hover:bg-white/5 border border-brand-charcoal-muted"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Search Box */}
          <form method="GET" action="/admin/orders" className="flex items-center gap-2">
            <input type="hidden" name="status" value={status} />
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by order ref (KP-...), name, or phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-charcoal-card border border-brand-charcoal-muted text-xs text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-brand-charcoal-card hover:bg-white/10 border border-brand-charcoal-muted text-xs font-bold text-white transition-colors"
            >
              Filter
            </button>
            {search && (
              <Link
                href={`/admin/orders?status=${status}`}
                className="p-2.5 rounded-xl bg-brand-charcoal-card hover:bg-white/10 border border-brand-charcoal-muted text-xs text-gray-400 hover:text-white"
                title="Reset search"
              >
                <RotateCcw className="w-4 h-4" />
              </Link>
            )}
          </form>
        </div>

        {/* Orders Table */}
        <div className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 sm:p-8 shadow-xs">
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-brand-charcoal flex items-center justify-center text-gray-500 mx-auto border border-brand-charcoal-muted">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                No orders match your filter
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {status !== "all" || search
                  ? "Try resetting your search query or selecting a different status tab above."
                  : "New orders will appear here automatically as soon as customers submit them."}
              </p>
              {(status !== "all" || search) && (
                <div className="pt-2">
                  <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-yellow hover:underline"
                  >
                    <span>View all orders</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Mobile-Friendly Orders Card Stream (Phones < 768px) */}
              <div className="md:hidden space-y-4">
                {orders.map((order) => {
                  const formattedDate = new Date(order.created_at).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  });
                  const formattedTime = new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={order.id}
                      className="bg-brand-charcoal border border-brand-charcoal-muted rounded-2xl p-4 space-y-3 shadow-xs"
                    >
                      {/* Card Header: Order Reference + Status Badge */}
                      <div className="flex items-center justify-between gap-2 border-b border-brand-charcoal-muted/60 pb-2.5">
                        <span className="font-mono font-black text-sm text-brand-yellow">
                          {order.order_number}
                        </span>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            statusStyles[order.status] || "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Customer Info & Direct Call */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-white block text-sm">
                            {order.customer_name}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {formattedDate} at {formattedTime}
                          </span>
                        </div>

                        <a
                          href={`tel:${order.customer_phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-charcoal-card border border-brand-charcoal-muted text-brand-yellow text-xs font-bold hover:bg-white/10 active:scale-95 min-h-[40px]"
                          aria-label={`Call customer ${order.customer_name}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-red shrink-0" />
                          <span>Call</span>
                        </a>
                      </div>

                      {/* Fulfillment & Area */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">Fulfillment:</span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 text-gray-200 font-semibold capitalize text-[11px]">
                          {order.order_type === "pickup" ? (
                            <>
                              <Building2 className="w-3 h-3 text-brand-red" />
                              <span>Pickup</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-3 h-3 text-brand-yellow" />
                              <span>Delivery ({order.delivery_area || "Standard"})</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Dishes Ordered */}
                      <div className="bg-brand-charcoal-card/60 p-2.5 rounded-xl border border-brand-charcoal-muted/40 text-xs text-gray-300 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                          Items ({order.order_items.length}):
                        </span>
                        <p className="line-clamp-2 leading-relaxed">
                          {order.order_items.map((i) => `${i.quantity}x ${i.item_name}`).join(", ")}
                        </p>
                      </div>

                      {/* Total & Action Button */}
                      <div className="flex items-center justify-between pt-1 border-t border-brand-charcoal-muted/60">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Total</span>
                          <span className="text-base font-black text-white">
                            {formatCurrency(order.total)}
                          </span>
                        </div>

                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-black transition-all shadow-xs min-h-[44px]"
                        >
                          <span>Manage Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (>= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-charcoal-muted text-gray-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 pr-4">Order Ref</th>
                      <th className="pb-3 px-4">Submitted</th>
                      <th className="pb-3 px-4">Customer</th>
                      <th className="pb-3 px-4">Fulfillment</th>
                      <th className="pb-3 px-4">Dishes</th>
                      <th className="pb-3 px-4">Amount</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-charcoal-muted/50">
                    {orders.map((order) => {
                      const formattedDate = new Date(order.created_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      });
                      const formattedTime = new Date(order.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 pr-4 font-mono font-bold text-white">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="hover:text-brand-yellow underline decoration-brand-yellow/40"
                            >
                              {order.order_number}
                            </Link>
                          </td>

                          <td className="py-4 px-4 text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-500" />
                              <span>
                                {formattedDate}, {formattedTime}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-white block">
                              {order.customer_name}
                            </span>
                            <a
                              href={`tel:${order.customer_phone}`}
                              className="text-[11px] text-gray-400 hover:text-brand-yellow flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3 text-brand-red" />
                              <span>{order.customer_phone}</span>
                            </a>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              {order.order_type === "pickup" ? (
                                <>
                                  <Building2 className="w-3.5 h-3.5 text-brand-red" />
                                  <span className="capitalize text-gray-300">Pickup</span>
                                </>
                              ) : (
                                <>
                                  <Truck className="w-3.5 h-3.5 text-brand-yellow" />
                                  <span className="capitalize text-gray-300">
                                    Delivery ({order.delivery_area || "Standard"})
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-gray-300">
                            {order.order_items.map((i) => `${i.quantity}x ${i.item_name}`).join(", ")}
                          </td>

                          <td className="py-4 px-4 font-black text-white">
                            {formatCurrency(order.total)}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                statusStyles[order.status] || "bg-gray-800 text-gray-300"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="py-4 pl-4 text-right">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-charcoal hover:bg-brand-yellow hover:text-brand-charcoal text-white text-[11px] font-bold border border-brand-charcoal-muted transition-colors min-h-[36px]"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
