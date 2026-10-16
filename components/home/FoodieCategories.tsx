"use client";

import React from "react";

export interface FoodieCategoryItem {
  id: string;
  name: string;
  svgIcon: React.ReactNode;
}

interface FoodieCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function FoodieCategories({
  selectedCategory,
  onSelectCategory,
}: FoodieCategoriesProps) {
  const categoriesList: FoodieCategoryItem[] = [
    {
      id: "burgers",
      name: "Burgers",
      svgIcon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          {/* Bun top */}
          <path d="M4 11a8 8 0 0 1 16 0" />
          {/* Seeds */}
          <circle cx="8" cy="8" r="0.5" fill="currentColor" />
          <circle cx="12" cy="6.5" r="0.5" fill="currentColor" />
          <circle cx="16" cy="8" r="0.5" fill="currentColor" />
          {/* Cheese / filling */}
          <path d="M3 14h18" />
          <path d="M5 14l2 2h10l2-2" />
          {/* Patty */}
          <rect x="4" y="16" width="16" height="2" rx="1" />
          {/* Bun bottom */}
          <path d="M5 20h14a1 1 0 0 0 1-1v-0.5H4v0.5a1 1 0 0 0 1 1z" />
        </svg>
      ),
    },
    {
      id: "pizza",
      name: "Pizza",
      svgIcon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          {/* Pizza Slice */}
          <path d="M12 2l9 16.5a2 2 0 0 1-1.7 2.5H4.7A2 2 0 0 1 3 18.5L12 2z" />
          {/* Crust arc */}
          <path d="M4 19a16 16 0 0 0 16 0" />
          {/* Pepperoni circles */}
          <circle cx="12" cy="11" r="1.5" />
          <circle cx="9" cy="16" r="1.2" />
          <circle cx="15" cy="15.5" r="1.2" />
        </svg>
      ),
    },
    {
      id: "pasta",
      name: "Pasta",
      svgIcon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          {/* Bowl */}
          <path d="M3 11c0 6 4 10 9 10s9-4 9-10H3z" />
          {/* Steam / Noodles */}
          <path d="M8 8c0-2 2-3 2-5" />
          <path d="M12 8c0-2 2-3 2-5" />
          <path d="M16 8c0-2 2-3 2-5" />
          <path d="M6 11c1-2 3-2 6-2s5 0 6 2" />
        </svg>
      ),
    },
    {
      id: "fries",
      name: "Fries",
      svgIcon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          {/* French fries packet */}
          <path d="M6 10l2 11h8l2-11" />
          <path d="M6 10a6 6 0 0 1 12 0" />
          {/* Individual fries sticking out */}
          <path d="M8 10V4" />
          <path d="M11 10V2" />
          <path d="M13 10V3" />
          <path d="M16 10V5" />
        </svg>
      ),
    },
    {
      id: "drinks",
      name: "Drinks",
      svgIcon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          {/* Cup */}
          <path d="M6 8l1.5 13h9L18 8H6z" />
          {/* Lid */}
          <path d="M5 8h14" />
          <path d="M8 8V6h8v2" />
          {/* Straw */}
          <path d="M15 2l-3 4" />
        </svg>
      ),
    },
    {
      id: "desserts",
      name: "Desserts",
      svgIcon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          {/* Cake slice / cupcake */}
          <path d="M12 4a3 3 0 0 0-3 3v2h6V7a3 3 0 0 0-3-3z" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
          {/* Cake layers */}
          <path d="M5 12h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7z" />
          <path d="M5 16h14" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-4 sm:my-6">
      {/* Horizontal scroll container with hidden scrollbar for authentic mobile app feel */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() =>
                onSelectCategory(isSelected ? null : cat.id)
              }
              className={`flex-1 min-w-[82px] sm:min-w-[100px] flex flex-col items-center justify-center py-3.5 sm:py-4 px-2.5 rounded-2xl sm:rounded-3xl border transition-all duration-300 active:scale-95 group focus:outline-hidden snap-start ${
                isSelected
                  ? "bg-[#1C1C24] border-[#FFC20E] shadow-[0_0_20px_rgba(255,194,14,0.25)] text-[#FFC20E]"
                  : "bg-[#141419] border-[#24242E] hover:border-[#383848] text-gray-400 hover:text-white"
              }`}
            >
              {/* Icon Container with glowing neon yellow line icon */}
              <div
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isSelected
                    ? "text-[#FFC20E] drop-shadow-[0_0_10px_rgba(255,194,14,0.5)]"
                    : "text-[#FFC20E]/90 group-hover:text-[#FFC20E]"
                }`}
              >
                {cat.svgIcon}
              </div>

              {/* Title */}
              <span
                className={`text-xs sm:text-sm font-bold mt-2 tracking-wide transition-colors ${
                  isSelected
                    ? "text-white font-extrabold"
                    : "text-gray-300 group-hover:text-white"
                }`}
              >
                {cat.name}
              </span>

              {/* Active Indicator dot */}
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC20E] mt-1.5 shadow-[0_0_6px_#FFC20E]" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
