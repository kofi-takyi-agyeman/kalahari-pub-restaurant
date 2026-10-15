"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  MapPin,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      exact: true,
    },
    {
      href: "/menu",
      label: "Menu",
      icon: UtensilsCrossed,
      exact: false,
    },
    {
      label: "Bag",
      icon: ShoppingBag,
      isCart: true,
      badge: totalItems,
    },
    {
      href: "/about",
      label: "About",
      icon: Store,
      exact: false,
    },
    {
      href: "/contact",
      label: "Contact",
      icon: MapPin,
      exact: false,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-cream-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden transition-all"
      aria-label="Mobile Bottom Navigation"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 6px)" }}
    >
      <div className="grid grid-cols-5 items-center h-15 px-1 max-w-lg mx-auto">
        {navItems.map((item, idx) => {
          const isActive =
            !item.isCart &&
            (item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href || ""));

          // Cart trigger tab
          if (item.isCart) {
            return (
              <button
                key="cart-tab"
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center py-1 relative min-h-[48px] focus:outline-hidden group"
                aria-label={`Open shopping bag with ${totalItems} items`}
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-charcoal group-active:scale-95 transition-transform shadow-xs">
                    <ShoppingBag className="w-5 h-5 text-brand-charcoal" />
                  </div>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-brand-charcoal tracking-wider uppercase mt-0.5">
                  Bag
                </span>
              </button>
            );
          }

          const IconComponent = item.icon;

          return (
            <Link
              key={item.href || idx}
              href={item.href || "/"}
              className={`flex flex-col items-center justify-center py-1 min-h-[48px] transition-all relative focus:outline-hidden group ${
                isActive
                  ? "text-brand-red"
                  : "text-gray-500 hover:text-brand-charcoal"
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-transform group-active:scale-90 ${
                    isActive ? "stroke-[2.5] text-brand-red" : "stroke-2"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] tracking-wider uppercase mt-1 leading-none ${
                  isActive
                    ? "font-black text-brand-red"
                    : "font-semibold text-gray-500"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-brand-red mt-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
