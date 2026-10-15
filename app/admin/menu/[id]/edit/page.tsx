import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminMenuItems, getAdminCategories } from "@/lib/admin/adminDataService";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { businessConfig } from "@/lib/businessConfig";
import { ArrowLeft } from "lucide-react";

interface EditMenuItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditMenuItemPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Dish ${id} | Admin | ${businessConfig.name}`,
  };
}

export default async function EditMenuItemPage({ params }: EditMenuItemPageProps) {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const items = await getAdminMenuItems();
  const categories = await getAdminCategories();

  const item = items.find((i) => i.id === id);
  if (!item) {
    notFound();
  }

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
              Dish Editor
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Edit {item.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Modify pricing, stock availability, or food photography
            </p>
          </div>
        </div>

        <MenuItemForm initialItem={item} categories={categories} />
      </div>
    </div>
  );
}
