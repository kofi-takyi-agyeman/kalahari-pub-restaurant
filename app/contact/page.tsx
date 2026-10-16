import React from "react";
import type { Metadata } from "next";
import { businessConfig } from "@/lib/businessConfig";
import { RestaurantMap } from "@/components/contact/RestaurantMap";
import { MapPin, Phone, MessageSquare, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: `Contact Us | ${businessConfig.name}`,
  description: `Contact ${businessConfig.name} at ${businessConfig.location}. Call our verified lines: 0245656849, 0207157071, or 0246773225.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs uppercase tracking-widest">
            <Phone className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-brand-charcoal tracking-tight">
            Contact &amp; Location
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Have questions about our menu, dish availability, or want to place a phone
            order? Connect with the Kalahari team directly.
          </p>
        </div>

        {/* 3 Verified Phone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessConfig.phones.map((phone) => (
            <div
              key={phone.raw}
              className="bg-white rounded-2xl p-6 border border-brand-cream-border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-charcoal text-brand-yellow flex items-center justify-center">
                    <Phone className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 bg-brand-cream px-2.5 py-1 rounded-md border border-brand-cream-border">
                    {phone.label}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-brand-charcoal">
                  Direct Line
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Orders, customer inquiries &amp; availability
                </p>
              </div>

              <a
                href={phone.telLink}
                className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-black py-3 rounded-xl transition-all shadow-xs text-sm"
              >
                <span>Call {phone.formatted}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Location & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Verified Address & Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-border shadow-xs space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-charcoal">
                Visit Our Location
              </h2>
              <div className="p-4 rounded-2xl bg-brand-cream border border-brand-cream-border">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Physical Address:
                </span>
                <p className="text-lg font-black text-brand-charcoal">
                  {businessConfig.location}
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We are right at the A-Lang Taxi Rank hub. Stop by for hot local meals,
                charcoal-grilled fish, or relaxing drinks with friendly service.
              </p>
            </div>

            <div className="pt-4 border-t border-brand-cream-border/70 flex items-start gap-2.5 text-xs text-gray-500">
              <Clock className="w-4 h-4 text-brand-charcoal shrink-0 mt-0.5" />
              <span>
                Open Monday &ndash; Saturday from 10:00 AM &ndash; 11:00 PM, and Sundays from 12:00 PM &ndash; 11:00 PM. Dine-in, Takeaway &amp; Delivery available.
              </span>
            </div>
          </div>

          {/* Interactive Google Map Component */}
          <div className="lg:col-span-2">
            <RestaurantMap />
          </div>
        </div>

        {/* Customer Inquiry Note */}
        <div className="rounded-2xl bg-white border border-brand-cream-border p-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-brand-charcoal font-bold text-sm">
            <MessageSquare className="w-4 h-4 text-brand-red" />
            <span>Direct Restaurant Communication</span>
          </div>
          <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
            For fastest service, order placement, or inquiries, please call{" "}
            <a href="tel:0245656849" className="font-bold text-brand-red underline">
              024 565 6849
            </a>
            ,{" "}
            <a href="tel:0207157071" className="font-bold text-brand-red underline">
              020 715 7071
            </a>
            , or{" "}
            <a href="tel:0246773225" className="font-bold text-brand-red underline">
              024 677 3225
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
