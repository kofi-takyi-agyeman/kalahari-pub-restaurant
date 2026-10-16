import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminOrderDetail } from "@/lib/admin/adminDataService";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusActionsClient } from "./OrderStatusActionsClient";
import {
  ArrowLeft,
  Phone,
  PhoneCall,
  Building2,
  Truck,
  MessageCircle,
  History,
} from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id} | Admin | ${businessConfig.name}`,
  };
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const order = await getAdminOrderDetail(id);

  if (!order) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    confirmed: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    preparing: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    ready: "bg-teal-500/10 text-teal-300 border-teal-500/30",
    completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    cancelled: "bg-red-500/10 text-red-300 border-red-500/30",
  };

  // WhatsApp quick text link
  const itemsSummaryText = order.order_items
    .map((item) => `${item.quantity}x ${item.item_name}`)
    .join(", ");
  const cleanPhone = order.customer_phone.replace(/^0/, "233").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${order.customer_name}, this is Kalahari Dine regarding your order #${order.order_number} (${itemsSummaryText}). Status: ${order.status.toUpperCase()}.`
  )}`;

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link & Header */}
        <div className="space-y-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders Queue</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-charcoal-muted">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-white">
                  {order.order_number}
                </span>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    statusColors[order.status] || "bg-gray-800 text-gray-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Submitted on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {/* Quick Contact Links */}
            <div className="flex items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>

              <a
                href={`tel:${order.customer_phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-charcoal-card hover:bg-white/10 border border-brand-charcoal-muted text-white text-xs font-bold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-red" />
                <span>Call Phone</span>
              </a>
            </div>
          </div>
        </div>

        {/* Workflow State Machine Action Bar */}
        <div className="bg-brand-charcoal-card rounded-2xl border border-brand-charcoal-muted p-5 sm:p-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Order Lifecycle Management
          </h2>
          <OrderStatusActionsClient orderId={order.id} currentStatus={order.status} />
        </div>

        {/* 2-Column Grid: Customer & Delivery Info Left, Line Items Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Customer & Fulfillment Info */}
          <div className="md:col-span-5 bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 space-y-6">
            <h3 className="font-display text-base font-bold text-white pb-3 border-b border-brand-charcoal-muted">
              Customer &amp; Fulfillment
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-400 block font-semibold">Customer Name:</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {order.customer_name}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold">Contact Phone:</span>
                <a
                  href={`tel:${order.customer_phone}`}
                  className="text-sm font-bold text-brand-yellow hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-red" />
                  <span>{order.customer_phone}</span>
                </a>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold">Fulfillment Type:</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {order.order_type === "pickup" ? (
                    <>
                      <Building2 className="w-4 h-4 text-brand-red" />
                      <span className="font-bold text-white capitalize">Pickup at Kalahari Dine</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-brand-yellow" />
                      <span className="font-bold text-white capitalize">Delivery</span>
                    </>
                  )}
                </div>
              </div>

              {order.order_type === "pickup" ? (
                <div className="p-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-gray-300 space-y-1">
                  <span className="font-bold text-white block">Collection Location:</span>
                  <p>{businessConfig.location}</p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted space-y-2">
                  <div>
                    <span className="text-gray-400 block font-medium">Delivery Address:</span>
                    <span className="text-white font-bold block">{order.delivery_address}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Area / Zone:</span>
                    <span className="text-white font-bold block">{order.delivery_area}</span>
                  </div>
                  {order.delivery_instructions && (
                    <div>
                      <span className="text-gray-400 block font-medium">Directions / Landmark:</span>
                      <span className="text-gray-300 italic block">{order.delivery_instructions}</span>
                    </div>
                  )}
                </div>
              )}

              {order.customer_note && (
                <div className="p-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted space-y-1">
                  <span className="font-bold text-amber-300 block">Kitchen Instructions:</span>
                  <p className="text-gray-300 italic">&ldquo;{order.customer_note}&rdquo;</p>
                </div>
              )}
            </div>
          </div>

          {/* Line Items & Payment Breakdown */}
          <div className="md:col-span-7 bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 space-y-6">
            <h3 className="font-display text-base font-bold text-white pb-3 border-b border-brand-charcoal-muted">
              Ordered Dishes Snapshot
            </h3>

            <div className="divide-y divide-brand-charcoal-muted/50 text-xs">
              {order.order_items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.item_name}</h4>
                    <span className="text-gray-400">
                      Qty: {item.quantity} &times; {formatCurrency(item.unit_price)}
                    </span>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {formatCurrency(item.line_total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-brand-charcoal-muted space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Items Subtotal:</span>
                <span className="text-white font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee:</span>
                <span className="text-white font-semibold">{formatCurrency(order.delivery_fee)}</span>
              </div>

              <div className="pt-2 border-t border-brand-charcoal-muted flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total:</span>
                <span className="text-xl font-black text-brand-yellow">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            {/* Audit Log / History */}
            {order.order_status_logs && order.order_status_logs.length > 0 && (
              <div className="pt-6 border-t border-brand-charcoal-muted space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>Audit Trail</span>
                </h4>
                <div className="space-y-2">
                  {order.order_status_logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-gray-300">
                        <span>
                          Status changed to <strong className="text-white uppercase">{log.new_status}</strong>
                        </span>
                        <span className="text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-gray-400 text-[10px]">
                        By: <span className="text-gray-300">{log.changed_by}</span>
                        {log.notes && <span> &bull; Note: &ldquo;{log.notes}&rdquo;</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
