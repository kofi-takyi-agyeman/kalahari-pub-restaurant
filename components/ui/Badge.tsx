import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "yellow" | "red" | "green" | "charcoal" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-brand-charcoal text-white",
    yellow: "bg-brand-yellow text-brand-charcoal font-semibold",
    red: "bg-brand-red text-white font-medium",
    green: "bg-brand-green text-white font-medium",
    charcoal: "bg-brand-charcoal-muted text-gray-200",
    outline: "border border-brand-cream-border text-brand-charcoal bg-white",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs rounded-full",
    md: "px-3 py-1 text-sm rounded-full",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium tracking-wide transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
