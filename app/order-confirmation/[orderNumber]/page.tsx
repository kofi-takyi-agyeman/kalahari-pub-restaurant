import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getOrderConfirmation } from "@/app/actions/submitOrder";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { OrderConfirmationClient } from "./OrderConfirmationClient";
import { OrderTrackerStepper } from "@/components/orders/OrderTrackerStepper";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: `Order Confirmation | ${businessConfig.name}`,
  description: `Order confirmation and status receipt for ${businessConfig.name}.`,
};

interface OrderConfirmationPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-brand-cream-border p-8 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="font-display text-xl font-bold text-brand-charcoal">
            Security Authorization Required
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            A valid security token is required to view order receipts. This ensures customer
            order privacy and prevents unauthorized access by guessing order numbers.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-charcoal text-white font-bold px-6 py-2.5 rounded-xl text-xs"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const order = await getOrderConfirmation(orderNumber, token);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-brand-cream-border p-8 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="font-display text-xl font-bold text-brand-charcoal">
            Order Not Found
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            We could not find an order matching reference <strong>{orderNumber}</strong> with
            the provided access token. Please verify your receipt link or call the restaurant.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-brand-yellow text-brand-charcoal font-bold px-6 py-2.5 rounded-xl text-xs"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Generate WhatsApp confirmation message link
  const itemsSummaryText = order.order_items
    .map((item) => `${item.quantity}x ${item.item_name}`)
    .join(", ");
  const whatsappMessage = encodeURIComponent(
    `Hello Kalahari Dine! I just submitted order #${order.order_number} for ${order.customer_name} (${order.order_type.toUpperCase()}). Items: ${itemsSummaryText}. Total: GHS ${order.total.toFixed(2)}. Please confirm receipt!`
  );
  const primaryPhoneDigits = businessConfig.phones[0].raw.replace(/^0/, "233");
  const whatsappUrl = `https://wa.me/${primaryPhoneDigits}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#FDFCF9] py-10 sm:py-16">
      {/* Client component to clear the local shopping bag upon confirmed order */}
      <OrderConfirmationClient orderNumber={order.order_number} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Brand Receipt Header */}
        <div className="flex justify-center pt-2">
          <Logo variant="compact" size="md" asLink href="/" />
        </div>

        {/* Success Header Card */}
        <div className="bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-10 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Order Recorded Successfully
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-brand-charcoal">
              Thank You, {order.customer_name}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Your order has been safely committed to our database and is currently awaiting
              staff review and kitchen preparation.
            </p>
          </div>

          {/* Order Reference Pill */}
          <div className="inline-flex items-center gap-2 bg-brand-cream px-4 py-2 rounded-xl border border-brand-cream-border">
            <span className="text-xs text-gray-500 font-medium">Order Reference:</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-brand-charcoal">
              {order.order_number}
            </span>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>Status: {order.status.toUpperCase()} (Awaiting Restaurant Review)</span>
            </span>
          </div>

          {/* Visual Order Progress Stepper */}
          <div className="pt-2 border-t border-brand-cream-border/80">
            <OrderTrackerStepper status={order.status} orderType={order.order_type} />
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-display text-lg font-bold text-brand-charcoal pb-3 border-b border-brand-cream-border flex items-center justify-between">
            <span>Submitted Items Snapshot</span>
            <span className="text-xs text-gray-500 font-normal">
              Recorded at {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </h2>

          {/* Line items list */}
          <div className="divide-y divide-brand-cream-border/60">
            {order.order_items.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                <div>
                  <h3 className="font-bold text-brand-charcoal">
                    {item.item_name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    Qty: {item.quantity} &times; {formatCurrency(item.unit_price)}
                  </span>
                </div>
                <span className="font-bold text-brand-charcoal">
                  {formatCurrency(item.line_total)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-brand-cream-border space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-brand-charcoal">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Fulfillment ({order.order_type === "pickup" ? "Pickup at Dine" : "Delivery"}):</span>
              <span className="font-semibold text-brand-charcoal">
                {formatCurrency(order.delivery_fee)}
              </span>
            </div>

            <div className="pt-2 border-t border-brand-cream-border flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-brand-charcoal">
                Total Amount:
              </span>
              <span className="text-xl font-black text-brand-charcoal">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Fulfillment Details Box */}
          <div className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-cream-border text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-brand-charcoal">
              <MapPin className="w-4 h-4 text-brand-red" />
              <span>
                {order.order_type === "pickup"
                  ? "Collection Location: " + businessConfig.location
                  : "Delivery Address: " + (order.delivery_address || "Provided to staff")}
              </span>
            </div>

            <p className="text-gray-600">
              Customer Contact Phone: <strong>{order.customer_phone}</strong>
            </p>

            {order.customer_note && (
              <p className="text-gray-600 italic">
                Special Instructions: &quot;{order.customer_note}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Rapid Communication Card */}
        <div className="bg-brand-charcoal text-white rounded-3xl p-6 sm:p-8 border border-brand-charcoal-muted space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal-muted flex items-center justify-center text-brand-yellow shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">
                Immediate Kitchen Follow-Up
              </h3>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                Want to ensure your food is hot and ready on time? Tap to call our kitchen or
                send your pre-formatted order summary via WhatsApp:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Summary &amp; Share Live Location on WhatsApp</span>
            </a>

            <a
              href={businessConfig.phones[0].telLink}
              className="flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black py-3 px-4 rounded-xl text-xs transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-brand-red" />
              <span>Call {businessConfig.phones[0].formatted}</span>
            </a>
          </div>

          <div className="pt-2 border-t border-brand-charcoal-muted text-[11px] text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-brand-yellow">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Order ID Token Protected</span>
            </span>
            <span>{businessConfig.developer.credit}</span>
          </div>
        </div>

        {/* Return to Menu */}
        <div className="text-center pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-charcoal"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Return to Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
