import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amounts into Ghanaian Cedi (GHS)
 */
export function formatCurrency(amount: number, currency: string = "GHS"): string {
  if (currency === "GHS" || currency === "GH₵" || !currency) {
    return `GH₵ ${Math.round(amount)}`;
  }
  return `GH₵ ${Math.round(amount)}`;
}
