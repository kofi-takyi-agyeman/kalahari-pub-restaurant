"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cartContext";
import { Badge } from "@/components/ui/Badge";
import { Plus, Check, AlertCircle, Sparkles } from "lucide-react";

interface FoodCardProps {
  item: MenuItem;
}

export function FoodCard({ item }: FoodCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addToCart(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-brand-cream-border/70 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-charcoal/5">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent opacity-80" />

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {item.isFeatured && (
            <Badge variant="yellow" className="shadow-sm">
              <Sparkles className="w-3 h-3 fill-current" />
              Featured
            </Badge>
          )}
          <Badge
            variant={item.isAvailable ? "green" : "charcoal"}
            className="shadow-sm"
          >
            {item.isAvailable ? "Available Now" : "Pre-order Only"}
          </Badge>
        </div>

        {/* Illustrative Notice */}
        <span className="absolute bottom-2 right-3 text-[10px] text-white/80 bg-brand-charcoal/70 px-2 py-0.5 rounded backdrop-blur-xs">
          Photo for illustration
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-bold text-brand-charcoal leading-snug group-hover:text-brand-red transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>

          {item.prepTimeNote && (
            <p className="text-xs text-brand-green font-medium mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              {item.prepTimeNote}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-brand-cream-border/60">
          {/* Sample Price Notice (Conspicuous as requested) */}
          <div className="mb-2 flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 border border-amber-200/80">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">SAMPLE PRICE — CONFIRM WITH RESTAURANT</span>
          </div>

          {/* Price & Add to Cart button */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-medium">
                Est. Price
              </span>
              <span className="text-xl font-extrabold text-brand-charcoal">
                {formatCurrency(item.samplePrice)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              aria-label={`Add ${item.name} to cart`}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm min-h-[44px] transition-all duration-200 active:scale-95 ${
                justAdded
                  ? "bg-brand-green text-white shadow-sm"
                  : item.isAvailable
                  ? "bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal shadow-sm hover:shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add to Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
