"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FoodieSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
}

export function FoodieSearch({
  searchQuery,
  onSearchChange,
  onFilterClick,
}: FoodieSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-3">
      <div
        className={`relative flex items-center bg-[#15151A] rounded-2xl border transition-all duration-300 shadow-lg ${
          isFocused
            ? "border-[#FFC20E] ring-2 ring-[#FFC20E]/20 shadow-[0_0_20px_rgba(255,194,14,0.15)]"
            : "border-[#25252E] hover:border-[#383845]"
        }`}
      >
        {/* Search Icon */}
        <div className="pl-4 sm:pl-5 text-gray-400 flex items-center justify-center">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for food, restaurant or items..."
          className="w-full py-3.5 sm:py-4 px-3 sm:px-4 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-hidden"
          aria-label="Search food, restaurants or items"
        />

        {/* Clear query button if typed */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="p-1.5 mr-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Filter Sliders Button */}
        <div className="pr-3 sm:pr-4 flex items-center">
          <button
            onClick={onFilterClick}
            className="p-2 sm:p-2.5 rounded-xl bg-[#1D1D24] hover:bg-[#282833] text-gray-300 hover:text-[#FFC20E] border border-[#2D2D38] hover:border-[#FFC20E]/40 transition-all duration-200 active:scale-95"
            aria-label="Filter options"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
