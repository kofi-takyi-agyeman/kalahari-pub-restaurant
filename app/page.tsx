"use client";

import React, { useState, useMemo } from "react";
import { FoodieTopBar } from "@/components/home/FoodieTopBar";
import { FoodieSearch } from "@/components/home/FoodieSearch";
import { FoodieHeroBanner } from "@/components/home/FoodieHeroBanner";
import { FoodieCategories } from "@/components/home/FoodieCategories";
import { FoodiePopularDishes } from "@/components/home/FoodiePopularDishes";
import { FoodieSpecialOffer } from "@/components/home/FoodieSpecialOffer";
import { FoodieTopRestaurants } from "@/components/home/FoodieTopRestaurants";
import { PinterestAnimatedShowcase } from "@/components/home/PinterestAnimatedShowcase";
import { menuItems } from "@/data/menuItems";
import { MenuItem } from "@/types";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // The 4 authentic popular Kalahari items
  const popularReferenceDishes = useMemo(() => {
    return menuItems.filter((dish) =>
      [
        "grilled-tilapia-whole",
        "jollof-rice-chicken",
        "beef-suya-khebab",
        "spicy-kelewele",
      ].includes(dish.id)
    );
  }, []);

  // Filtered dishes when searching or selecting a category
  const filteredDishes: MenuItem[] = useMemo(() => {
    if (!searchQuery && !selectedCategory) return [];

    return menuItems.filter((dish) => {
      const matchesSearch =
        !searchQuery ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        !selectedCategory || dish.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white selection:bg-[#FFC20E] selection:text-black">
      {/* 1. Header Bar: Kalahari Dine Logo, Slogan, Bag Drawer, Notifications & Profile */}
      <FoodieTopBar />

      {/* 2. Search & Filter Bar */}
      <FoodieSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => {
          if (selectedCategory) setSelectedCategory(null);
        }}
      />

      {/* Dynamic Search / Category Results View (if user is actively filtering) */}
      {(searchQuery || selectedCategory) && (
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-4 animate-in fade-in duration-300">
          <div className="p-4 sm:p-6 rounded-3xl bg-[#141419] border border-[#FFC20E]/30 shadow-xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-black text-lg text-white">
                Search Results{" "}
                {selectedCategory && (
                  <span className="text-[#FFC20E] capitalize font-medium">
                    in {selectedCategory}
                  </span>
                )}
                <span className="text-xs text-gray-400 font-normal ml-2">
                  ({filteredDishes.length} items found)
                </span>
              </h3>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="text-xs text-[#FFC20E] hover:underline font-bold"
              >
                Clear Filters
              </button>
            </div>

            {filteredDishes.length > 0 ? (
              <FoodiePopularDishes items={filteredDishes} />
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                No dishes found matching your criteria. Try searching for &ldquo;Tilapia&rdquo;, &ldquo;Jollof&rdquo;, &ldquo;Banku&rdquo;, or &ldquo;Kelewele&rdquo;.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Main Hero Banner: Delicious Ghanaian Food Delivered Fresh (Hot Banku • Charcoal Grill • Chilled Drinks) */}
      <FoodieHeroBanner />

      {/* 4. Category Badges (Charcoal Grill, Local Dishes, Jollof & Rice, Suya Khebab, Chilled Drinks, Kelewele) */}
      <FoodieCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 5. Popular Right Now: Whole Charcoal Tilapia (GH₵ 110), Deluxe Jollof (GH₵ 65), Beef Suya (GH₵ 50), Kelewele (GH₵ 35) */}
      <FoodiePopularDishes items={popularReferenceDishes} />

      {/* 6. Special Offer Promo Banner: Get 20% OFF On Your First Kalahari Order */}
      <FoodieSpecialOffer />

      {/* 7. Kalahari Dine & Grill Stations (Main Kitchen, Charcoal Grill, Chilled Drinks, Express Takeout) */}
      <FoodieTopRestaurants />

      {/* 8. Native Animated UI Showcase (From Pinterest Video Concept):
          - Sizzling Whole Tilapia Pan with Real Animated Rising Steam Wisps
          - Stacked Repeating Luxury Outlined Typography ('KALAHARI TASTE / CHARCOAL FLAVOUR')
          - Glowing Golden Halo Stat Pills (Locate Us, Open Hours, Direct Reservation)
          - Levitating 3D Floating Plates with Smooth Animations
          - Interactive Service Cards (Dine Experience, Fresh Grill, Speedy Delivery)
          - Customer Testimonials Slider
          - Interactive Table Reservation Form
      */}
      <PinterestAnimatedShowcase />
    </div>
  );
}
