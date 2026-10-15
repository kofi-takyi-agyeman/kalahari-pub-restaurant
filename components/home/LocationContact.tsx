import React from "react";
import { businessConfig } from "@/lib/businessConfig";
import { MapPin, Phone, Clock, AlertCircle, Compass } from "lucide-react";

export function LocationContact() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs uppercase tracking-widest mb-2">
            <MapPin className="w-4 h-4 text-brand-red" />
            <span>Find Us &amp; Get In Touch</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight">
            Location &amp; Verified Contact
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Visit us in person or place telephone orders using any of our 3 verified lines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="lg:col-span-6 bg-brand-cream/50 rounded-3xl p-8 border border-brand-cream-border flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold text-brand-charcoal mb-2">
                  Kalahari Pub &amp; Restaurant
                </h3>
                <p className="text-sm text-gray-600">
                  {businessConfig.slogan}
                </p>
              </div>

              {/* Physical Location */}
              <div className="p-4 rounded-2xl bg-white border border-brand-cream-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Physical Location
                  </h4>
                  <p className="text-base font-bold text-brand-charcoal mt-0.5">
                    {businessConfig.location}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Conveniently located at the popular A-Lang Taxi Rank.
                  </p>
                </div>
              </div>

              {/* Verified Telephone Numbers */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500">
                  Verified Contact Numbers (Click to Call):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {businessConfig.phones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={phone.telLink}
                      className="group p-3.5 rounded-xl bg-white border border-brand-cream-border hover:border-brand-yellow hover:bg-brand-yellow/10 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Phone className="w-4 h-4 text-brand-red group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {phone.label}
                        </span>
                      </div>
                      <span className="text-sm font-black text-brand-charcoal group-hover:text-brand-red transition-colors">
                        {phone.formatted}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Operating Details Placeholder */}
            <div className="mt-8 pt-6 border-t border-brand-cream-border/70 flex items-start gap-3 text-xs text-gray-500">
              <Clock className="w-4 h-4 text-brand-charcoal shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-charcoal font-semibold">
                  Operating Hours &amp; Delivery Details:
                </strong>{" "}
                Specific opening hours and delivery fees will be published once officially
                verified with management. Please call any number above for current status.
              </div>
            </div>
          </div>

          {/* Interactive / Map Placeholder Container */}
          <div className="lg:col-span-6 bg-brand-charcoal rounded-3xl p-8 border border-brand-charcoal-muted text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Map Graphic Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F9D817_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-charcoal-muted flex items-center justify-center text-brand-yellow">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                Find Your Way To Kalahari
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                We are situated right at <strong>{businessConfig.location}</strong>.
                Whether you are stopping by for lunch, picking up evening grilled tilapia,
                or relaxing with chilled drinks, we look forward to hosting you!
              </p>
            </div>

            {/* Honest Map Location Container (No guessed coordinates) */}
            <div className="relative z-10 mt-8 rounded-2xl bg-brand-charcoal-card p-6 border border-brand-charcoal-muted/80 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center mx-auto text-brand-yellow border border-brand-charcoal-muted">
                <MapPin className="w-5 h-5 text-brand-red" />
              </div>

              <h4 className="text-sm font-bold text-white">
                Interactive Map Slot (A-Lang Taxi Rank)
              </h4>

              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/50 rounded-lg p-2.5 max-w-md mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="text-left text-[11px] leading-tight">
                  GPS coordinates and embed link will be configured once verified by the
                  owner. No guessed coordinates used.
                </span>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-400">
                  Need directions right now? Call us directly at{" "}
                  <a
                    href="tel:0245656849"
                    className="text-brand-yellow font-bold underline"
                  >
                    024 565 6849
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
