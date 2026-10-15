import React from "react";
import Link from "next/link";
import Image from "next/image";
import { businessConfig } from "@/lib/businessConfig";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight, Flame, Beer, Utensils, Sparkles, MapPin } from "lucide-react";

export function Hero() {
  const primaryPhone = businessConfig.phones[0];

  return (
    <section className="relative overflow-hidden bg-brand-charcoal text-white pt-8 pb-16 lg:py-24">
      {/* Decorative Warm Lighting Effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-red/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal-card border border-brand-yellow/30 text-brand-yellow text-xs font-semibold tracking-wide shadow-xs">
              <Logo variant="icon" size="xs" />
              <span>Authentic Ghanaian Flavors &amp; Chilled Pub Drinks</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Good Food. <br />
              <span className="text-brand-yellow">Good Drinks.</span> <br />
              <span className="text-brand-red">Great Vibes.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover delicious Ghanaian favourites, freshly grilled dishes, and
              refreshing drinks at Kalahari Pub &amp; Restaurant.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black text-base px-7 py-4 rounded-xl transition-all shadow-lg hover:shadow-brand-yellow/20 active:scale-95"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-base px-7 py-4 rounded-xl transition-all shadow-md active:scale-95"
              >
                <span>Order Now</span>
              </Link>
            </div>

            {/* Quick Verification Badges */}
            <div className="pt-6 border-t border-brand-charcoal-muted grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-charcoal-muted flex items-center justify-center text-brand-yellow">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Local Favorites</h4>
                  <p className="text-[11px] text-gray-400">Banku, Fufu &amp; Omo Tuo</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-charcoal-muted flex items-center justify-center text-brand-red">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Charcoal Grill</h4>
                  <p className="text-[11px] text-gray-400">Whole Tilapia &amp; Meats</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="w-9 h-9 rounded-lg bg-brand-charcoal-muted flex items-center justify-center text-brand-yellow">
                  <Beer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Ice-Cold Pub</h4>
                  <p className="text-[11px] text-gray-400">Beers, Stouts &amp; Softs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Golden Border Accent */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-brand-yellow via-brand-red to-brand-yellow opacity-40 blur-xs" />

              {/* Main Food Feature Card */}
              <div className="relative overflow-hidden rounded-2xl bg-brand-charcoal-card border border-brand-charcoal-muted shadow-2xl">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/dishes/grilled_tilapia_platter.jpg"
                    alt="Delicious Ghanaian charcoal grilled whole tilapia platter with hot banku and shito"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/20 to-transparent" />

                  {/* Corner Badge */}
                  <div className="absolute top-4 left-4 bg-brand-charcoal/90 backdrop-blur-md border border-brand-yellow/40 text-brand-yellow text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>House Signature</span>
                  </div>

                  <span className="absolute bottom-3 right-3 text-[10px] text-white/70 bg-brand-charcoal/80 px-2 py-0.5 rounded">
                    Charcoal grilled fresh daily
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Charcoal Grilled Tilapia Platter
                      </h3>
                      <p className="text-xs text-gray-400">
                        Served with hot banku, authentic black shito &amp; chilled Club beer
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-charcoal-muted flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
                      <span>{businessConfig.location}</span>
                    </div>

                    <a
                      href={primaryPhone.telLink}
                      className="font-bold text-brand-yellow hover:underline"
                    >
                      Call: {primaryPhone.formatted}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
