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
}

export function Logo({
  variant = "compact",
  size = "md",
  className = "",
  showSlogan = false,
  asLink = false,
  href = "/",
}: LogoProps) {
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
          <span className="font-display font-black text-brand-charcoal text-xl sm:text-2xl tracking-wider block leading-tight">
            KALAHARI
          </span>
          <span className="inline-block bg-brand-red text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full tracking-widest uppercase mt-1">
            PUB &amp; RESTAURANT
          </span>
          <span className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">
            ACCRA, GHANA
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
  const isDarkBg = variant === "dark";
  const nameColor = isDarkBg ? "text-white" : "text-brand-charcoal";
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
        <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
          <span className="bg-brand-red text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase leading-none">
            PUB &amp; RESTAURANT
          </span>
          <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest uppercase hidden xs:inline ${subtextColor}`}>
            ACCRA
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
