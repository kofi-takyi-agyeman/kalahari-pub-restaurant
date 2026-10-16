import React from "react";
import Link from "next/link";
import { businessConfig } from "@/lib/businessConfig";
import { PhoneCall, UtensilsCrossed, ArrowRight, ShieldCheck } from "lucide-react";

export function OrderingCTA() {
  return (
    <section className="py-16 sm:py-20 bg-brand-charcoal text-white relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-brand-red/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-charcoal-card border border-brand-yellow/30 text-brand-yellow text-xs font-bold tracking-wide">
          <UtensilsCrossed className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Ready For A Great Ghanaian Meal?</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
          Explore Our Menu &amp; Order Your Favourites Today
        </h2>

        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Check out our demonstration menu online. While our automated digital checkout
          is in development for Phase 2, our kitchen and restaurant team are ready to take your
          order directly over our verified phone lines!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95 text-base"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>

          <a
            href={businessConfig.phones[0].telLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md active:scale-95 text-base"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Call {businessConfig.phones[0].formatted}</span>
          </a>
        </div>

        {/* Phase 1 Status Banner */}
        <div className="pt-6 border-t border-brand-charcoal-muted max-w-xl mx-auto flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-brand-yellow shrink-0" />
          <span>
            Phase 1 Foundation: Online shopping bag preview active. Official database
            orders coming soon.
          </span>
        </div>
      </div>
    </section>
  );
}
