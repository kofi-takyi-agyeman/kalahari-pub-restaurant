import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminMenuItems, getAdminCategories } from "@/lib/admin/adminDataService";
import { businessConfig } from "@/lib/businessConfig";
import { MenuTableClient } from "./MenuTableClient";
import { Plus, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: `Menu Management | Admin | ${businessConfig.name}`,
};

export default async function AdminMenuPage() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const items = await getAdminMenuItems();
  const categories = await getAdminCategories();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-charcoal-muted">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
              Menu Catalog &amp; Pricing
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dish Management
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Approve prices, toggle live stock status, and add new Ghanaian dishes
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-charcoal-card hover:bg-white/10 border border-brand-charcoal-muted text-gray-300 text-xs font-bold transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </Link>

            <Link
              href="/admin/menu/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Dish</span>
            </Link>
          </div>
        </div>

        {/* Interactive Menu Table */}
        <MenuTableClient items={items} categories={categories} />
      </div>
    </div>
  );
}
