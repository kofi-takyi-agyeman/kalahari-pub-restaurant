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
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* Top Utility Bar with Verified Location & Phone */}
      <div className="bg-brand-charcoal text-white text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-brand-charcoal-muted">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Location snippet */}
          <div className="flex items-center gap-1.5 text-gray-300 text-[11px] sm:text-xs truncate">
            <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
            <span className="truncate">{businessConfig.location}</span>
          </div>

          {/* Slogan (desktop) & Instant Tap-to-Call */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:inline text-gray-400 text-xs">
              {businessConfig.slogan}
            </span>
            <a
              href={primaryPhone.telLink}
              className="inline-flex items-center gap-1 text-brand-yellow font-bold text-[11px] sm:text-xs hover:underline min-h-[28px] py-0.5"
              aria-label={`Call Kalahari Pub at ${primaryPhone.formatted}`}
            >
              <Phone className="w-3 h-3 text-brand-red shrink-0" />
              <span>Call: {primaryPhone.formatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-brand-cream-border transition-colors">
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

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-semibold text-sm tracking-wide transition-colors relative py-1.5 ${
                      isActive
                        ? "text-brand-red font-bold"
                        : "text-brand-charcoal hover:text-brand-red"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions: Cart & Order Now */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl border border-brand-cream-border hover:bg-brand-cream text-brand-charcoal transition-all active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Open shopping bag, ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5 text-brand-charcoal" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Order Now CTA (tablet & desktop) */}
              <Link
                href="/menu"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs hover:shadow active:scale-95 text-xs sm:text-sm min-h-[44px]"
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
