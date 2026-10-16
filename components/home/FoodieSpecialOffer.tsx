"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Check } from "lucide-react";

export function FoodieSpecialOffer() {
  const [copied, setCopied] = useState(false);

  const handleApplyPromo = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 sm:my-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141418] via-[#121216] to-[#0A0A0C] border border-[#25252E] shadow-2xl">
        {/* Ambient Red & Amber Lighting Gradients */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#FFC20E]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 rounded-full bg-[#D92323]/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-6 sm:p-8 lg:p-10 relative z-10">
          {/* Left Text Column */}
          <div className="md:col-span-6 lg:col-span-7 space-y-3.5 text-left">
            {/* Yellow Brush Stroke Highlight for "Special Offer" */}
            <div className="inline-block relative">
              <div className="bg-[#FFC20E] text-black font-display font-black text-xs sm:text-sm tracking-wider px-3.5 py-1 rounded-sm transform -rotate-1 shadow-md uppercase">
                Special Offer
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              Get <span className="text-[#FFC20E]">20% OFF</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 font-medium">
              On Your First Kalahari Order
            </p>

            {/* CTA & Promo Code Copy */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-[#FFC20E] hover:bg-[#E5AC00] text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full transition-all duration-200 shadow-[0_6px_20px_rgba(255,194,14,0.35)] active:scale-95 group"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
              </Link>

              <button
                onClick={handleApplyPromo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#1F1F27] hover:bg-[#282833] border border-[#333342] text-xs font-bold text-gray-300 hover:text-white transition-all active:scale-95"
                title="Click to copy promo code"
              >
                <Tag className="w-3.5 h-3.5 text-[#FFC20E]" />
                <span>Code: KALAHARI20</span>
                {copied && (
                  <span className="text-[#10B981] flex items-center gap-1 text-[11px] ml-1 font-extrabold">
                    <Check className="w-3 h-3 stroke-[3]" /> Applied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Image Column: Crispy Grilled Guinea Fowl */}
          <div className="md:col-span-6 lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] max-w-md mx-auto group">
              <Image
                src="/dishes/grilled_guinea_fowl.jpg"
                alt="Special Offer - Get 20% OFF On Your First Order - Charcoal Grilled Specialties at Kalahari Dine"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/50 via-transparent to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
