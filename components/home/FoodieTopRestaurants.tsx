"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, ArrowRight, MapPin } from "lucide-react";

export interface RestaurantItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: string;
  distance: string;
  tag?: string;
}

export function FoodieTopRestaurants() {
  const stations: RestaurantItem[] = [
    {
      id: "main-dining",
      name: "A-Lang Main Kitchen & Dining",
      image: "/dishes/grilled_tilapia_platter.jpg",
      rating: 4.9,
      reviewCount: "1.4k",
      distance: "0.0 km • Dine-in",
      tag: "Authentic Local Dishes",
    },
    {
      id: "charcoal-grill",
      name: "Charcoal Tilapia & Smoke Grill",
      image: "/dishes/grilled_guinea_fowl.jpg",
      rating: 4.9,
      reviewCount: "980",
      distance: "Fresh Off Coals",
      tag: "Whole Tilapia & Meats",
    },
    {
      id: "pub-bar",
      name: "Chilled Pub & Beer Garden",
      image: "/dishes/spicy_kelewele.jpg",
      rating: 4.8,
      reviewCount: "850",
      distance: "Ice-Cold Brews",
      tag: "Club, Guinness & Malt",
    },
    {
      id: "express-takeout",
      name: "Express Jollof & Takeout Desk",
      image: "/dishes/assorted_jollof_deluxe.jpg",
      rating: 4.7,
      reviewCount: "620",
      distance: "Fast Dispatch",
      tag: "Smoky Jollof & Waakye",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 sm:my-8 mb-12 sm:mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white tracking-tight">
          <MapPin className="w-5 h-5 text-[#FFC20E] shrink-0" />
          <span>Kalahari Dining &amp; Grill Stations</span>
        </h2>

        <Link
          href="/menu"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-300 hover:text-[#FFC20E] transition-colors group"
        >
          <span>See Menu</span>
          <ArrowRight className="w-4 h-4 text-[#FFC20E] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 4 Station Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {stations.map((place) => (
          <Link
            key={place.id}
            href="/menu"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-[#141419] border border-[#22222B] hover:border-[#3A3A4A] p-2.5 sm:p-3 transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:-translate-y-1"
          >
            {/* Top Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#0B0B0E]">
              <Image
                src={place.image}
                alt={place.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Title & Chevron Row */}
            <div className="mt-2.5 sm:mt-3 px-1 flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-display text-xs sm:text-sm font-extrabold text-white leading-tight truncate group-hover:text-[#FFC20E] transition-colors">
                  {place.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFC20E] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Rating & Distance */}
              <div className="mt-1.5 pt-1 border-t border-[#22222B] flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                {/* Rating with Gold Star */}
                <div className="flex items-center gap-1 font-semibold text-gray-300">
                  <Star className="w-3.5 h-3.5 fill-[#FFC20E] text-[#FFC20E]" />
                  <span>
                    {place.rating} ({place.reviewCount})
                  </span>
                </div>

                {/* Status/Distance */}
                <div className="font-medium text-gray-400 truncate max-w-[100px] text-right">
                  {place.distance}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
