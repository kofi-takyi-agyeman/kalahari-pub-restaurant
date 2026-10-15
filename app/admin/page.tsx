import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { businessConfig } from "@/lib/businessConfig";
import {
  ShieldCheck,
  Lock,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  TrendingUp,
  Image as ImageIcon,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Admin Portal Architecture | ${businessConfig.name}`,
  description: `Phase 3 administrative portal architectural blueprint for ${businessConfig.name}.`,
};

export default function AdminPage() {
  const plannedModules = [
    {
      icon: Lock,
      title: "1. Secure Authentication & RBAC",
      description:
        "Role-Based Access Control powered by Supabase Auth with multi-factor authentication, email-link or credentials, and strict server-side session cookies.",
      status: "Scheduled for Phase 3",
    },
    {
      icon: UtensilsCrossed,
      title: "2. Live Menu & Pricing Manager",
      description:
        "Instant CRUD interface allowing the restaurant owner to add new dishes, adjust verified prices in GHS, toggle daily availability, and set featured badges.",
      status: "Scheduled for Phase 3",
    },
    {
      icon: ImageIcon,
      title: "3. Food Photography & Asset Uploads",
      description:
        "Cloud Storage bucket integration for high-resolution dish photos with automated WebP compression and responsive thumbnail generation.",
      status: "Scheduled for Phase 3",
    },
    {
      icon: Layers,
      title: "4. Category Hierarchy Management",
      description:
        "Create, reorder, and update menu categories (Local Dishes, Grilled Food, Rice Meals, Drinks) with real-time storefront synchronization.",
      status: "Scheduled for Phase 3",
    },
    {
      icon: ShoppingBag,
      title: "5. Real-Time Order Management Queue",
      description:
        "Live audio-visual order ticker with status workflows (Pending, Preparing, Ready for Pickup, Out for Delivery, Completed, Cancelled).",
      status: "Scheduled for Phase 3",
    },
    {
      icon: TrendingUp,
      title: "6. Sales Insights & Business Analytics",
      description:
        "Daily, weekly, and monthly revenue metrics, top-selling Ghanaian dishes, peak ordering hours, and customer retention metrics.",
      status: "Scheduled for Phase 3",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-charcoal text-white py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal-card border border-brand-yellow/30 text-brand-yellow text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-brand-yellow" />
            <span>Architecture Blueprint &amp; Security Boundary</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Administrative Management Portal
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Preview of the management capabilities planned for the owner of{" "}
            <strong>{businessConfig.name}</strong>. In compliance with security best
            practices, no unsecured backdoor or hardcoded credentials exist in Phase 1.
          </p>
        </div>

        {/* Security Notice Box */}
        <div className="rounded-2xl bg-amber-950/40 border border-amber-800/80 p-5 text-amber-200 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <h3 className="font-bold text-amber-100 uppercase tracking-wide">
              Security Protocol Notice
            </h3>
            <p className="leading-relaxed">
              Per strict security engineering principles, this administrative dashboard
              is not exposed with insecure mock authentication or client-side bypasses.
              Real Supabase Auth, Row-Level Security (RLS), and database persistence
              will be integrated in subsequent phases.
            </p>
          </div>
        </div>

        {/* Planned Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plannedModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.title}
                className="bg-brand-charcoal-card rounded-2xl p-6 border border-brand-charcoal-muted flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-charcoal flex items-center justify-center text-brand-yellow border border-brand-charcoal-muted">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    {module.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-charcoal-muted flex items-center justify-between text-[11px]">
                  <span className="text-brand-yellow font-medium">
                    {module.status}
                  </span>
                  <span className="text-gray-500">Data_Nova</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture Stack */}
        <div className="bg-brand-charcoal-card rounded-3xl p-8 border border-brand-charcoal-muted space-y-6">
          <h2 className="font-display text-xl font-bold text-white">
            Upcoming Supabase Backend Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted space-y-1">
              <span className="text-gray-400 font-bold uppercase tracking-wider block">
                Database
              </span>
              <p className="text-white font-medium">
                PostgreSQL with Row Level Security (RLS) policies for menu &amp; orders.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted space-y-1">
              <span className="text-gray-400 font-bold uppercase tracking-wider block">
                Authentication
              </span>
              <p className="text-white font-medium">
                Encrypted sessions, httpOnly JWT cookies, and role verified endpoints.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted space-y-1">
              <span className="text-gray-400 font-bold uppercase tracking-wider block">
                Order Pipeline
              </span>
              <p className="text-white font-medium">
                Real-time WebSockets / Supabase subscriptions for live kitchen notifications.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-charcoal-muted">
            <span className="text-xs text-gray-400">
              {businessConfig.developer.credit} &bull; Phase 1 Foundation Active
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold px-5 py-2.5 rounded-xl transition-all text-xs"
            >
              <span>Return to Public Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
