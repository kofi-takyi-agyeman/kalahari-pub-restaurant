import { Suspense } from "react";
import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { businessConfig } from "@/lib/businessConfig";
import { UtensilsCrossed, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: `Our Menu | ${businessConfig.name}`,
  description: `Browse Ghanaian local dishes, charcoal-grilled tilapia, rice meals, and chilled drinks at ${businessConfig.name}.`,
};

function MenuLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500 space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      <p className="text-sm font-medium">Loading delicious menu...</p>
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cream border border-brand-cream-border text-brand-charcoal text-xs font-bold uppercase tracking-wider">
            <UtensilsCrossed className="w-3.5 h-3.5 text-brand-red" />
            <span>Kalahari Pub &amp; Restaurant Menu</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-brand-charcoal tracking-tight">
            Explore Our Food &amp; Drinks
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Freshly prepared Ghanaian favorites, flame-grilled specialties, and
            ice-cold drinks. Search dishes or filter by your favorite category.
          </p>
        </div>

        {/* Menu Interactive Browser */}
        <Suspense fallback={<MenuLoadingFallback />}>
          <MenuBrowser />
        </Suspense>
      </div>
    </div>
  );
}
