"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Sparkles } from "lucide-react";

export function FoodieHeroBanner() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-3 sm:my-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15151A] via-[#111115] to-[#0A0A0D] border border-[#262630] shadow-2xl group">
        {/* Shimmer Light Beam Sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20">
          <div className="w-1/3 h-[200%] -top-1/2 absolute bg-gradient-to-r from-transparent via-white/8 to-transparent transform -skew-x-25 animate-shimmer-sweep pointer-events-none" />
        </div>

        {/* Subtle Warm Amber Glow Behind Food */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#FFC20E]/15 blur-3xl pointer-events-none animate-pulse-halo" />
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#D92323]/15 blur-2xl pointer-events-none" />

        {/* Floating golden particle specks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <span className="absolute top-1/4 left-1/2 w-1.5 h-1.5 rounded-full bg-[#FFC20E]/60 animate-ping" />
          <span className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-[#FFC20E]/40 animate-pulse" />
          <span className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-[#FFC20E]/70 animate-bounce" />
          <span className="absolute bottom-1/3 right-12 w-2 h-2 rounded-full bg-[#D92323]/80 animate-ember-1" />
          <span className="absolute bottom-1/2 right-24 w-1.5 h-1.5 rounded-full bg-[#FFC20E]/90 animate-ember-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 relative z-10">
          {/* Left Text Content */}
          <div className="md:col-span-6 lg:col-span-7 space-y-3 sm:space-y-4 text-left">
            {/* Cursive Tagline with glowing icon */}
            <div className="inline-flex items-center gap-2">
              <span className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#FFC20E] font-bold tracking-wide drop-shadow-sm inline-block transform -rotate-1">
                Delicious Ghanaian Food
              </span>
              <Sparkles className="w-4 h-4 text-[#FFC20E] animate-pulse" />
            </div>

            {/* Bold Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Delivered <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0B3] to-[#FFC20E]">
                Fresh &amp; Hot
              </span>
            </h1>

            {/* Subtitle with animated bullet dots */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-medium">
              <span>Hot Banku</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC20E] animate-ping" />
              <span>Charcoal Grill</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC20E] animate-pulse" />
              <span>Chilled Drinks</span>
            </div>

            {/* CTA Button: Yellow Pill "Order Now ->" with animated glow aura */}
            <div className="pt-2 sm:pt-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2.5 bg-[#FFC20E] hover:bg-[#E5AC00] text-black font-extrabold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 shadow-[0_8px_25px_rgba(255,194,14,0.35)] hover:shadow-[0_12px_35px_rgba(255,194,14,0.6)] active:scale-95 group animate-gold-pulse"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right Image Visual: Whole Charcoal Grilled Tilapia Platter */}
          <div className="md:col-span-6 lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] max-w-md mx-auto group animate-float-badge">
              <Image
                src="/dishes/grilled_tilapia_platter.jpg"
                alt="Delicious Charcoal Grilled Tilapia Platter with Banku and Shito at Kalahari Dine"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-108 shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E]/60 via-transparent to-transparent rounded-2xl pointer-events-none" />

              {/* Rising embers from grill */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <span className="absolute bottom-6 left-1/4 w-2 h-2 rounded-full bg-[#FFC20E] animate-ember-1" />
                <span className="absolute bottom-10 right-1/3 w-1.5 h-1.5 rounded-full bg-[#D92323] animate-ember-2" />
                <span className="absolute bottom-8 right-1/4 w-1 h-1 rounded-full bg-[#FFC20E] animate-ember-3" />
              </div>

              {/* Floating Live Badge with Dancing Flame */}
              <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-[#FFC20E]/50 text-[#FFC20E] text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                <Flame className="w-4 h-4 fill-[#FFC20E] text-[#FFC20E] animate-flame" />
                <span>House Signature Platter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
