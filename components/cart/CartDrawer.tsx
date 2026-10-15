"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  PhoneCall,
  AlertTriangle,
  Info,
  MapPin,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Your Order Bag"
          className="flex w-screen max-w-md flex-col bg-white shadow-2xl border-l border-brand-cream-border"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-cream-border px-6 py-4 bg-brand-charcoal text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-yellow" />
              <h2 className="text-lg font-bold font-display tracking-wide">
                Your Order Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close order bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Phase 1 Advisory Notice */}
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 leading-relaxed flex gap-2.5 items-start">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950 mb-1">
                  Phase 1 Ordering Notice
                </p>
                <p>
                  Prices are temporary demonstration estimates (
                  <span className="font-semibold">
                    SAMPLE PRICE — CONFIRM WITH RESTAURANT
                  </span>
                  ). The online ordering backend is launching in Phase 2. To place your
                  order today, please call any of our verified phone numbers.
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center mb-4 text-brand-charcoal/40">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-brand-charcoal mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  Explore our Ghanaian local dishes, fresh grilled tilapia, and chilled
                  drinks to start an order.
                </p>
                <Link
                  href="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              <>
                {/* Order Type Toggle */}
                <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1">
                  <button
                    onClick={() => setOrderType("pickup")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      orderType === "pickup"
                        ? "bg-white text-brand-charcoal shadow-sm"
                        : "text-gray-600 hover:text-brand-charcoal"
                    }`}
                  >
                    Pickup (A-Lang Taxi Rank)
                  </button>
                  <button
                    onClick={() => setOrderType("delivery")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      orderType === "delivery"
                        ? "bg-white text-brand-charcoal shadow-sm"
                        : "text-gray-600 hover:text-brand-charcoal"
                    }`}
                  >
                    Delivery (Confirm by Phone)
                  </button>
                </div>

                {orderType === "pickup" ? (
                  <div className="flex items-center gap-2 text-xs text-brand-charcoal bg-brand-cream/80 p-2.5 rounded-lg border border-brand-cream-border">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                    <span>Pickup Location: <strong>{businessConfig.location}</strong></span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-gray-700 bg-brand-cream/80 p-2.5 rounded-lg border border-brand-cream-border">
                    <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>
                      Delivery fees and radius will be confirmed when you call. Official
                      address validation will be added in Phase 2.
                    </span>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-4 divide-y divide-brand-cream-border/60">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.id}
                      className="pt-4 first:pt-0 flex items-center justify-between gap-3"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-brand-cream-border">
                        <Image
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-brand-charcoal truncate">
                          {cartItem.item.name}
                        </h4>
                        <span className="text-[10px] text-amber-800 font-medium block">
                          SAMPLE: {formatCurrency(cartItem.item.samplePrice)} each
                        </span>
                        <div className="text-xs font-extrabold text-brand-charcoal mt-0.5">
                          {formatCurrency(cartItem.item.samplePrice * cartItem.quantity)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 border border-brand-cream-border rounded-lg p-1 bg-brand-cream/40">
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity - 1)
                          }
                          className="p-1 hover:bg-white rounded text-gray-600 hover:text-brand-charcoal transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-brand-charcoal">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity + 1)
                          }
                          className="p-1 hover:bg-white rounded text-gray-600 hover:text-brand-charcoal transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(cartItem.id)}
                        className="p-1.5 text-gray-400 hover:text-brand-red transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-500 hover:text-brand-red transition-colors"
                  >
                    Clear all items
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Call Section */}
          {items.length > 0 && (
            <div className="border-t border-brand-cream-border bg-brand-cream/40 p-6 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Items Subtotal:</span>
                  <span className="font-semibold text-brand-charcoal">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Delivery Charge:</span>
                  <span className="italic text-gray-500">
                    {orderType === "pickup" ? "Free (Pickup)" : "Confirm with restaurant"}
                  </span>
                </div>
                <div className="pt-2 border-t border-brand-cream-border flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-brand-charcoal">
                      Estimated Subtotal
                    </span>
                    <span className="block text-[10px] text-amber-800">
                      Subject to restaurant price confirmation
                    </span>
                  </div>
                  <span className="text-xl font-extrabold text-brand-charcoal">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              {/* Call to Order CTA */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-brand-charcoal text-center">
                  Call our verified lines to place this order now:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {businessConfig.phones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={phone.telLink}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold text-sm transition-all shadow-sm active:scale-98"
                    >
                      <span className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-brand-red" />
                        {phone.formatted}
                      </span>
                      <span className="text-xs bg-white/70 px-2 py-0.5 rounded-md font-medium">
                        {phone.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs text-gray-600 hover:text-brand-charcoal underline"
                >
                  View full order summary & details page
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
