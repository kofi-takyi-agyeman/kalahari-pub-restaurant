"use client";

import React from "react";
import { OrderStatus, OrderType } from "@/types/database.types";
import { CheckCircle2, Clock, UtensilsCrossed, Truck, Building2, AlertCircle } from "lucide-react";

interface OrderTrackerStepperProps {
  status: OrderStatus;
  orderType: OrderType;
}

export function OrderTrackerStepper({ status, orderType }: OrderTrackerStepperProps) {
  if (status === "cancelled") {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-900 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <strong className="block font-bold">Order Cancelled</strong>
          <span>This order has been cancelled by Kalahari staff or at customer request.</span>
        </div>
      </div>
    );
  }

  const steps = [
    {
      key: "pending",
      label: "Order Received",
      desc: "Awaiting staff review",
      icon: Clock,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      desc: "Kitchen accepted",
      icon: CheckCircle2,
    },
    {
      key: "preparing",
      label: "Cooking",
      desc: "Food on the grill",
      icon: UtensilsCrossed,
    },
    {
      key: "ready",
      label: orderType === "delivery" ? "With Rider" : "Ready for Pickup",
      desc: orderType === "delivery" ? "Dispatched" : "Ready at counter",
      icon: orderType === "delivery" ? Truck : Building2,
    },
  ];

  const statusOrder: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    ready: 3,
    completed: 4,
  };

  const currentStepIndex = statusOrder[status] ?? 0;

  return (
    <div className="w-full py-4 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {steps.map((step, index) => {
          const isPast = currentStepIndex > index;
          const isCurrent = currentStepIndex === index;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                isCurrent
                  ? "bg-amber-50/90 border-amber-300 ring-2 ring-brand-yellow/50"
                  : isPast
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? "bg-brand-charcoal text-brand-yellow animate-pulse"
                      : isPast
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">
                  0{index + 1}
                </span>
              </div>

              <div>
                <h4
                  className={`text-xs font-bold ${
                    isCurrent
                      ? "text-brand-charcoal"
                      : isPast
                      ? "text-emerald-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  {isCurrent ? "Active now" : step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
