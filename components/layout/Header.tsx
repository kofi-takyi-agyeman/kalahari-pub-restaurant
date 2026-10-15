"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { businessConfig } from "@/lib/businessConfig";
import { useCart } from "@/lib/cartContext";
import { Logo } from "@/components/ui/Logo";
import {
  ShoppingBag,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu & Grill" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact & Map" },
  ];

  const primaryPhone = businessConfig.phones[0];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Utility Bar with Verified Location & Direct Phone Call */}
      <div className="bg-[#171714] text-white text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Location & Status Indicator */}
          <div className="flex items-center gap-2 text-gray-300 text-[11px] sm:text-xs truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green" />
            </span>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
              <span className="truncate font-medium">{businessConfig.location}</span>
            </div>
          </div>

          {/* Slogan (desktop) & Instant Tap-to-Call Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:inline text-gray-400 text-xs tracking-wide">
              {businessConfig.slogan}
            </span>
            <a
              href={primaryPhone.telLink}
              className="inline-flex items-center gap-1.5 bg-brand-yellow/15 hover:bg-brand-yellow/25 text-brand-yellow px-2.5 py-1 rounded-full font-black text-[11px] sm:text-xs border border-brand-yellow/30 transition-all active:scale-95"
              aria-label={`Call Kalahari Pub at ${primaryPhone.formatted}`}
            >
              <Phone className="w-3 h-3 text-brand-yellow shrink-0 animate-pulse" />
              <span>Call: {primaryPhone.formatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-brand-cream-border/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Kalahari Signature Brand Logo */}
            <div className="flex items-center">
              {/* Desktop logo */}
              <div className="hidden sm:block">
                <Logo variant="compact" size="md" asLink href="/" />
              </div>
              {/* Mobile compact logo */}
              <div className="sm:hidden">
                <Logo variant="compact" size="sm" asLink href="/" />
              </div>
            </div>

            {/* Desktop Navigation Links (Pill Style) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-brand-cream/50 p-1.5 rounded-full border border-brand-cream-border">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-bold text-xs lg:text-sm tracking-wide transition-all duration-200 px-4 py-2 rounded-full ${
                      isActive
                        ? "bg-[#171714] text-brand-yellow shadow-sm font-black"
                        : "text-brand-charcoal hover:text-brand-red hover:bg-white/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions: Cart & Order Now */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full border border-brand-cream-border hover:border-brand-yellow bg-white hover:bg-brand-cream text-brand-charcoal transition-all active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
                aria-label={`Open shopping bag, ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5 text-brand-charcoal" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Order Now CTA (tablet & desktop) */}
              <Link
                href="/menu"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-brand-yellow via-[#FFE53B] to-brand-yellow hover:from-brand-yellow-hover hover:to-brand-yellow text-brand-charcoal font-black px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 text-xs sm:text-sm min-h-[44px] border border-brand-yellow-hover"
              >
                <Sparkles className="w-4 h-4 fill-brand-charcoal" />
                <span>Order Now</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
