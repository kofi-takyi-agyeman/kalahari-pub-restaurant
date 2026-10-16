import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amounts into Ghanaian Cedi (GHS)
 */
export function formatCurrency(amount: number, currency: string = "GHS"): string {
  if (currency === "Rs." || currency === "Rs" || currency === "INR" || currency === "PKR") {
    return `Rs. ${Math.round(amount)}`;
  }
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
