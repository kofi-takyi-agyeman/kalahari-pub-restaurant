import React from "react";
import Link from "next/link";
import { menuItems } from "@/data/menuItems";
import { FoodCard } from "@/components/menu/FoodCard";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";

export function FeaturedDishes() {
  // Filter dishes flagged as featured (the ones matching the flyer suggestions)
  const featured = menuItems.filter((dish) => dish.isFeatured);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-brand-cream-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 fill-brand-red" />
              <span>Chef &amp; Pub Recommendations</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight">
              Featured Specialties
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl">
              Authentic Ghanaian local staples, flame-grilled seafood, and fragrant
              rice dishes prepared with care.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:text-brand-red-hover transition-colors group self-start md:self-auto"
          >
            <span>See All Dishes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Global Conspicuous Sample Price Banner */}
        <div className="mb-8 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-900 flex items-start sm:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <span className="font-bold">DEVELOPMENT PRICING NOTICE:</span> All prices
            displayed below are sample demonstration figures (
            <span className="font-semibold underline">
              SAMPLE PRICE — CONFIRM WITH RESTAURANT
            </span>
            ). Official pricing will be confirmed directly with the restaurant or
            updated in Phase 2.
          </div>
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((dish) => (
            <FoodCard key={dish.id} item={dish} />
          ))}
        </div>

        {/* Bottom CTA to full menu */}
        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-brand-charcoal hover:bg-black text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md active:scale-95 text-sm"
          >
            <span>Explore Complete Kalahari Menu</span>
            <ArrowRight className="w-4 h-4 text-brand-yellow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
