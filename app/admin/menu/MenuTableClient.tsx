"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuItemRow, MenuCategoryRow } from "@/types/database.types";
import {
  approveMenuPriceAction,
  toggleMenuAvailabilityAction,
  deleteMenuItemAction,
} from "@/app/actions/adminMenuActions";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

interface MenuTableClientProps {
  items: MenuItemRow[];
  categories: MenuCategoryRow[];
}

export function MenuTableClient({ items, categories }: MenuTableClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterSampleOnly, setFilterSampleOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleApprovePrice = async (dishId: string) => {
    setLoadingId(dishId);
    await approveMenuPriceAction(dishId);
    setLoadingId(null);
    router.refresh();
  };

  const handleToggleAvailability = async (dishId: string) => {
    setLoadingId(dishId);
    await toggleMenuAvailabilityAction(dishId);
    setLoadingId(null);
    router.refresh();
  };

  const handleDelete = async (dishId: string, dishName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${dishName}" from the menu?`)) {
      return;
    }
    setLoadingId(dishId);
    await deleteMenuItemAction(dishId);
    setLoadingId(null);
    router.refresh();
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "all" && item.category_id !== selectedCategory) {
      return false;
    }
    if (filterSampleOnly && !item.is_sample_price) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return item.name.toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Category Filter, Sample Price Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-charcoal-card border border-brand-charcoal-muted text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
          >
            <option value="all">All Categories ({items.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sample Price Only Toggle */}
          <button
            type="button"
            onClick={() => setFilterSampleOnly(!filterSampleOnly)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${
              filterSampleOnly
                ? "bg-amber-400 text-brand-charcoal border-amber-400"
                : "bg-brand-charcoal-card text-gray-300 border-brand-charcoal-muted hover:text-white"
            }`}
          >
            {filterSampleOnly ? "Showing Sample Prices" : "Filter Sample Prices"}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name..."
            className="w-full sm:w-64 px-3 py-2 rounded-xl bg-brand-charcoal-card border border-brand-charcoal-muted text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-brand-charcoal-muted text-gray-400 uppercase tracking-wider font-semibold">
              <th className="pb-3 pr-4">Dish</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Price (GHS)</th>
              <th className="pb-3 px-4">Price Status</th>
              <th className="pb-3 px-4">Stock</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-charcoal-muted/50">
            {filteredItems.map((item) => {
              const category = categories.find((c) => c.id === item.category_id);
              const isItemLoading = loadingId === item.id;

              return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-charcoal shrink-0 border border-brand-charcoal-muted">
                        <Image
                          src={item.image_url || "/images/dishes/banku-tilapia.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">{item.name}</span>
                        {item.description && (
                          <span className="text-[11px] text-gray-400 max-w-xs truncate block">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-gray-300">
                    {category?.name || item.category_id}
                  </td>

                  <td className="py-4 px-4 font-black text-white text-sm">
                    {formatCurrency(item.price)}
                  </td>

                  <td className="py-4 px-4">
                    {item.is_sample_price ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Sample Price
                        </span>
                        <button
                          onClick={() => handleApprovePrice(item.id)}
                          disabled={isItemLoading}
                          title="Confirm official price and unlock customer online orders"
                          className="px-2 py-1 rounded bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal font-bold text-[10px] flex items-center gap-1 shadow-xs"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approved</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleAvailability(item.id)}
                      disabled={isItemLoading}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        item.is_available
                          ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                          : "bg-red-950/40 text-red-300 border-red-800"
                      }`}
                    >
                      {item.is_available ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-4 pl-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/admin/menu/${item.id}/edit`}
                        className="p-1.5 rounded-lg bg-brand-charcoal hover:bg-white/10 text-gray-300 hover:text-white border border-brand-charcoal-muted"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={isItemLoading}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
