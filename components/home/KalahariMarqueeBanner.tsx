"use client";

import React from "react";
import Link from "next/link";
import { Flame, Sparkles, Star, Utensils, Heart } from "lucide-react";

export function KalahariMarqueeBanner() {
  const marqueeItems = [
    { text: "Charcoal Grilled Whole Tilapia", icon: Flame, highlight: true },
    { text: "Pounded Fufu & Goat Light Soup", icon: Utensils, highlight: false },
    { text: "Deluxe Smoky Ghanaian Jollof", icon: Sparkles, highlight: true },
    { text: "Charcoal Beef Suya Khebab", icon: Flame, highlight: false },
    { text: "Kalahari Spiced Kelewele", icon: Heart, highlight: true },
    { text: "Authentic Waakye on Banana Leaf", icon: Star, highlight: false },
    { text: "Traditional Red-Red & Fried Plantain", icon: Utensils, highlight: true },
    { text: "Ice-Cold Club & Star Beer", icon: Sparkles, highlight: false },
    { text: "Fast Dine-in & Pickup at A-Lang", icon: Flame, highlight: true },
  ];

  return (
    <div className="w-full relative overflow-hidden py-3 sm:py-3.5 bg-gradient-to-r from-[#141419] via-[#1A1A22] to-[#141419] border-y border-[#FFC20E]/20 shadow-[0_0_25px_rgba(0,0,0,0.5)] my-2 sm:my-3">
      {/* Side gradient blur masks */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#0B0B0E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#0B0B0E] to-transparent z-10 pointer-events-none" />

      <Link href="/menu" className="block group">
        <div className="animate-marquee items-center gap-6 sm:gap-8 whitespace-nowrap">
          {/* Double repetition for seamless infinite loop */}
          {[...marqueeItems, ...marqueeItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-transform duration-200 group-hover:scale-105"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    item.highlight
                      ? "bg-[#FFC20E]/20 text-[#FFC20E] shadow-[0_0_10px_rgba(255,194,14,0.4)]"
                      : "bg-[#D92323]/20 text-[#D92323]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 animate-pulse" />
                </span>

                <span
                  className={
                    item.highlight
                      ? "text-[#FFC20E] drop-shadow-xs"
                      : "text-gray-200 group-hover:text-white"
                  }
                >
                  {item.text}
                </span>

                <span className="text-[#FFC20E]/40 font-bold ml-3 text-xs">•</span>
              </div>
            );
          })}
        </div>
      </Link>
    </div>
  );
}
