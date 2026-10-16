import React from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { ArrowRight } from "lucide-react";

export function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-20 bg-brand-cream/60 border-b border-brand-cream-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-red" />
              <span>Explore By Category</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight">
              What Are You Craving Today?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl">
              From comforting local Ghanaian soups to smoky charcoal grill and
              refreshing drinks, explore our kitchen and dine selections.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:text-brand-red-hover transition-colors group self-start md:self-auto"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-brand-cream-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-charcoal/10">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/30 to-transparent" />

                {category.badge && (
                  <span className="absolute top-3 left-3 bg-brand-yellow text-brand-charcoal text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-sm">
                    {category.badge}
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-xl font-black text-white group-hover:text-brand-yellow transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {category.description}
                </p>

                <div className="pt-2 border-t border-brand-cream-border/60 flex items-center justify-between text-xs font-bold text-brand-charcoal group-hover:text-brand-red transition-colors">
                  <span>Browse {category.name}</span>
                  <div className="w-6 h-6 rounded-full bg-brand-cream group-hover:bg-brand-red group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
