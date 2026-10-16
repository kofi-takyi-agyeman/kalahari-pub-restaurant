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
  const restaurants: RestaurantItem[] = [
    {
      id: "burger-hub",
      name: "Burger Hub",
      image: "/images/foodie/restaurant_burger_hub.jpg",
      rating: 4.5,
      reviewCount: "1.2k",
      distance: "0.5 km",
      tag: "Burgers & Fast Food",
    },
    {
      id: "pizza-planet",
      name: "Pizza Planet",
      image: "/images/foodie/popular_tikka_pizza.jpg",
      rating: 4.6,
      reviewCount: "850",
      distance: "1.2 km",
      tag: "Artisan Pizzas",
    },
    {
      id: "pasta-house",
      name: "Pasta House",
      image: "/images/foodie/culinary_pasta_dish.jpg",
      rating: 4.4,
      reviewCount: "620",
      distance: "2.0 km",
      tag: "Italian & Pastas",
    },
    {
      id: "chai-more",
      name: "Chai & More",
      image: "/images/foodie/restaurant_chai_drinks.jpg",
      rating: 4.3,
      reviewCount: "430",
      distance: "2.5 km",
      tag: "Tea & Snacks Cafe",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 sm:my-8 mb-12 sm:mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white tracking-tight">
          <MapPin className="w-5 h-5 text-[#FFC20E] shrink-0" />
          <span>Top Restaurants Near You</span>
        </h2>

        <Link
          href="/menu"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-300 hover:text-[#FFC20E] transition-colors group"
        >
          <span>See All</span>
          <ArrowRight className="w-4 h-4 text-[#FFC20E] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 4 Restaurant Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {restaurants.map((place) => (
          <Link
            key={place.id}
            href={`/menu?vendor=${place.id}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-[#141419] border border-[#22222B] hover:border-[#3A3A4A] p-2.5 sm:p-3 transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:-translate-y-1"
          >
            {/* Top Restaurant Image */}
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

                {/* Distance */}
                <div className="font-medium text-gray-400">
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
