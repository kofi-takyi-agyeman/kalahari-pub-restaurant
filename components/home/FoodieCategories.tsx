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
      id: "grilled-food",
      name: "Charcoal Grill",
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
          {/* Grill rack & flames */}
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          <path d="M4 19h16" />
          <path d="M7 22v-3" />
          <path d="M17 22v-3" />
        </svg>
      ),
    },
    {
      id: "local-dishes",
      name: "Local Dishes",
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
          {/* Traditional Pot / Bowl with soup & swallow */}
          <path d="M3 11c0 6 4 10 9 10s9-4 9-10H3z" />
          <path d="M8 8c0-2 2-3 2-5" />
          <path d="M12 8c0-2 2-3 2-5" />
          <path d="M16 8c0-2 2-3 2-5" />
          <path d="M4 11h16" />
        </svg>
      ),
    },
    {
      id: "rice-meals",
      name: "Jollof & Rice",
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
          {/* Steaming aromatic rice bowl */}
          <path d="M4 12c0 5 3.5 8 8 8s8-3 8-8H4z" />
          <path d="M6 12a6 6 0 0 1 12 0" />
          <path d="M10 6c0-1.5 1-2 1-3" />
          <path d="M14 6c0-1.5 1-2 1-3" />
        </svg>
      ),
    },
    {
      id: "suya-khebab",
      name: "Suya Khebab",
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
          {/* Skewers with seasoned meat cuts */}
          <line x1="3" y1="21" x2="21" y2="3" />
          <circle cx="8" cy="16" r="2.5" />
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="16" cy="8" r="2.5" />
        </svg>
      ),
    },
    {
      id: "drinks",
      name: "Chilled Pub",
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
          {/* Beer bottle / Pub mug */}
          <path d="M17 11h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1" />
          <path d="M9 2v3" />
          <path d="M13 2v3" />
          <path d="M5 8h12v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z" />
        </svg>
      ),
    },
    {
      id: "kelewele",
      name: "Kelewele",
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
          {/* Spiced plantain snack dish */}
          <path d="M4 14c2-4 6-6 10-6 3 0 5 1 6 3-2 4-6 6-10 6-3 0-5-1-6-3z" />
          <circle cx="9" cy="13" r="1.5" />
          <circle cx="14" cy="12" r="1.5" />
          <circle cx="12" cy="15" r="1" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-4 sm:my-6">
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() =>
                onSelectCategory(isSelected ? null : cat.id)
              }
              className={`flex-1 min-w-[84px] sm:min-w-[105px] flex flex-col items-center justify-center py-3.5 sm:py-4 px-2 rounded-2xl sm:rounded-3xl border transition-all duration-300 active:scale-95 group focus:outline-hidden snap-start ${
                isSelected
                  ? "bg-[#1C1C24] border-[#FFC20E] shadow-[0_0_20px_rgba(255,194,14,0.25)] text-[#FFC20E]"
                  : "bg-[#141419] border-[#24242E] hover:border-[#383848] text-gray-400 hover:text-white"
              }`}
            >
              <div
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isSelected
                    ? "text-[#FFC20E] drop-shadow-[0_0_10px_rgba(255,194,14,0.5)]"
                    : "text-[#FFC20E]/90 group-hover:text-[#FFC20E]"
                }`}
              >
                {cat.svgIcon}
              </div>

              <span
                className={`text-[11px] sm:text-xs font-bold mt-2 tracking-wide text-center leading-tight transition-colors ${
                  isSelected
                    ? "text-white font-extrabold"
                    : "text-gray-300 group-hover:text-white"
                }`}
              >
                {cat.name}
              </span>

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
