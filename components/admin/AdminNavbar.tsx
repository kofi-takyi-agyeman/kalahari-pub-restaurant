"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogoutAction } from "@/app/actions/adminAuthActions";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

interface AdminNavbarProps {
  userEmail: string;
}

export function AdminNavbar({ userEmail }: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders Queue", icon: ShoppingBag },
    { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await adminLogoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  // If on login page, don't show the admin navbar
  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <header className="bg-brand-charcoal border-b border-brand-charcoal-muted sticky top-0 z-40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <Logo variant="icon" size="sm" />
              <div className="flex flex-col">
                <span className="font-display font-black text-sm sm:text-base tracking-tight text-white leading-none">
                  KALAHARI <span className="text-brand-yellow font-extrabold text-xs">PUB</span>
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest hidden sm:inline">
                  Admin Portal
                </span>
              </div>
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-charcoal-card border border-brand-charcoal-muted text-brand-yellow">
              Staff
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-brand-yellow text-brand-charcoal shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Staff Email & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-brand-yellow transition-colors"
              title="Open customer website in new tab"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-charcoal-card border border-brand-charcoal-muted text-[11px] text-gray-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
              <span className="max-w-[130px] truncate">{userEmail}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-bold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-charcoal-muted bg-brand-charcoal-card px-4 pt-3 pb-5 space-y-2">
          <div className="pb-3 border-b border-brand-charcoal-muted flex items-center justify-between">
            <Logo variant="dark" size="xs" />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block">Logged in as:</span>
              <span className="font-bold text-white text-xs">{userEmail}</span>
            </div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isActive
                    ? "bg-brand-yellow text-brand-charcoal"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-yellow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Customer Storefront</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
