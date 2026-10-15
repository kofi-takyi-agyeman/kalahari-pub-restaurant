"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MenuItemRow, MenuCategoryRow } from "@/types/database.types";
import { saveMenuItemAction } from "@/app/actions/adminMenuActions";
import {
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface MenuItemFormProps {
  initialItem?: MenuItemRow | null;
  categories: MenuCategoryRow[];
}

export function MenuItemForm({ initialItem, categories }: MenuItemFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialItem);

  const [name, setName] = useState(initialItem?.name || "");
  const [categoryId, setCategoryId] = useState(
    initialItem?.category_id || (categories[0]?.id || "local-dishes")
  );
  const [price, setPrice] = useState(initialItem?.price ? String(initialItem.price) : "");
  const [description, setDescription] = useState(initialItem?.description || "");
  const [imageUrl, setImageUrl] = useState(
    initialItem?.image_url || "/images/dishes/banku-tilapia.jpg"
  );
  const [isSamplePrice, setIsSamplePrice] = useState(
    initialItem?.is_sample_price ?? true
  );
  const [isAvailable, setIsAvailable] = useState(
    initialItem?.is_available ?? true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialItem?.is_featured ?? false
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    if (initialItem?.id) formData.append("id", initialItem.id);
    formData.append("name", name);
    formData.append("category_id", categoryId);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image_url", imageUrl);
    formData.append("is_sample_price", String(isSamplePrice));
    formData.append("is_available", String(isAvailable));
    formData.append("is_featured", String(isFeatured));
    formData.append("is_editing", String(isEditing));

    const result = await saveMenuItemAction(formData);
    if (!result.success) {
      setErrorMsg(result.error || "Failed to save dish.");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/menu");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-base font-bold text-white pb-3 border-b border-brand-charcoal-muted">
          Dish Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Dish Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1"
            >
              Dish Name <span className="text-brand-red">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Flame Grilled Tilapia & Banku"
              className="w-full px-4 py-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-sm text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1"
            >
              Menu Category <span className="text-brand-red">*</span>
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1"
            >
              Price (GHS) <span className="text-brand-red">*</span>
            </label>
            <input
              id="price"
              type="number"
              step="0.5"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 85.00"
              className="w-full px-4 py-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-sm text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          {/* Image URL */}
          <div className="sm:col-span-2">
            <label
              htmlFor="imageUrl"
              className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1"
            >
              Photo Path or URL
            </label>
            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/dishes/... or https://..."
              className="w-full px-4 py-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-sm text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Supports local path from `/public/images/dishes/` or Supabase Storage image URL.
            </p>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1"
            >
              Description &amp; Ingredients
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Freshly charcoal-grilled tilapia served with steamed banku and homemade ground pepper..."
              className="w-full px-4 py-3 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-sm text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        {/* Status Checkboxes */}
        <div className="pt-4 border-t border-brand-charcoal-muted space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Publishing &amp; Pricing Controls
          </h4>

          {/* Sample Price Checkbox with Warning */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-brand-charcoal border border-brand-charcoal-muted cursor-pointer hover:border-brand-yellow/40 transition-colors">
            <input
              type="checkbox"
              checked={isSamplePrice}
              onChange={(e) => setIsSamplePrice(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-yellow focus:ring-brand-yellow bg-brand-charcoal-card border-brand-charcoal-muted"
            />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-white block">
                Flag as Temporary Demonstration Price (Sample Price)
              </span>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                When checked, customers will see a demonstration notice and{" "}
                <strong className="text-amber-300">cannot place commercial orders online</strong>. Uncheck this once the owner confirms this is the authoritative selling price.
              </p>
            </div>
          </label>

          {/* In Stock Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-brand-charcoal border border-brand-charcoal-muted cursor-pointer hover:border-brand-yellow/40 transition-colors">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-yellow focus:ring-brand-yellow bg-brand-charcoal-card border-brand-charcoal-muted"
            />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-white block">
                Available in Kitchen (In Stock)
              </span>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                When unchecked, the dish is marked &quot;Out of Stock&quot; on the public menu and cannot be added to customer carts.
              </p>
            </div>
          </label>

          {/* Featured Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-brand-charcoal border border-brand-charcoal-muted cursor-pointer hover:border-brand-yellow/40 transition-colors">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-yellow focus:ring-brand-yellow bg-brand-charcoal-card border-brand-charcoal-muted"
            />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-white block">
                Feature on Public Homepage Highlights
              </span>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Displays this dish with a &quot;Chef Recommends&quot; badge on the main website.
              </p>
            </div>
          </label>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-brand-charcoal-muted flex items-center justify-end gap-3">
          <Link
            href="/admin/menu"
            className="px-4 py-2.5 rounded-xl border border-brand-charcoal-muted text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-black transition-all shadow-md active:scale-98 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-charcoal" />
                <span>Saving Dish...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-brand-charcoal" />
                <span>{isEditing ? "Update Dish" : "Create Dish"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
