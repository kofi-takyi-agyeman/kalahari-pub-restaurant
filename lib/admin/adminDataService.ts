/**
 * Admin Data Service
 * Authoritative data retrieval and metrics for admin dashboards.
 * Seamlessly interfaces with Supabase PostgreSQL or local dev store.
 * Kalahari Pub & Restaurant — Phases 4 & 5
 */

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { devAdminStore } from "./devAdminStore";
import {
  OrderWithItems,
  MenuItemRow,
  MenuCategoryRow,
  OrderStatus,
} from "@/types/database.types";

export interface DashboardMetrics {
  counts: {
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    completed: number;
    cancelled: number;
    total: number;
  };
  revenue: {
    completedSalesGHS: number;
    pendingPipelineGHS: number;
  };
  menuStats: {
    totalItems: number;
    availableItems: number;
    unavailableItems: number;
    samplePriceCount: number;
  };
  recentOrders: OrderWithItems[];
}

export async function getAdminDashboardMetrics(): Promise<DashboardMetrics> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        // 1. Fetch Orders
        const { data: dbOrders } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false });

        const orders: OrderWithItems[] = (dbOrders as OrderWithItems[]) || [];

        // 2. Fetch Menu Items
        const { data: dbMenuItems } = await supabase
          .from("menu_items")
          .select("*");

        const menuItems: MenuItemRow[] = (dbMenuItems as MenuItemRow[]) || [];

        return calculateMetricsFromData(orders, menuItems);
      }
    } catch (err) {
      console.error("[Admin Data Service] Error fetching metrics from DB:", err);
    }
  }

  // Development Fallback
  const orders = devAdminStore.getAllOrders();
  const menuItems = devAdminStore.getAllMenuItems();
  return calculateMetricsFromData(orders, menuItems);
}

function calculateMetricsFromData(orders: OrderWithItems[], menuItems: MenuItemRow[]): DashboardMetrics {
  const counts = {
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
    total: orders.length,
  };

  let completedSalesGHS = 0;
  let pendingPipelineGHS = 0;

  for (const order of orders) {
    if (order.status === "pending") counts.pending++;
    else if (order.status === "confirmed") counts.confirmed++;
    else if (order.status === "preparing") counts.preparing++;
    else if (order.status === "ready") counts.ready++;
    else if (order.status === "completed") {
      counts.completed++;
      completedSalesGHS += Number(order.total) || 0;
    } else if (order.status === "cancelled") {
      counts.cancelled++;
    }

    if (["pending", "confirmed", "preparing", "ready"].includes(order.status)) {
      pendingPipelineGHS += Number(order.total) || 0;
    }
  }

  const menuStats = {
    totalItems: menuItems.length,
    availableItems: menuItems.filter((i) => i.is_available).length,
    unavailableItems: menuItems.filter((i) => !i.is_available).length,
    samplePriceCount: menuItems.filter((i) => i.is_sample_price).length,
  };

  return {
    counts,
    revenue: {
      completedSalesGHS: Math.round(completedSalesGHS * 100) / 100,
      pendingPipelineGHS: Math.round(pendingPipelineGHS * 100) / 100,
    },
    menuStats,
    recentOrders: orders.slice(0, 8),
  };
}

export async function getAdminOrders(filters?: {
  status?: string;
  search?: string;
}): Promise<OrderWithItems[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        let query = supabase
          .from("orders")
          .select("*, order_items(*), order_status_logs(*)")
          .order("created_at", { ascending: false });

        if (filters?.status && filters.status !== "all") {
          query = query.eq("status", filters.status as OrderStatus);
        }

        if (filters?.search && filters.search.trim()) {
          const q = filters.search.trim();
          query = query.or(
            `order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`
          );
        }

        const { data, error } = await query;
        if (!error && data) {
          return data as OrderWithItems[];
        }
      }
    } catch (err) {
      console.error("[Admin Data Service] Orders query error:", err);
    }
  }

  return devAdminStore.getAllOrders(filters);
}

export async function getAdminOrderDetail(idOrNumber: string): Promise<OrderWithItems | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*), order_status_logs(*)")
          .or(`id.eq.${idOrNumber},order_number.eq.${idOrNumber}`)
          .maybeSingle();

        if (!error && data) {
          return data as OrderWithItems;
        }
      }
    } catch (err) {
      console.error("[Admin Data Service] Order detail query error:", err);
    }
  }

  return devAdminStore.getOrderById(idOrNumber);
}

export async function getAdminMenuItems(): Promise<MenuItemRow[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*, category:menu_categories(*)")
          .order("display_order", { ascending: true });

        if (!error && data) {
          return data as MenuItemRow[];
        }
      }
    } catch (err) {
      console.error("[Admin Data Service] Menu query error:", err);
    }
  }

  return devAdminStore.getAllMenuItems();
}

export async function getAdminCategories(): Promise<MenuCategoryRow[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("menu_categories")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data) {
          return data as MenuCategoryRow[];
        }
      }
    } catch (err) {
      console.error("[Admin Data Service] Categories query error:", err);
    }
  }

  return devAdminStore.getAllCategories();
}
