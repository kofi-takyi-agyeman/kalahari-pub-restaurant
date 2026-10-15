"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import { menuItems, SAMPLE_PRICE_DISCLAIMER } from "@/data/menuItems";
import { FoodCard } from "@/components/menu/FoodCard";
import { CategoryId } from "@/types";
import { Search, X, AlertTriangle, Utensils, RotateCcw } from "lucide-react";

export function MenuBrowser() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as CategoryId) || "all";

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
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
  }, [selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-8">
      {/* Sample Price Notice Header */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-4 sm:p-5 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-extrabold uppercase tracking-wide">
              {SAMPLE_PRICE_DISCLAIMER}
            </span>
            <p className="text-amber-900/80 mt-0.5">
              Official menu prices have not yet been provided by Kalahari management.
              All pricing figures below are temporary demonstration estimates.
            </p>
          </div>
        </div>

        <div className="shrink-0 text-xs font-semibold bg-amber-200/60 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
          Demonstration Content
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
            All Items ({menuItems.length})
          </button>

          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.category === cat.id).length;
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
          {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
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
