import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminCategories } from "@/lib/admin/adminDataService";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { businessConfig } from "@/lib/businessConfig";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: `Add Menu Item | Admin | ${businessConfig.name}`,
};

export default async function AddMenuItemPage() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const categories = await getAdminCategories();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/admin/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-brand-yellow transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Menu List</span>
          </Link>

          <div className="pb-6 border-b border-brand-charcoal-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
              Catalog Management
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Add New Dish to Menu
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Configure dish name, Ghanaian pricing, stock status, and photo
            </p>
          </div>
        </div>

        <MenuItemForm categories={categories} />
      </div>
    </div>
  );
}
