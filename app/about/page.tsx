import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { businessConfig } from "@/lib/businessConfig";
import { Logo } from "@/components/ui/Logo";
import { Utensils, Flame, Beer, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: `About Us | ${businessConfig.name}`,
  description: `Learn about ${businessConfig.name} at ${businessConfig.location}. Ghanaian local dishes, grilled food, and chilled pub drinks under one roof.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-center mb-2">
            <Logo variant="primary" size="lg" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs uppercase tracking-widest">
            <span>About Kalahari Pub &amp; Restaurant</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-brand-charcoal tracking-tight">
            Good Food, Good Drinks, Great Vibes
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Welcome to Kalahari Pub &amp; Restaurant. Located at A-Lang Taxi Rank,
            we bring together the very best of Ghanaian culinary comfort and relaxed
            pub hospitality in one lively spot.
          </p>
        </div>

        {/* Visual & Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-brand-cream-border shadow-md bg-brand-charcoal">
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
              alt="Authentic Ghanaian food preparation"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs bg-brand-red font-bold px-2.5 py-1 rounded">
                Authentic Flavors
              </span>
              <p className="text-sm font-semibold mt-1">
                Warm soups, swallows &amp; savory stews
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-charcoal">
              Our Vision &amp; Atmosphere
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              At Kalahari Pub &amp; Restaurant, our goal is simple: offer everyday
              customers, travelers, and friends a welcoming space to enjoy delicious
              Ghanaian staples alongside refreshing cold drinks.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Whether you are stopping by for an afternoon meal of Banku with Okro
              stew, picking up freshly flame-grilled tilapia, or spending the evening
              unwinding with friends over cold drinks, Kalahari Pub provides a vibrant,
              hospitable setting.
            </p>

            <div className="p-4 rounded-2xl bg-brand-cream/80 border border-brand-cream-border flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700">
                <strong className="text-brand-charcoal block mb-0.5">
                  Convenient Location:
                </strong>
                Situated at <strong>{businessConfig.location}</strong>, easily accessible
                for dine-in guests and pickup customers.
              </div>
            </div>
          </div>
        </div>

        {/* What We Serve */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal">
              What We Offer
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Explore our core culinary and pub services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-brand-cream-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-charcoal flex items-center justify-center text-brand-yellow">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-brand-charcoal">
                Authentic Local Dishes
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Traditional Ghanaian dishes including Banku &amp; Tilapia with Okro
                Stew, pounded Fufu with Goat Meat and Okro Soup, Fufu with Light Soup,
                Kokonte with Palm Nut Soup, and Omo Tuo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-cream-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-charcoal flex items-center justify-center text-brand-red">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-brand-charcoal">
                Charcoal-Grilled Specialties
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Freshly caught whole tilapia and seasoned cuts marinated with local
                chili peppers, ginger, and spices, hot off the charcoal grill.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-cream-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-charcoal flex items-center justify-center text-brand-yellow">
                <Beer className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-brand-charcoal">
                Pub Drinks &amp; Refreshments
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Chilled Ghana lagers, classic stouts, Malta Guinness, Alvaro, soft
                drinks, and juices served ice-cold from our pub coolers.
              </p>
            </div>
          </div>
        </div>

        {/* Phase 1 Commitment */}
        <div className="rounded-3xl bg-brand-charcoal text-white p-8 sm:p-10 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-charcoal-muted flex items-center justify-center mx-auto text-brand-yellow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black">
            Committed To Our Community
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            This digital platform is being developed in stages by <strong>Data_Nova</strong>.
            Phase 1 introduces our verified brand foundation and demonstration menu.
            Live menu management and online order routing will be deployed in subsequent
            releases.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold px-7 py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-sm"
            >
              <span>Explore Menu Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
