"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { businessConfig } from "@/lib/businessConfig";
import { useCart } from "@/lib/cartContext";
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  MapPin,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const primaryPhone = businessConfig.phones[0];

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Utility Bar with Verified Location & Phone */}
      <div className="bg-brand-charcoal text-white text-xs py-2 px-4 border-b border-brand-charcoal-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 text-gray-300">
            <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
            <span>{businessConfig.location}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-gray-400">
              {businessConfig.slogan}
            </span>
            <a
              href={primaryPhone.telLink}
              className="inline-flex items-center gap-1.5 text-brand-yellow font-bold hover:underline"
            >
              <Phone className="w-3 h-3 text-brand-red" />
              <span>Call Us: {primaryPhone.formatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-brand-cream-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Typographic Wordmark / Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-brand-yellow rounded-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-charcoal flex items-center justify-center text-brand-yellow shadow-md group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-brand-charcoal leading-none">
                    KALAHARI
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-cream px-1.5 py-0.5 rounded border border-brand-cream-border">
                    PUB
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mt-0.5">
                  &amp; Restaurant
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-semibold text-sm tracking-wide transition-colors relative py-1 ${
                      isActive
                        ? "text-brand-red"
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
            <div className="flex items-center gap-3">
              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl border border-brand-cream-border hover:bg-brand-cream text-brand-charcoal transition-all active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
                aria-label={`Open order bag, ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Order Now CTA */}
              <Link
                href="/menu"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 text-sm"
              >
                <Sparkles className="w-4 h-4 fill-brand-charcoal" />
                <span>Order Now</span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-brand-charcoal hover:bg-brand-cream border border-brand-cream-border"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-cream-border bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-bold text-base transition-colors ${
                      isActive
                        ? "bg-brand-cream text-brand-red font-black"
                        : "text-brand-charcoal hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-brand-cream-border space-y-2">
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold py-3 px-4 rounded-xl text-center shadow-sm"
              >
                <span>Order Now</span>
              </Link>

              <div className="pt-2 text-xs text-gray-500 text-center">
                <p className="font-semibold text-brand-charcoal">
                  Kalahari Pub, A-Lang Taxi Rank
                </p>
                <p className="mt-0.5">Call: 0245656849 / 0207157071 / 0246773225</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
