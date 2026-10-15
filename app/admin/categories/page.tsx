import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminCategories } from "@/lib/admin/adminDataService";
import { CategoryManagerClient } from "./CategoryManagerClient";
import { businessConfig } from "@/lib/businessConfig";

export const metadata: Metadata = {
  title: `Categories | Admin | ${businessConfig.name}`,
};

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const categories = await getAdminCategories();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="pb-6 border-b border-brand-charcoal-muted">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
            Catalog Organization
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Menu Categories
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Group food and drink items into customer-facing menu sections
          </p>
        </div>

        <CategoryManagerClient categories={categories} />
      </div>
    </div>
  );
}
