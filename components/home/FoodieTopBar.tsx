"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, User, ShoppingBag, Sparkles, MapPin } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { businessConfig } from "@/lib/businessConfig";

export function FoodieTopBar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [hasNotification, setHasNotification] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  return (
    <div className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3">
      {/* Brand: Kalahari with Fork Motif & Slogan */}
      <Link href="/" className="group flex flex-col select-none focus:outline-hidden">
        <div className="flex items-center gap-2">
          {/* Stylized Logo text with golden glow matching the screenshot */}
          <div className="relative">
            <span className="font-script text-3xl sm:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0B3] to-[#FFC20E] drop-shadow-[0_2px_12px_rgba(255,194,14,0.45)] group-hover:scale-105 transition-transform duration-200">
              Kalahari <span className="text-[#FFC20E]">Pub</span>
            </span>
            {/* Golden fork accent dot */}
            <span className="absolute -top-1 -right-3 text-[#FFC20E] text-xs animate-bounce">
              🍴
            </span>
          </div>
        </div>
        {/* Slogan matching screenshot */}
        <div className="flex items-center gap-1.5 -mt-1 pl-1">
          <span className="font-script text-xs sm:text-sm text-[#FFC20E] tracking-wider font-semibold opacity-90">
            {businessConfig.slogan}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC20E]/70 animate-pulse" />
        </div>
      </Link>

      {/* Right Controls: Cart Bag + Bell Notification + Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 relative">
        {/* Cart Bag Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#18181D] hover:bg-[#22222A] border border-[#2B2B36] hover:border-[#FFC20E]/50 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 active:scale-95 focus:outline-hidden"
          aria-label={`Open shopping bag, ${totalItems} items`}
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D92323] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#0B0B0E] animate-bounce">
              {totalItems}
            </span>
          )}
        </button>

        {/* Bell Notification Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationPopup(!showNotificationPopup);
              setHasNotification(false);
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#18181D] hover:bg-[#22222A] border border-[#2B2B36] flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 active:scale-95 focus:outline-hidden"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {hasNotification && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FFC20E] rounded-full ring-2 ring-[#0B0B0E] shadow-[0_0_8px_#FFC20E] animate-pulse" />
            )}
          </button>

          {/* Mini Notification Dropdown */}
          {showNotificationPopup && (
            <div className="absolute right-0 top-12 z-50 w-72 p-3 bg-[#16161B] border border-[#2D2D38] rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#262632] mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC20E]" />
                  Kalahari Kitchen
                </span>
                <span className="text-[10px] text-gray-400">Fresh off grill</span>
              </div>
              <div className="p-2 rounded-xl bg-[#202028] text-xs space-y-1">
                <p className="font-semibold text-[#FFC20E]">🔥 Fresh Whole Tilapia Ready!</p>
                <p className="text-gray-300 text-[11px]">
                  Charcoal grilled fresh with hot banku and house shito at {businessConfig.location}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Icon */}
        <button
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#18181D] hover:bg-[#22222A] border border-[#2B2B36] flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 active:scale-95 focus:outline-hidden"
          aria-label="User Account"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
