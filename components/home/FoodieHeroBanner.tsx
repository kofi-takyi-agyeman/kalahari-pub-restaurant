"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";

export function FoodieHeroBanner() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-3 sm:my-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15151A] via-[#111115] to-[#0A0A0D] border border-[#262630] shadow-2xl">
        {/* Subtle Warm Amber Glow Behind Food */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#FFC20E]/10 blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#D92323]/10 blur-2xl pointer-events-none" />

        {/* Floating golden particle specks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-1/4 left-1/2 w-1.5 h-1.5 rounded-full bg-[#FFC20E]/40 animate-ping" />
          <span className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-[#FFC20E]/30 animate-pulse" />
          <span className="absolute bottom-1/4 right-1/4 w-1 h-1 rounded-full bg-[#FFC20E]/50 animate-bounce" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 relative z-10">
          {/* Left Text Content */}
          <div className="md:col-span-6 lg:col-span-7 space-y-3 sm:space-y-4 text-left">
            {/* Cursive Tagline */}
            <div>
              <span className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#FFC20E] font-bold tracking-wide drop-shadow-sm inline-block transform -rotate-1">
                Delicious Ghanaian Food
              </span>
            </div>

            {/* Bold Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Delivered <br className="hidden sm:inline" />
              Fresh &amp; Hot
            </h1>

            {/* Subtitle with bullet dots */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-medium">
              <span>Hot Banku</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC20E]" />
              <span>Charcoal Grill</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC20E]" />
              <span>Chilled Drinks</span>
            </div>

            {/* CTA Button: Yellow Pill "Order Now ->" */}
            <div className="pt-2 sm:pt-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2.5 bg-[#FFC20E] hover:bg-[#E5AC00] text-black font-extrabold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-200 shadow-[0_8px_25px_rgba(255,194,14,0.35)] hover:shadow-[0_10px_30px_rgba(255,194,14,0.5)] active:scale-95 group"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right Image Visual: Whole Charcoal Grilled Tilapia Platter */}
          <div className="md:col-span-6 lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] max-w-md mx-auto group">
              <Image
                src="/dishes/grilled_tilapia_platter.jpg"
                alt="Delicious Charcoal Grilled Tilapia Platter with Banku and Shito at Kalahari Dine"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E]/60 via-transparent to-transparent rounded-2xl pointer-events-none" />

              {/* Floating Live Badge */}
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-[#FFC20E]/40 text-[#FFC20E] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <Flame className="w-3.5 h-3.5 fill-[#FFC20E] text-[#FFC20E] animate-pulse" />
                <span>House Signature Platter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
