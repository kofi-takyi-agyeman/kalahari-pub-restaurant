import React from "react";
import { Utensils, Flame, Beer, Truck } from "lucide-react";

export function WhyChooseKalahari() {
  const pillars = [
    {
      icon: Utensils,
      title: "Ghanaian Local Favourites",
      description:
        "Enjoy authentic soups and swallows including Banku with Okro stew, silky pounded Fufu, Kokonte with palm nut soup, and hearty Omo Tuo.",
      color: "text-brand-yellow",
      bg: "bg-brand-charcoal",
    },
    {
      icon: Flame,
      title: "Fresh Off The Grill",
      description:
        "Our grill specializes in whole fresh tilapia and seasoned meats flame-grilled over charcoal with spicy Ghanaian pepper marinade and shito.",
      color: "text-brand-red",
      bg: "bg-brand-charcoal",
    },
    {
      icon: Beer,
      title: "Food & Drinks Under One Roof",
      description:
        "A true dining experience where you can enjoy hot Ghanaian meals paired with cold beers, stouts, malt, and refreshing beverages.",
      color: "text-brand-yellow",
      bg: "bg-brand-charcoal",
    },
    {
      icon: Truck,
      title: "Pickup & Delivery in Progress",
      description:
        "We are currently rolling out online ordering with pickup at A-Lang Taxi Rank and planned delivery service to make enjoying your meals easier.",
      color: "text-brand-green",
      bg: "bg-brand-charcoal",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-brand-cream/40 border-b border-brand-cream-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs uppercase tracking-widest mb-2">
            <span>The Kalahari Experience</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight">
            Why Visit Kalahari Dine
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
            A welcoming destination at A-Lang Taxi Rank combining hearty Ghanaian
            cooking, freshly grilled food, and a relaxed dining atmosphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 border border-brand-cream-border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-charcoal flex items-center justify-center text-white mb-5 shadow-xs">
                    <Icon className={`w-6 h-6 ${pillar.color}`} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-brand-charcoal mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-brand-cream-border/60">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Verified Kalahari Offering
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
