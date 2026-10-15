"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import {
  Home,
  Flame,
  ShoppingBag,
  Store,
  PhoneCall,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  const isMenu = pathname.startsWith("/menu");
  const isHome = pathname === "/";
  const isAbout = pathname.startsWith("/about");
  const isContact = pathname.startsWith("/contact");

  return (
    <nav
      className="fixed bottom-2 left-2 right-2 sm:left-4 sm:right-4 z-40 md:hidden transition-all duration-300"
      aria-label="Mobile Navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-md mx-auto bg-[#171714]/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] px-2 py-1.5 flex items-center justify-between">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 focus:outline-hidden ${
            isHome ? "text-brand-yellow" : "text-gray-400 hover:text-white"
          }`}
          aria-label="Home"
        >
          <div className="relative flex items-center justify-center">
            <Home
              className={`w-5 h-5 transition-transform ${
                isHome ? "stroke-[2.5] scale-110" : "stroke-2"
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase mt-1 leading-none ${
              isHome ? "font-black text-brand-yellow" : "font-bold text-gray-400"
            }`}
          >
            Home
          </span>
          {isHome ? (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1 shadow-xs shadow-brand-yellow" />
          ) : (
            <span className="w-1.5 h-1.5 mt-1" />
          )}
        </Link>

        {/* 2. Menu (Flame Grill) */}
        <Link
          href="/menu"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 focus:outline-hidden ${
            isMenu ? "text-brand-yellow" : "text-gray-400 hover:text-white"
          }`}
          aria-label="Menu and Grill"
        >
          <div className="relative flex items-center justify-center">
            <Flame
              className={`w-5 h-5 transition-transform ${
                isMenu
                  ? "stroke-[2.5] fill-brand-yellow/30 text-brand-yellow scale-110"
                  : "stroke-2"
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase mt-1 leading-none ${
              isMenu ? "font-black text-brand-yellow" : "font-bold text-gray-400"
            }`}
          >
            Menu
          </span>
          {isMenu ? (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1 shadow-xs shadow-brand-yellow" />
          ) : (
            <span className="w-1.5 h-1.5 mt-1" />
          )}
        </Link>

        {/* 3. CENTER HERO ACTION: Bag / Cart */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative flex flex-col items-center justify-center focus:outline-hidden"
            aria-label={`View order bag with ${totalItems} items`}
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-brand-yellow via-[#FFE53B] to-[#F9D817] p-0.5 shadow-[0_8px_25px_rgba(249,216,23,0.45)] ring-4 ring-[#171714] active:scale-95 transition-transform duration-200 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-brand-yellow flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-brand-charcoal stroke-[2.3] group-hover:scale-110 transition-transform" />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#171714] animate-bounce">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black text-brand-yellow tracking-widest uppercase mt-1 leading-none drop-shadow-sm">
              Bag
            </span>
          </button>
        </div>

        {/* 4. About */}
        <Link
          href="/about"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 focus:outline-hidden ${
            isAbout ? "text-brand-yellow" : "text-gray-400 hover:text-white"
          }`}
          aria-label="About Kalahari"
        >
          <div className="relative flex items-center justify-center">
            <Store
              className={`w-5 h-5 transition-transform ${
                isAbout ? "stroke-[2.5] scale-110" : "stroke-2"
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase mt-1 leading-none ${
              isAbout ? "font-black text-brand-yellow" : "font-bold text-gray-400"
            }`}
          >
            About
          </span>
          {isAbout ? (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1 shadow-xs shadow-brand-yellow" />
          ) : (
            <span className="w-1.5 h-1.5 mt-1" />
          )}
        </Link>

        {/* 5. Contact & Map */}
        <Link
          href="/contact"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 focus:outline-hidden ${
            isContact ? "text-brand-yellow" : "text-gray-400 hover:text-white"
          }`}
          aria-label="Contact and Map"
        >
          <div className="relative flex items-center justify-center">
            <PhoneCall
              className={`w-5 h-5 transition-transform ${
                isContact ? "stroke-[2.5] scale-110" : "stroke-2"
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase mt-1 leading-none ${
              isContact ? "font-black text-brand-yellow" : "font-bold text-gray-400"
            }`}
          >
            Contact
          </span>
          {isContact ? (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1 shadow-xs shadow-brand-yellow" />
          ) : (
            <span className="w-1.5 h-1.5 mt-1" />
          )}
        </Link>
      </div>
    </nav>
  );
}
