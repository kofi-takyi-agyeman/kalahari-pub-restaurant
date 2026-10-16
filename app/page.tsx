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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // The 4 reference popular items from the screenshot
  const popularReferenceDishes = useMemo(() => {
    return menuItems.filter((dish) =>
      [
        "classic-burger",
        "chicken-tikka-pizza",
        "masala-fries",
        "chocolate-lava-cake",
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
      {/* 1. Header Bar: Foodie Khan Logo, Tagline, Notifications, Profile, Video Reel Pill */}
      <FoodieTopBar onOpenVideoModal={() => setIsVideoModalOpen(true)} />

      {/* 2. Search & Filter Bar */}
      <FoodieSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => {
          // If no category selected, cycle or clear
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
                No dishes found matching your criteria. Try searching for &ldquo;Burger&rdquo;, &ldquo;Pizza&rdquo;, or &ldquo;Fries&rdquo;.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Main Hero Banner: Delicious Food Delivered Fresh (Hot • Fresh • On Time) */}
      <FoodieHeroBanner />

      {/* 4. Category Badges (Burgers, Pizza, Pasta, Fries, Drinks, Desserts) */}
      <FoodieCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 5. Popular Right Now (Classic Burger, Chicken Tikka Pizza, Masala Fries, Chocolate Lava Cake) */}
      <FoodiePopularDishes items={popularReferenceDishes} />

      {/* 6. Special Offer Promo Banner: Get 20% OFF On Your First Order */}
      <FoodieSpecialOffer />

      {/* 7. Top Restaurants Near You: Burger Hub, Pizza Planet, Pasta House, Chai & More */}
      <FoodieTopRestaurants />

      {/* 8. Cinematic Animated UI Experience from Pinterest.mp4:
          - Sizzling Cast Iron Skillet
          - Stacked Repeating Outlined Typography
          - Glowing Halo Badges (Locate Us, Open Hours, Reservation)
          - Levitating 3D Tilt Plates
          - Interactive Services
          - Testimonials Slider
          - Book Your Table Form
          - Video Reel Modal
      */}
      <PinterestAnimatedShowcase
        isOpenVideoModal={isVideoModalOpen}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
        onCloseVideoModal={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
