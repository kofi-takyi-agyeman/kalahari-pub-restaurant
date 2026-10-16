"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { businessConfig } from "@/lib/businessConfig";
import { formatCurrency } from "@/lib/utils";
import { submitOrder } from "@/app/actions/submitOrder";
import {
  ShoppingBag,
  MapPin,
  Phone,
  PhoneCall,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Building2,
  Info,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [gpsAddress, setGpsAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  // UI & Validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");

  // Initialize unique idempotency key on client mount
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  // Check if any items are flagged with sample price
  const hasSamplePrices = items.some((i) => i.item.isSamplePrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Client-side pre-validation
    const errors: Record<string, string> = {};

    if (!customerName || customerName.trim().length < 2) {
      errors.customerName = "Full name is required (minimum 2 characters).";
    }

    if (!customerPhone || customerPhone.trim().length < 9) {
      errors.customerPhone = "Valid Ghanaian phone number is required (e.g., 024 565 6849).";
    }

    if (orderType === "delivery") {
      if (!deliveryAddress || deliveryAddress.trim().length < 5) {
        errors.deliveryAddress = "Delivery street address / landmark is required.";
      }
      if (!deliveryArea || deliveryArea.trim().length < 2) {
        errors.deliveryArea = "Area or neighborhood is required.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const combinedAddress = [
      deliveryAddress.trim(),
      landmark.trim() ? `(Landmark: ${landmark.trim()})` : "",
      gpsAddress.trim() ? `(GhanaPost GPS: ${gpsAddress.trim()})` : "",
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const response = await submitOrder({
        customer: {
          customerName,
          customerPhone,
          orderType,
          deliveryAddress: orderType === "delivery" ? combinedAddress : undefined,
          deliveryArea: orderType === "delivery" ? deliveryArea : undefined,
          deliveryInstructions: orderType === "delivery" ? deliveryInstructions : undefined,
          customerNote: customerNote || undefined,
        },
        items: items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
        })),
        idempotencyKey,
      });

      if (!response.success) {
        setGeneralError(response.error || "Order submission failed. Please try again.");
        if (response.fieldErrors) {
          setFieldErrors(response.fieldErrors);
        }
        setIsSubmitting(false);
        return;
      }

      // Successful order creation -> Redirect to confirmation page
      if (response.orderNumber && response.accessToken) {
        router.push(
          `/order-confirmation/${response.orderNumber}?token=${response.accessToken}`
        );
      }
    } catch {
      setGeneralError(
        "A network error occurred while submitting your order. Please check your connection or call the restaurant directly."
      );
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-brand-cream-border p-10 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-cream text-brand-charcoal/40 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-display text-xl font-bold text-brand-charcoal">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-gray-500">
            Please add dishes from our menu before proceeding to checkout.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold px-6 py-3 rounded-xl transition-all shadow-xs text-sm"
            >
              <span>Explore Menu</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb & Header */}
        <div className="border-b border-brand-cream-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Link href="/cart" className="hover:text-brand-red flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Cart</span>
              </Link>
              <span>/</span>
              <span className="text-brand-charcoal">Checkout</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
              Order Checkout
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-brand-green bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>Secure Server-Validated Checkout</span>
          </div>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-red-950 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <strong className="font-bold text-red-900 block">
                Order Submission Notice
              </strong>
              <p className="leading-relaxed">{generalError}</p>
            </div>
          </div>
        )}

        {/* Critical Business Rule Warning: Sample Pricing Banner */}
        {hasSamplePrices && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-5 text-amber-950 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1">
                <strong className="font-extrabold uppercase tracking-wide text-amber-950 block">
                  Demonstration Pricing Policy Active ({businessConfig.samplePriceNotice})
                </strong>
                <p className="text-amber-900/90 leading-relaxed">
                  Your cart contains dishes with temporary development sample pricing. Per
                  restaurant engineering standards, commercial orders cannot be finalized
                  online with unconfirmed prices. You can complete and test the pickup form
                  below, or tap any of our verified lines to place your order directly:
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/80 flex flex-wrap gap-2 text-xs">
              {businessConfig.phones.map((phone) => (
                <a
                  key={phone.raw}
                  href={phone.telLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-brand-red" />
                  <span>Call {phone.formatted}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Main Grid: Form Left, Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6"
          >
            {/* Step 1: Customer Contact Info */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-brand-charcoal flex items-center gap-2 pb-2 border-b border-brand-cream-border">
                <span className="w-6 h-6 rounded-full bg-brand-charcoal text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Contact Information</span>
              </h2>

              <div>
                <label
                  htmlFor="customerName"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
                >
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <input
                  id="customerName"
                  type="text"
                  required
                  autoComplete="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow transition-all min-h-[46px] ${
                    fieldErrors.customerName
                      ? "border-red-400 bg-red-50/40"
                      : "border-brand-cream-border bg-white"
                  }`}
                />
                {fieldErrors.customerName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    {fieldErrors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
                >
                  Ghanaian Phone Number <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="customerPhone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 024 565 6849 or 020 715 7071"
                    className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow transition-all min-h-[46px] ${
                      fieldErrors.customerPhone
                        ? "border-red-400 bg-red-50/40"
                        : "border-brand-cream-border bg-white"
                    }`}
                  />
                </div>
                {fieldErrors.customerPhone ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    {fieldErrors.customerPhone}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Accepts any valid Ghanaian number (MTN, Telecel, AT). Used for order confirmation.
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: Fulfillment Mode (Pickup vs Delivery) */}
            <div className="space-y-4 pt-2">
              <h2 className="font-display text-lg font-bold text-brand-charcoal flex items-center gap-2 pb-2 border-b border-brand-cream-border">
                <span className="w-6 h-6 rounded-full bg-brand-charcoal text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Fulfillment Method</span>
              </h2>

              <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    orderType === "pickup"
                      ? "bg-white text-brand-charcoal shadow-sm"
                      : "text-gray-600 hover:text-brand-charcoal"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-brand-red" />
                  <span>Pickup at Dine</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    orderType === "delivery"
                      ? "bg-white text-brand-charcoal shadow-sm"
                      : "text-gray-600 hover:text-brand-charcoal"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-brand-yellow" />
                  <span>Delivery Request</span>
                </button>
              </div>

              {orderType === "pickup" ? (
                <div className="rounded-2xl bg-brand-cream/70 border border-brand-cream-border p-4 text-xs text-brand-charcoal space-y-2">
                  <div className="flex items-center gap-2 font-bold text-brand-charcoal">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <span>Pickup Location: {businessConfig.location}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Your meal will be freshly packaged and ready for collection at Kalahari Dine,
                    A-Lang Taxi Rank once confirmed by phone.
                  </p>
                </div>
              ) : (
                /* Delivery Fields & Notice */
                <div className="space-y-4 pt-1">
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold mb-0.5">
                        Delivery Policy Notice
                      </strong>
                      <span>
                        Restaurant management has not yet finalized official delivery zones
                        and delivery fee structures. Online delivery orders are currently held
                        pending policy confirmation. To arrange delivery today, please choose
                        Pickup or call any of our numbers.
                      </span>
                    </div>
                  </div>

                  {/* Delivery Area with preset chips */}
                  <div>
                    <label
                      htmlFor="deliveryArea"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
                    >
                      Delivery Area / Neighborhood <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="deliveryArea"
                      type="text"
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      placeholder="e.g. A-Lang, Sowutuom, Kwashieman, Lapaz"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow transition-all ${
                        fieldErrors.deliveryArea
                          ? "border-red-400 bg-red-50/40"
                          : "border-brand-cream-border bg-white"
                      }`}
                    />
                    {fieldErrors.deliveryArea && (
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        {fieldErrors.deliveryArea}
                      </p>
                    )}
                    {/* Quick Select Neighborhood Chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[11px] text-gray-500 font-semibold mr-0.5">Quick Select:</span>
                      {["A-Lang", "Sowutuom", "Kwashieman", "Lapaz", "Santa Maria", "Odorkor"].map((zone) => (
                        <button
                          key={zone}
                          type="button"
                          onClick={() => setDeliveryArea(zone)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] active:scale-95 ${
                            deliveryArea.toLowerCase() === zone.toLowerCase()
                              ? "bg-brand-charcoal text-brand-yellow font-black shadow-xs ring-2 ring-brand-yellow"
                              : "bg-brand-cream border border-brand-cream-border text-gray-700 hover:text-brand-charcoal hover:bg-brand-cream/80"
                          }`}
                        >
                          {zone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label
                      htmlFor="deliveryAddress"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
                    >
                      Street Address / Road Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="deliveryAddress"
                      type="text"
                      autoComplete="street-address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Taxi Rank Road, Main Sowutuom Highway"
                      className={`w-full px-4 py-3.5 rounded-xl border text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow transition-all min-h-[46px] ${
                        fieldErrors.deliveryAddress
                          ? "border-red-400 bg-red-50/40"
                          : "border-brand-cream-border bg-white"
                      }`}
                    />
                    {fieldErrors.deliveryAddress && (
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        {fieldErrors.deliveryAddress}
                      </p>
                    )}
                  </div>

                  {/* Landmark and GhanaPost GPS in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="landmark"
                        className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
                      >
                        Prominent Landmark <span className="text-[11px] text-gray-400 font-normal lowercase">(for rider)</span>
                      </label>
                      <input
                        id="landmark"
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Opposite Shell station, Blue Gate"
                        className="w-full px-4 py-3 rounded-xl border border-brand-cream-border bg-white text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gpsAddress"
                        className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
                      >
                        GhanaPost GPS <span className="text-[11px] text-gray-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        id="gpsAddress"
                        type="text"
                        value={gpsAddress}
                        onChange={(e) => setGpsAddress(e.target.value)}
                        placeholder="e.g. GA-123-4567"
                        className="w-full px-4 py-3 rounded-xl border border-brand-cream-border bg-white text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow transition-all uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="deliveryInstructions"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
                    >
                      Rider Drop-off Instructions (Optional)
                    </label>
                    <input
                      id="deliveryInstructions"
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="e.g. 2nd floor, call on arrival, leave at gate"
                      className="w-full px-4 py-3 rounded-xl border border-brand-cream-border text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Kitchen Notes */}
            <div className="space-y-4 pt-2">
              <h2 className="font-display text-lg font-bold text-brand-charcoal flex items-center gap-2 pb-2 border-b border-brand-cream-border">
                <span className="w-6 h-6 rounded-full bg-brand-charcoal text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Special Cooking or Packaging Instructions</span>
              </h2>

              <div>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="e.g. Extra shito, separate pepper, pack banku hot..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-border text-sm text-brand-charcoal placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
            </div>

            {/* Submission Action */}
            <div className="pt-4 border-t border-brand-cream-border space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black py-4 px-6 rounded-xl transition-all shadow-md active:scale-98 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-brand-charcoal" />
                    <span>Verifying &amp; Submitting Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-brand-charcoal" />
                    <span>Submit Order for Restaurant Review</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                By submitting, your order will be recorded in our database under status{" "}
                <span className="font-semibold text-brand-charcoal">pending</span>. Payment
                and preparation are confirmed when contacted by our staff.
              </p>
            </div>
          </form>

          {/* Right Column: Order Items & Subtotal Review */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="font-display text-xl font-bold text-brand-charcoal flex items-center justify-between pb-3 border-b border-brand-cream-border">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-gray-500 bg-brand-cream px-2.5 py-1 rounded-md border border-brand-cream-border">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </h2>

            {/* Mini Items List */}
            <div className="space-y-3 divide-y divide-brand-cream-border/60 max-h-80 overflow-y-auto pr-1">
              {items.map((cartItem) => (
                <div key={cartItem.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-brand-cream-border">
                    <Image
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-brand-charcoal truncate">
                      {cartItem.item.name}
                    </h4>
                    <span className="text-[10px] text-gray-500 block">
                      Qty: {cartItem.quantity} &times; {formatCurrency(cartItem.item.samplePrice)}
                    </span>
                  </div>

                  <div className="text-xs font-black text-brand-charcoal shrink-0">
                    {formatCurrency(cartItem.item.samplePrice * cartItem.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-brand-cream-border space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-brand-charcoal">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Fulfillment ({orderType === "pickup" ? "Pickup" : "Delivery"}):</span>
                <span className="italic text-gray-500">
                  {orderType === "pickup" ? "GHS 0.00 (Self Pickup)" : "Pending Confirmation"}
                </span>
              </div>

              <div className="pt-3 border-t border-brand-cream-border flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-brand-charcoal block">
                    Estimated Subtotal
                  </span>
                  <span className="text-[10px] text-amber-800">
                    Official price confirmed upon review
                  </span>
                </div>
                <span className="text-xl font-black text-brand-charcoal">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Restaurant Verification Direct Dial */}
            <div className="rounded-2xl bg-brand-cream/60 p-4 border border-brand-cream-border space-y-2">
              <span className="text-xs font-bold text-brand-charcoal block">
                Direct Restaurant Contact:
              </span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Want to confirm dish availability or check current grill status immediately?
              </p>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {businessConfig.phones.map((phone) => (
                  <a
                    key={phone.raw}
                    href={phone.telLink}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-brand-cream-border hover:border-brand-yellow text-xs font-bold text-brand-charcoal transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-red" />
                      {phone.formatted}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">{phone.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
