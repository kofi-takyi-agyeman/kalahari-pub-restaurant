"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuCategoryRow } from "@/types/database.types";
import { saveCategoryAction } from "@/app/actions/adminCategoryActions";
import {
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface CategoryManagerClientProps {
  categories: MenuCategoryRow[];
}

export function CategoryManagerClient({ categories }: CategoryManagerClientProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategoryRow | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startEdit = (cat: MenuCategoryRow) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setShowAddForm(true);
    setErrorMsg(null);
  };

  const cancelForm = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setShowAddForm(false);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    if (editingCategory) formData.append("id", editingCategory.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("is_editing", String(Boolean(editingCategory)));

    const result = await saveCategoryAction(formData);
    if (!result.success) {
      setErrorMsg(result.error || "Failed to save category.");
      setIsSubmitting(false);
      return;
    }

    cancelForm();
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          <strong>{categories.length}</strong> active menu categories
        </span>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Form (Add or Edit) */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-brand-charcoal-card rounded-3xl border border-brand-charcoal-muted p-6 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-brand-charcoal-muted">
            <h3 className="font-display text-sm font-bold text-white">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
            </h3>
            <button
              type="button"
              onClick={cancelForm}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="catName"
                className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1"
              >
                Category Name <span className="text-brand-red">*</span>
              </label>
              <input
                id="catName"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Traditional Soups"
                className="w-full px-3 py-2.5 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-xs text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
              />
            </div>

            <div>
              <label
                htmlFor="catDesc"
                className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1"
              >
                Description
              </label>
              <input
                id="catDesc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Rich peanut and light soups served piping hot"
                className="w-full px-3 py-2.5 rounded-xl bg-brand-charcoal border border-brand-charcoal-muted text-xs text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={cancelForm}
              className="px-3.5 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-brand-charcoal text-xs font-bold transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{editingCategory ? "Update Category" : "Save Category"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-brand-charcoal-card border border-brand-charcoal-muted flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white">{cat.name}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {cat.description || "Authentic dishes served at Kalahari Pub."}
              </p>
            </div>

            <div className="pt-2 border-t border-brand-charcoal-muted flex items-center justify-between text-[11px] text-gray-500">
              <span>Slug: {cat.slug}</span>
              <button
                onClick={() => startEdit(cat)}
                className="text-brand-yellow hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
