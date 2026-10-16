"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { MenuItem } from "@/types";

interface FoodiePopularDishesProps {
  items: MenuItem[];
}

export function FoodiePopularDishes({ items }: FoodiePopularDishesProps) {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 sm:my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white tracking-tight">
          <span className="text-xl sm:text-2xl">🔥</span>
          <span>Popular Right Now</span>
        </h2>

        <Link
          href="/menu"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-300 hover:text-[#FFC20E] transition-colors group"
        >
          <span>See All</span>
          <ArrowRight className="w-4 h-4 text-[#FFC20E] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 4 Cards (Horizontal scroll on mobile, 4-col grid on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {items.map((dish) => {
          const isFav = !!favorites[dish.id];
          const isJustAdded = !!addedItems[dish.id];

          return (
            <div
              key={dish.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-[#141419] border border-[#22222B] hover:border-[#FFC20E]/50 p-2.5 sm:p-3 transition-all duration-400 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(255,194,14,0.18)] hover:-translate-y-2"
            >
              {/* Shimmer light reflection swipe on hover */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl z-10">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/8 to-transparent transform -skew-x-20 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
              </div>

              {/* Image & Favorite Badge */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#0B0B0E]">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                {/* Heart Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(dish.id, e)}
                  aria-label={`Favorite ${dish.name}`}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-115 active:scale-90 z-20"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isFav
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-white/80 hover:text-white"
                    }`}
                  />
                </button>
              </div>

              {/* Card Meta: Title & Price + Yellow Plus Button */}
              <div className="mt-2.5 sm:mt-3 px-1 flex flex-col justify-between flex-1 relative z-20">
                <div>
                  <h3 className="font-display text-xs sm:text-sm font-extrabold text-white leading-tight line-clamp-1 group-hover:text-[#FFC20E] transition-colors duration-200">
                    {dish.name}
                  </h3>
                </div>

                <div className="mt-2 pt-1 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-black text-gray-200">
                      GH₵ {Math.round(dish.samplePrice)}
                    </span>
                  </div>

                  {/* Yellow Plus Button with tactile bounce */}
                  <button
                    onClick={(e) => handleAddToCart(dish, e)}
                    disabled={!dish.isAvailable}
                    aria-label={`Add ${dish.name} to order`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black transition-all duration-200 active:scale-90 ${
                      isJustAdded
                        ? "bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.7)] scale-110 animate-pop-in"
                        : "bg-[#FFC20E] hover:bg-[#FFE066] text-black shadow-[0_4px_12px_rgba(255,194,14,0.35)] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,194,14,0.5)]"
                    }`}
                  >
                    {isJustAdded ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.8]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
