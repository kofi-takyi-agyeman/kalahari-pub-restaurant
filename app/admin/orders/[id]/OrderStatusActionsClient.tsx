"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/app/actions/adminOrderActions";
import { OrderStatus } from "@/types/database.types";
import {
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Ban,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusActionsClient({
  orderId,
  currentStatus,
}: OrderStatusActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleTransition = async (nextStatus: OrderStatus, notes?: string) => {
    setIsUpdating(true);
    setErrorMsg(null);

    const result = await updateOrderStatusAction(orderId, nextStatus, notes);
    if (!result.success) {
      setErrorMsg(result.error || "Failed to update order status.");
      setIsUpdating(false);
      return;
    }

    setIsUpdating(false);
    setShowCancelPrompt(false);
    router.refresh();
  };

  if (currentStatus === "completed") {
    return (
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>This order has been completed and fulfilled. No further status changes can be made.</span>
      </div>
    );
  }

  if (currentStatus === "cancelled") {
    return (
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
        <Ban className="w-4 h-4 shrink-0" />
        <span>This order has been cancelled.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {showCancelPrompt ? (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 space-y-3">
          <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">
            Confirm Order Cancellation
          </h4>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason for cancellation (e.g. customer called, kitchen item finished)..."
            className="w-full px-3 py-2 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-xs text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-red"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTransition("cancelled", cancelReason)}
              disabled={isUpdating}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Cancelling..." : "Yes, Cancel Order"}
            </button>
            <button
              onClick={() => setShowCancelPrompt(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {currentStatus === "pending" && (
            <button
              onClick={() => handleTransition("confirmed", "Accepted by restaurant staff.")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Confirm &amp; Accept Order</span>
            </button>
          )}

          {currentStatus === "confirmed" && (
            <button
              onClick={() => handleTransition("preparing", "Kitchen preparation started.")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChefHat className="w-4 h-4" />
              )}
              <span>Send to Kitchen (Start Preparing)</span>
            </button>
          )}

          {currentStatus === "preparing" && (
            <button
              onClick={() => handleTransition("ready", "Food packaged and ready.")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PackageCheck className="w-4 h-4" />
              )}
              <span>Mark Ready for Pickup / Dispatch</span>
            </button>
          )}

          {currentStatus === "ready" && (
            <button
              onClick={() => handleTransition("completed", "Customer received order and paid.")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Mark Order Completed &amp; Paid</span>
            </button>
          )}

          {/* Cancel Option (allowed from any non-terminal state) */}
          <button
            onClick={() => setShowCancelPrompt(true)}
            disabled={isUpdating}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-charcoal-card hover:bg-red-950/40 border border-brand-charcoal-muted hover:border-red-800 text-red-300 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Cancel Order</span>
          </button>
        </div>
      )}
    </div>
  );
}
