"use client";

import React from "react";
import { businessConfig } from "@/lib/businessConfig";
import { MapPin, Navigation, Phone, ExternalLink } from "lucide-react";

export function RestaurantMap() {
  const mapQuery = encodeURIComponent("A-Lang Taxi Rank, Accra, Ghana");
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const embedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white rounded-3xl border border-brand-cream-border p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Interactive Map &amp; Directions</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal">
            Find Us at A-Lang Taxi Rank
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Kalahari Pub &amp; Restaurant is located right at the bustling A-Lang Taxi Rank hub in Accra.
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black text-xs transition-all shadow-xs shrink-0"
        >
          <Navigation className="w-4 h-4 fill-brand-charcoal" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>

      {/* Embedded Map Frame */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-brand-cream-border shadow-inner bg-gray-100">
        <iframe
          title="Kalahari Pub Location Map"
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Surrounding Landmarks & Neighborhood Quick Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
        <div className="p-3.5 rounded-xl bg-brand-cream/60 border border-brand-cream-border space-y-1">
          <strong className="block font-bold text-brand-charcoal">
            📍 Primary Hub
          </strong>
          <span className="text-gray-600 leading-relaxed block">
            Directly situated at A-Lang Taxi Rank with quick vehicle access and parking.
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-cream/60 border border-brand-cream-border space-y-1">
          <strong className="block font-bold text-brand-charcoal">
            🛵 Fast Delivery Radius
          </strong>
          <span className="text-gray-600 leading-relaxed block">
            Serving A-Lang, Sowutuom, Kwashieman, Lapaz, Santa Maria, and Odorkor.
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-cream/60 border border-brand-cream-border space-y-1">
          <strong className="block font-bold text-brand-charcoal">
            📞 Lost On The Way?
          </strong>
          <a
            href={businessConfig.phones[0].telLink}
            className="text-brand-red font-bold hover:underline flex items-center gap-1 mt-0.5"
          >
            <Phone className="w-3 h-3" />
            <span>Call {businessConfig.phones[0].formatted}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
