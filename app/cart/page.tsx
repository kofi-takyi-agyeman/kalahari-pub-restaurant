"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MapPin,
  PhoneCall,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } =
    useCart();

  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleReviewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="border-b border-brand-cream-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
              Your Order Summary
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review your selected dishes, estimated subtotal, and ordering details.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:underline"
          >
            <span>&larr; Back to Menu</span>
          </Link>
        </div>

        {/* Global Notice Banner */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-4 sm:p-5 text-amber-950 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-bold uppercase tracking-wide">
              Phase 1 Order Preparation Notice
            </p>
            <p className="text-amber-900/85 leading-relaxed">
              All dish prices are development demonstration figures (
              <span className="font-semibold">{businessConfig.samplePriceNotice}</span>
              ). Automatic payment processing and database checkout will launch in
              Phase 2. You can use this summary to review your choices, then call our
              kitchen directly to place and confirm your order.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-brand-cream-border p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
            <div className="w-20 h-20 rounded-full bg-brand-cream text-brand-charcoal/40 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal">
              Your bag is currently empty
            </h2>
            <p className="text-sm text-gray-500">
              Browse our delicious Ghanaian dishes, fresh grilled food, and chilled
              drinks to get started.
            </p>
            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold px-6 py-3 rounded-xl transition-all shadow-sm text-sm"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-cream-border">
                <h2 className="font-display text-xl font-bold text-brand-charcoal flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-red" />
                  <span>Selected Items ({totalItems})</span>
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-brand-red transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-brand-cream-border/60">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-brand-cream-border">
                        <Image
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-brand-charcoal">
                          {cartItem.item.name}
                        </h3>
                        <span className="text-[11px] text-amber-800 font-medium block">
                          Sample unit price: {formatCurrency(cartItem.item.samplePrice)}
                        </span>
                        <span className="text-xs font-black text-brand-charcoal mt-1 block">
                          Subtotal: {formatCurrency(cartItem.item.samplePrice * cartItem.quantity)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      {/* Quantity Buttons */}
                      <div className="flex items-center gap-2 border border-brand-cream-border rounded-xl p-1 bg-brand-cream/40">
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity - 1)
                          }
                          className="p-1 hover:bg-white rounded-lg text-gray-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center text-brand-charcoal">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity + 1)
                          }
                          className="p-1 hover:bg-white rounded-lg text-gray-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(cartItem.id)}
                        className="p-2 text-gray-400 hover:text-brand-red rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary & Details Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Options & Calculation Box */}
              <div className="bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6">
                <h2 className="font-display text-xl font-bold text-brand-charcoal">
                  Fulfillment &amp; Contact
                </h2>

                {/* Pickup / Delivery Choice */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Choose Order Type:
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrderType("pickup")}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        orderType === "pickup"
                          ? "bg-white text-brand-charcoal shadow-sm"
                          : "text-gray-600 hover:text-brand-charcoal"
                      }`}
                    >
                      Pickup at Pub
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("delivery")}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        orderType === "delivery"
                          ? "bg-white text-brand-charcoal shadow-sm"
                          : "text-gray-600 hover:text-brand-charcoal"
                      }`}
                    >
                      Delivery Request
                    </button>
                  </div>
                </div>

                {orderType === "pickup" ? (
                  <div className="p-3 bg-brand-cream/80 border border-brand-cream-border rounded-xl text-xs text-brand-charcoal flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <div>
                      <strong>Pickup Point:</strong> {businessConfig.location}
                      <p className="text-gray-500 mt-0.5">
                        Your order will be packaged for pickup once confirmed by phone.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-brand-cream/80 border border-brand-cream-border rounded-xl text-xs text-gray-700 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <strong>Delivery Notice:</strong> Delivery fee and delivery zone
                      will be confirmed with the restaurant staff when placing your call.
                    </div>
                  </div>
                )}

                {/* Customer Details Form */}
                <form onSubmit={handleReviewOrder} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-border text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Your Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 024XXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-border text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>

                  {orderType === "delivery" && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Delivery Landmark / Address
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="e.g. Near Taxi Rank junction, Blue Gate..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-border text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
                      />
                    </div>
                  )}

                  {/* Calculations */}
                  <div className="pt-4 border-t border-brand-cream-border space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Items Subtotal (Sample Prices):</span>
                      <span className="font-bold text-brand-charcoal">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600 text-xs">
                      <span>Delivery Fee:</span>
                      <span className="italic text-gray-500">
                        {orderType === "pickup"
                          ? "GHS 0.00 (Self Pickup)"
                          : "TBD / Confirm on Call"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-brand-cream-border flex justify-between items-baseline">
                      <div>
                        <span className="text-base font-extrabold text-brand-charcoal">
                          Estimated Subtotal:
                        </span>
                        <span className="block text-[10px] text-amber-800">
                          Final price confirmed upon phone order
                        </span>
                      </div>
                      <span className="text-2xl font-black text-brand-charcoal">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                  </div>

                  {formSubmitted && (
                    <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Order Summary Ready!</strong> Now call any of our verified
                        numbers below to give your name ({customerName || "Customer"}) and
                        confirm your order with kitchen staff.
                      </div>
                    </div>
                  )}

                  {/* Call to Order Trigger */}
                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-bold text-brand-charcoal text-center">
                      Tap to call restaurant and place order:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {businessConfig.phones.map((phone) => (
                        <a
                          key={phone.raw}
                          href={phone.telLink}
                          className="flex items-center justify-between px-4 py-3 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black text-sm transition-all shadow-sm active:scale-98"
                        >
                          <span className="flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-brand-red" />
                            {phone.formatted}
                          </span>
                          <span className="text-xs font-medium bg-white/70 px-2 py-0.5 rounded">
                            {phone.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Honest Architecture Disclaimer */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Honest Feature Status:</strong> This interface implements
                    complete client-side cart logic. An online automated order dispatch
                    backend with Supabase persistence and payment gateways will be
                    integrated in Phase 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
