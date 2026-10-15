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
  // Dimension maps based on variant and size
  const getDimensions = () => {
    switch (variant) {
      case "primary":
        switch (size) {
          case "xs":
            return { width: 48, height: 48 };
          case "sm":
            return { width: 72, height: 72 };
          case "md":
            return { width: 96, height: 96 };
          case "lg":
            return { width: 140, height: 140 };
          case "xl":
            return { width: 200, height: 200 };
          default:
            return { width: 96, height: 96 };
        }
      case "icon":
        switch (size) {
          case "xs":
            return { width: 28, height: 28 };
          case "sm":
            return { width: 36, height: 36 };
          case "md":
            return { width: 44, height: 44 };
          case "lg":
            return { width: 56, height: 56 };
          case "xl":
            return { width: 80, height: 80 };
          default:
            return { width: 44, height: 44 };
        }
      case "dark":
      case "light":
      case "compact":
      default:
        switch (size) {
          case "xs":
            return { width: 140, height: 28 };
          case "sm":
            return { width: 170, height: 34 };
          case "md":
            return { width: 210, height: 42 };
          case "lg":
            return { width: 250, height: 50 };
          case "xl":
            return { width: 300, height: 60 };
          default:
            return { width: 210, height: 42 };
        }
    }
  };

  const getSource = () => {
    switch (variant) {
      case "primary":
        return "/brand/logo-primary.svg";
      case "icon":
        return "/brand/logo-icon.svg";
      case "dark":
        return "/brand/logo-dark.svg";
      case "light":
        return "/brand/logo-light.svg";
      case "compact":
      default:
        return "/brand/logo-compact.svg";
    }
  };

  const { width, height } = getDimensions();
  const src = getSource();

  const content = (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="relative inline-flex items-center">
        <Image
          src={src}
          alt={`${businessConfig.name} - Official Brand Logo`}
          width={width}
          height={height}
          priority
          className="object-contain h-auto w-auto transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
      {showSlogan && (
        <span className="text-[10px] sm:text-xs font-semibold text-brand-yellow/90 tracking-wider uppercase mt-1">
          {businessConfig.slogan}
        </span>
      )}
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
