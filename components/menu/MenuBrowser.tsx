"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FoodCard } from "@/components/menu/FoodCard";
import { Category, CategoryId, MenuItem } from "@/types";
import { SAMPLE_PRICE_DISCLAIMER } from "@/data/menuItems";
import {
  Search,
  X,
  AlertTriangle,
  Utensils,
  RotateCcw,
  Database,
  DatabaseZap,
  PhoneCall,
  ServerCrash,
} from "lucide-react";
import { businessConfig } from "@/lib/businessConfig";

interface MenuBrowserProps {
  initialCategories: Category[];
  initialItems: MenuItem[];
  isDatabaseConnected?: boolean;
  isFallback?: boolean;
  error?: string | null;
}

export function MenuBrowser({
  initialCategories,
  initialItems,
  isDatabaseConnected = false,
  isFallback = false,
  error = null,
}: MenuBrowserProps) {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as CategoryId) || "all";

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags?.some((t) =>
          t.toLowerCase().includes(query)
        );
        return matchesName || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [initialItems, selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  // If a real database query failed, display an honest error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-950 space-y-4">
          <div className="flex items-start gap-3">
            <ServerCrash className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-red-900">
                Menu Temporarily Unavailable from Database
              </h3>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                We encountered an issue retrieving the live menu from our database.
                Our engineering team has been notified.
              </p>
              <div className="mt-2 p-2.5 rounded-lg bg-red-100/70 text-xs font-mono text-red-900 overflow-x-auto">
                Diagnostic: {error}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-red-700">
              Need to order right now? Please call our verified kitchen lines:
            </span>
            <div className="flex gap-2">
              <a
                href={businessConfig.phones[0].telLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-charcoal text-white font-bold hover:bg-black transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Call {businessConfig.phones[0].formatted}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Database Connection Status & Sample Price Notice */}
      <div className="space-y-3">
        {/* Supabase Status Banner */}
        {isFallback ? (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-blue-950 font-semibold block mb-0.5">
                Phase 2 Architecture: Supabase Schema Prepared (Viewing Local Seed Data)
              </strong>
              <span>
                To connect to live Supabase PostgreSQL, set{" "}
                <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-mono text-[11px]">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-mono text-[11px]">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{" "}
                in your environment. See{" "}
                <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900 font-mono text-[11px]">
                  docs/SUPABASE_SETUP_GUIDE.md
                </code>
                .
              </span>
            </div>
            <span className="shrink-0 bg-blue-200/80 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
              Local Seed
            </span>
          </div>
        ) : isDatabaseConnected ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-900 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <DatabaseZap className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Live Database Connected:</strong> Serving active menu items directly from Supabase PostgreSQL with Row Level Security.
              </span>
            </div>
            <span className="shrink-0 bg-emerald-200/80 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
              PostgreSQL Active
            </span>
          </div>
        ) : null}

        {/* Conspicuous Sample Price Banner */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-4 sm:p-5 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-extrabold uppercase tracking-wide">
                {SAMPLE_PRICE_DISCLAIMER}
              </span>
              <p className="text-amber-900/80 mt-0.5">
                Official menu prices have not yet been finalized by Kalahari management.
                All pricing figures below are temporary demonstration estimates and will
                be updated in the Phase 3 owner dashboard.
              </p>
            </div>
          </div>

          <div className="shrink-0 text-xs font-semibold bg-amber-200/60 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
            Demonstration Content
          </div>
        </div>
      </div>

      {/* Controls: Search Field & Category Pills */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ghanaian dishes, tilapia, jollof, drinks..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-brand-cream-border rounded-xl text-brand-charcoal placeholder-gray-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow shadow-xs transition-all"
            aria-label="Search menu items"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-brand-charcoal"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === "all"
                ? "bg-brand-charcoal text-white"
                : "bg-white text-brand-charcoal border border-brand-cream-border hover:bg-brand-cream"
            }`}
          >
            All Items ({initialItems.length})
          </button>

          {initialCategories.map((cat) => {
            const count = initialItems.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-brand-charcoal text-white"
                    : "bg-white text-brand-charcoal border border-brand-cream-border hover:bg-brand-cream"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-brand-yellow text-brand-charcoal"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-brand-cream-border/60">
        <span>
          Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? "dish" : "dishes"}
          {selectedCategory !== "all" && ` in ${initialCategories.find(c => c.id === selectedCategory)?.name}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {(selectedCategory !== "all" || searchQuery) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-brand-red font-semibold hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Grid of Dishes or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-brand-cream-border p-12 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-brand-cream text-brand-charcoal/40 flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-display text-lg font-bold text-brand-charcoal mb-2">
            No dishes found
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try another dish or
            browse all categories.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Show Full Menu</span>
          </button>
        </div>
      )}
    </div>
  );
}
