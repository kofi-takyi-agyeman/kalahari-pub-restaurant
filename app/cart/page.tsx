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
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } =
    useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb & Title */}
        <div className="border-b border-brand-cream-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Link href="/menu" className="hover:text-brand-red flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Menu</span>
              </Link>
              <span>/</span>
              <span className="text-brand-charcoal">Cart ({totalItems})</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
              Your Shopping Cart
            </h1>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:underline self-start sm:self-auto"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sample Price Notice Banner */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-4 sm:p-5 text-amber-950 flex items-start gap-3.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-bold uppercase tracking-wide">
              Demonstration Pricing &amp; Checkout Rules
            </p>
            <p className="text-amber-900/85 leading-relaxed">
              Dishes flagged with &quot;{businessConfig.samplePriceNotice}&quot; use temporary demonstration
              estimates. Per restaurant policy, items with unconfirmed prices cannot be finalized as commercial
              orders online until approved by management. You can review your cart here and proceed to checkout
              to see fulfillment details or call the restaurant directly.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-brand-cream-border p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
            <div className="w-20 h-20 rounded-full bg-brand-cream text-brand-charcoal/40 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-500">
              Browse our authentic Ghanaian dishes, flame-grilled tilapia, and chilled
              drinks to start your order.
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
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-cream-border">
                <h2 className="font-display text-xl font-bold text-brand-charcoal flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-red" />
                  <span>Cart Items ({totalItems})</span>
                </h2>

                {showClearConfirm ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Clear all?</span>
                    <button
                      onClick={handleClear}
                      className="px-2.5 py-1 rounded bg-brand-red text-white font-bold hover:bg-brand-red-hover transition-colors"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1 rounded text-gray-500 hover:text-brand-charcoal"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-xs text-gray-400 hover:text-brand-red transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-brand-cream-border/60">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-brand-cream-border">
                        <Image
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-brand-charcoal leading-snug">
                          {cartItem.item.name}
                        </h3>
                        {cartItem.item.isSamplePrice && (
                          <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            SAMPLE PRICE
                          </span>
                        )}
                        <span className="text-xs text-gray-500 block font-medium">
                          Unit: {formatCurrency(cartItem.item.samplePrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 border border-brand-cream-border rounded-xl p-1 bg-brand-cream/60">
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, cartItem.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-700 hover:text-brand-charcoal transition-colors active:scale-95"
                          aria-label={`Decrease quantity of ${cartItem.item.name}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center text-brand-charcoal">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.id, Math.min(50, cartItem.quantity + 1))
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-700 hover:text-brand-charcoal transition-colors active:scale-95"
                          aria-label={`Increase quantity of ${cartItem.item.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-sm font-black text-brand-charcoal">
                          {formatCurrency(cartItem.item.samplePrice * cartItem.quantity)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(cartItem.id)}
                        className="p-2 text-gray-400 hover:text-brand-red rounded-lg transition-colors"
                        aria-label={`Remove ${cartItem.item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="font-display text-xl font-bold text-brand-charcoal">
                Cart Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Selected Dishes ({totalItems}):</span>
                  <span className="font-bold text-brand-charcoal">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Fulfillment Fee:</span>
                  <span className="text-gray-500 italic">
                    Calculated at Checkout
                  </span>
                </div>

                <div className="pt-3 border-t border-brand-cream-border flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-extrabold text-brand-charcoal block">
                      Estimated Subtotal
                    </span>
                    <span className="text-[10px] text-amber-800">
                      Subject to restaurant price confirmation
                    </span>
                  </div>
                  <span className="text-2xl font-black text-brand-charcoal">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <div className="pt-2 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 text-base text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                  Choose Pickup at A-Lang Taxi Rank or Delivery. Form details and server validation on the next step.
                </p>
              </div>

              {/* Security Advisory */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Data Integrity Guard:</strong> All item IDs and prices are re-validated
                  on the server before order creation. Client-side modifications are rejected.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
