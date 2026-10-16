import React from "react";
import Image from "next/image";
import Link from "next/link";
import { businessConfig } from "@/lib/businessConfig";

export type LogoVariant = "primary" | "compact" | "dark" | "light" | "icon";

interface LogoProps {
  variant?: LogoVariant;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showSlogan?: boolean;
  asLink?: boolean;
  href?: string;
  theme?: "dark" | "light";
}

export function Logo({
  variant = "compact",
  size = "md",
  className = "",
  showSlogan = false,
  asLink = false,
  href = "/",
  theme,
}: LogoProps) {
  // Determine if logo is rendered on a dark or light background
  const isDarkBg = theme ? theme === "dark" : variant === "dark";

  // Sizing definitions
  const getEmblemSize = () => {
    switch (size) {
      case "xs":
        return 28;
      case "sm":
        return 36;
      case "md":
        return 44;
      case "lg":
        return 60;
      case "xl":
        return 88;
      default:
        return 44;
    }
  };

  const emblemSize = getEmblemSize();

  // If primary variant, show large centered emblem badge
  if (variant === "primary") {
    const primarySize = size === "xl" ? 180 : size === "lg" ? 140 : size === "sm" ? 72 : 100;
    const content = (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <div
          className="relative rounded-full overflow-hidden shadow-xl border-4 border-brand-yellow shrink-0 bg-brand-charcoal"
          style={{ width: `${primarySize}px`, height: `${primarySize}px` }}
        >
          <Image
            src="/brand/kalahari-emblem-concept.jpg"
            alt={`${businessConfig.name} - Official Emblem`}
            width={primarySize}
            height={primarySize}
            priority
            className="object-cover w-full h-full transform scale-105"
          />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`font-display font-black text-2xl sm:text-3xl tracking-wider leading-tight ${
                isDarkBg ? "text-white" : "text-brand-charcoal"
              }`}
            >
              KALAHARI
            </span>
            <span
              className={`font-serif italic font-extrabold text-2xl sm:text-3xl leading-tight ${
                isDarkBg ? "text-[#FFC20E]" : "text-[#D92323]"
              }`}
            >
              Dine
            </span>
          </div>
          <span className="inline-block bg-gradient-to-r from-brand-charcoal to-black text-[#FFC20E] border border-[#FFC20E]/40 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase mt-1.5 shadow-xs">
            AUTHENTIC GHANAIAN DINING
          </span>
          <span
            className={`block text-[10px] font-bold tracking-widest uppercase mt-1.5 ${
              isDarkBg ? "text-gray-400" : "text-gray-500"
            }`}
          >
            A-LANG, ACCRA • GHANA
          </span>
        </div>
        {showSlogan && (
          <p className="text-xs sm:text-sm font-semibold text-brand-red mt-2 italic">
            &ldquo;{businessConfig.slogan}&rdquo;
          </p>
        )}
      </div>
    );

    if (asLink) {
      return (
        <Link
          href={href}
          className="group inline-flex focus:outline-hidden focus:ring-2 focus:ring-brand-yellow rounded-xl p-1"
          aria-label={`${businessConfig.name} Home`}
        >
          {content}
        </Link>
      );
    }
    return content;
  }

  // If icon-only variant
  if (variant === "icon") {
    const content = (
      <div
        className={`relative rounded-full overflow-hidden shadow-md border-2 border-brand-yellow shrink-0 bg-brand-charcoal ${className}`}
        style={{ width: `${emblemSize}px`, height: `${emblemSize}px` }}
      >
        <Image
          src="/brand/kalahari-emblem-concept.jpg"
          alt={`${businessConfig.name} - Brand Mark`}
          width={emblemSize}
          height={emblemSize}
          priority
          className="object-cover w-full h-full transform scale-105"
        />
      </div>
    );

    if (asLink) {
      return (
        <Link
          href={href}
          className="group inline-flex focus:outline-hidden focus:ring-2 focus:ring-brand-yellow rounded-full"
          aria-label={`${businessConfig.name} Home`}
        >
          {content}
        </Link>
      );
    }
    return content;
  }

  // Horizontal Logo Variants (compact, dark, light)
  const nameColor = isDarkBg ? "text-white" : "text-brand-charcoal";
  const dineColor = isDarkBg ? "text-[#FFC20E]" : "text-[#D92323]";
  const subtextColor = isDarkBg ? "text-gray-400" : "text-gray-500";

  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Visual Emblem Badge */}
      <div
        className="relative rounded-full overflow-hidden shadow-md border-2 border-brand-yellow shrink-0 bg-brand-charcoal transition-transform duration-200 group-hover:scale-105"
        style={{ width: `${emblemSize}px`, height: `${emblemSize}px` }}
      >
        <Image
          src="/brand/kalahari-emblem-concept.jpg"
          alt={`${businessConfig.name} Emblem`}
          width={emblemSize}
          height={emblemSize}
          priority
          className="object-cover w-full h-full transform scale-105"
        />
      </div>

      {/* Brand Wordmark & Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-display font-black tracking-wider leading-none ${nameColor} ${
              size === "xs"
                ? "text-sm"
                : size === "sm"
                ? "text-base"
                : size === "lg"
                ? "text-2xl"
                : size === "xl"
                ? "text-3xl"
                : "text-lg sm:text-xl"
            }`}
          >
            KALAHARI
          </span>
          <span
            className={`font-serif italic font-extrabold tracking-wide leading-none ${dineColor} ${
              size === "xs"
                ? "text-xs"
                : size === "sm"
                ? "text-sm"
                : size === "lg"
                ? "text-xl"
                : size === "xl"
                ? "text-2xl"
                : "text-base sm:text-lg"
            }`}
          >
            Dine
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
          <span className="bg-gradient-to-r from-[#D92323] to-[#B91C1C] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase leading-none shadow-xs">
            GHANAIAN DINING
          </span>
          <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest uppercase hidden xs:inline ${subtextColor}`}>
            ACCRA, GH
          </span>
        </div>
        {showSlogan && (
          <span className="text-[10px] font-semibold text-brand-yellow tracking-wider uppercase mt-1">
            {businessConfig.slogan}
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link
        href={href}
        className="group inline-flex focus:outline-hidden focus:ring-2 focus:ring-brand-yellow rounded-lg p-0.5"
        aria-label={`${businessConfig.name} Home`}
      >
        {content}
      </Link>
    );
  }

  return content;
}
