import React from "react";
import Link from "next/link";
import { businessConfig } from "@/lib/businessConfig";
import { Logo } from "@/components/ui/Logo";
import { Phone, MapPin, ShieldAlert } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-white border-t border-brand-charcoal-muted">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo variant="dark" size="lg" asLink href="/" />
            </div>
            <p className="text-brand-yellow font-bold text-sm tracking-wide">
              {businessConfig.slogan}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ghanaian local dishes, fresh flame-grilled specialties, flavorful
              rice meals, and ice-cold beverages in a relaxed, vibrant dining atmosphere.
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs text-gray-400 bg-brand-charcoal-card px-3 py-1.5 rounded-lg border border-brand-charcoal-muted">
                Locally Owned &amp; Operated
              </span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="font-display font-bold text-base text-white tracking-wide mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Browse Menu &amp; Specials
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  About Kalahari Dine
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Contact &amp; Location
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Order Summary
                </Link>
              </li>
            </ul>
          </div>

          {/* Menu Categories Col */}
          <div>
            <h4 className="font-display font-bold text-base text-white tracking-wide mb-4">
              Menu Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link
                  href="/menu?category=local-dishes"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Local Ghanaian Dishes
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=grilled-food"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Charcoal Grilled Food
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=rice-meals"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Rice Meals &amp; Jollof
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=drinks"
                  className="hover:text-brand-yellow transition-colors inline-block"
                >
                  Chilled Drinks &amp; Beverages
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Contact & Location */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-base text-white tracking-wide mb-4">
              Verified Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-gray-300">
                <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                <span>{businessConfig.location}</span>
              </div>

              <div className="pt-1 space-y-1.5">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">
                  Telephone Lines:
                </span>
                {businessConfig.phones.map((phone) => (
                  <a
                    key={phone.raw}
                    href={phone.telLink}
                    className="flex items-center gap-2 text-gray-300 hover:text-brand-yellow transition-colors font-medium"
                  >
                    <Phone className="w-4 h-4 text-brand-red shrink-0" />
                    <span>{phone.formatted}</span>
                    <span className="text-[10px] text-gray-500">({phone.label})</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 1 Disclaimer Notice */}
        <div className="mt-10 p-4 rounded-xl bg-brand-charcoal-card border border-brand-charcoal-muted flex items-start gap-3 text-xs text-gray-400">
          <ShieldAlert className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-200">Notice for Customers &amp; Reviewers:</strong> All
            menu prices currently displayed on this demonstration site are development sample
            figures (<span className="text-brand-yellow">{businessConfig.samplePriceNotice}</span>
            ). Digital ordering backend and live menu management are scheduled for upcoming
            phases. Please contact the restaurant directly for confirmed pricing and daily availability.
          </p>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-brand-charcoal-muted bg-black/40 py-5 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            &copy; {currentYear} {businessConfig.name}. All rights reserved.
          </p>

          <p className="font-medium text-gray-300">
            {businessConfig.developer.credit}
          </p>
        </div>
      </div>
    </footer>
  );
}
