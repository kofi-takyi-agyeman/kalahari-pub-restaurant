/**
 * Development Admin Store
 * Provides isomorphic local development state for Orders, Menu Management, Categories,
 * and Operational Settings when Supabase cloud credentials are not yet configured.
 * Kalahari Pub & Restaurant — Phases 4 & 5
 */

import {
  OrderWithItems,
  OrderStatus,
  OrderStatusLogRow,
  MenuItemRow,
  MenuCategoryRow,
  DeliveryConfig,
  OperatingHoursConfig,
} from "@/types/database.types";
import { menuItems as defaultMenuItems } from "@/data/menuItems";
import { categories as defaultCategories } from "@/data/categories";

declare global {
  var __kalahari_dev_menu_items: Map<string, MenuItemRow> | undefined;
  var __kalahari_dev_categories: Map<string, MenuCategoryRow> | undefined;
  var __kalahari_dev_settings: Map<string, unknown> | undefined;
  var __kalahari_dev_status_logs: Map<string, OrderStatusLogRow[]> | undefined;
}

// 1. Initialize Menu Items
if (!globalThis.__kalahari_dev_menu_items) {
  globalThis.__kalahari_dev_menu_items = new Map<string, MenuItemRow>();
}
const now = new Date().toISOString();
defaultMenuItems.forEach((item, index) => {
  const existing = globalThis.__kalahari_dev_menu_items!.get(item.id);
  if (!existing) {
    globalThis.__kalahari_dev_menu_items!.set(item.id, {
      id: item.id,
      category_id: item.category,
      name: item.name,
      slug: item.id,
      description: item.description,
      image_url: item.image,
      price: item.samplePrice,
      is_sample_price: item.isSamplePrice,
      is_available: item.isAvailable,
      is_featured: Boolean(item.isFeatured),
      display_order: index,
      created_at: now,
      updated_at: now,
    });
  } else {
    if (item.image.startsWith("/dishes/") && existing.image_url !== item.image) {
      existing.image_url = item.image;
    }
    existing.name = item.name;
    existing.description = item.description;
  }
});

// 2. Initialize Categories
if (!globalThis.__kalahari_dev_categories) {
  globalThis.__kalahari_dev_categories = new Map<string, MenuCategoryRow>();
}
defaultCategories.forEach((cat, index) => {
  const existing = globalThis.__kalahari_dev_categories!.get(cat.id);
  if (!existing) {
    globalThis.__kalahari_dev_categories!.set(cat.id, {
      id: cat.id,
      name: cat.name,
      slug: cat.id,
      description: `Authentic ${cat.name} freshly prepared at Kalahari Dine.`,
      image_url: cat.image || null,
      display_order: index,
      is_active: true,
      created_at: now,
      updated_at: now,
    });
  } else if (cat.image && existing.image_url !== cat.image) {
    existing.image_url = cat.image;
  }
});

// 3. Initialize Settings
if (!globalThis.__kalahari_dev_settings) {
  globalThis.__kalahari_dev_settings = new Map<string, unknown>();
  const defaultDelivery: DeliveryConfig = {
    enabled: false,
    policy_notice: "Pending owner delivery fee and coverage ratification",
    zones: [
      { area: "A-Lang", fee: 15.0 },
      { area: "Sowutuom", fee: 20.0 },
      { area: "Kwashieman", fee: 25.0 },
      { area: "Santa Maria", fee: 25.0 },
    ],
    min_order: 0.0,
  };

  const defaultHours: OperatingHoursConfig = {
    monday_saturday: "10:00 AM - 11:00 PM",
    sunday: "12:00 PM - 11:00 PM",
    pickup_enabled: true,
    location: "Kalahari Dine, A-Lang Taxi Rank",
  };

  globalThis.__kalahari_dev_settings.set("delivery_config", defaultDelivery);
  globalThis.__kalahari_dev_settings.set("operating_hours", defaultHours);
}

// 4. Initialize Status Logs Map
if (!globalThis.__kalahari_dev_status_logs) {
  globalThis.__kalahari_dev_status_logs = new Map<string, OrderStatusLogRow[]>();
}

export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export const devAdminStore = {
  // --- ORDERS ---
  getAllOrders(filters?: { status?: string; search?: string }): OrderWithItems[] {
    const ordersMap = globalThis.__kalahari_dev_orders;
    if (!ordersMap) return [];
    let list = Array.from(ordersMap.values());

    // Attach status logs
    list = list.map((order) => ({
      ...order,
      order_status_logs: globalThis.__kalahari_dev_status_logs?.get(order.id) || [],
    }));

    if (filters?.status && filters.status !== "all") {
      list = list.filter((o) => o.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q)
      );
    }

    // Sort newest first
    return list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  getOrderById(idOrNumber: string): OrderWithItems | null {
    const ordersMap = globalThis.__kalahari_dev_orders;
    if (!ordersMap) return null;
    let found: OrderWithItems | undefined;
    for (const o of ordersMap.values()) {
      if (o.id === idOrNumber || o.order_number === idOrNumber) {
        found = o;
        break;
      }
    }
    if (!found) return null;

    return {
      ...found,
      order_status_logs: globalThis.__kalahari_dev_status_logs?.get(found.id) || [],
    };
  },

  updateOrderStatus(
    idOrNumber: string,
    newStatus: OrderStatus,
    changedBy: string = "admin",
    notes?: string
  ): { success: boolean; error?: string; order?: OrderWithItems } {
    const order = this.getOrderById(idOrNumber);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const previousStatus = order.status;
    const allowed = VALID_STATUS_TRANSITIONS[previousStatus];
    if (!allowed.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid status transition from "${previousStatus}" to "${newStatus}". Allowed transitions: ${allowed.join(", ") || "none (terminal state)"}.`,
      };
    }

    const now = new Date().toISOString();
    order.status = newStatus;
    order.updated_at = now;

    // Save updated order
    globalThis.__kalahari_dev_orders?.set(order.order_number, order);

    // Append to status logs
    const logEntry: OrderStatusLogRow = {
      id: crypto.randomUUID(),
      order_id: order.id,
      previous_status: previousStatus,
      new_status: newStatus,
      changed_by: changedBy,
      notes: notes || null,
      created_at: now,
    };

    const existingLogs = globalThis.__kalahari_dev_status_logs?.get(order.id) || [];
    existingLogs.push(logEntry);
    globalThis.__kalahari_dev_status_logs?.set(order.id, existingLogs);

    order.order_status_logs = existingLogs;

    return { success: true, order };
  },

  // --- MENU ITEMS ---
  getAllMenuItems(): MenuItemRow[] {
    const itemsMap = globalThis.__kalahari_dev_menu_items;
    if (!itemsMap) return [];
    return Array.from(itemsMap.values()).sort((a, b) => a.display_order - b.display_order);
  },

  getMenuItemById(id: string): MenuItemRow | null {
    return globalThis.__kalahari_dev_menu_items?.get(id) || null;
  },

  createMenuItem(item: Omit<MenuItemRow, "created_at" | "updated_at">): MenuItemRow {
    const now = new Date().toISOString();
    const newItem: MenuItemRow = {
      ...item,
      created_at: now,
      updated_at: now,
    };
    globalThis.__kalahari_dev_menu_items?.set(newItem.id, newItem);
    return newItem;
  },

  updateMenuItem(id: string, updates: Partial<MenuItemRow>): MenuItemRow | null {
    const existing = globalThis.__kalahari_dev_menu_items?.get(id);
    if (!existing) return null;
    const updated: MenuItemRow = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    globalThis.__kalahari_dev_menu_items?.set(id, updated);
    return updated;
  },

  deleteMenuItem(id: string): boolean {
    return globalThis.__kalahari_dev_menu_items?.delete(id) || false;
  },

  approveMenuPrice(id: string): MenuItemRow | null {
    return this.updateMenuItem(id, { is_sample_price: false });
  },

  toggleMenuAvailability(id: string): MenuItemRow | null {
    const existing = this.getMenuItemById(id);
    if (!existing) return null;
    return this.updateMenuItem(id, { is_available: !existing.is_available });
  },

  // --- CATEGORIES ---
  getAllCategories(): MenuCategoryRow[] {
    const catMap = globalThis.__kalahari_dev_categories;
    if (!catMap) return [];
    return Array.from(catMap.values()).sort((a, b) => a.display_order - b.display_order);
  },

  createCategory(cat: Omit<MenuCategoryRow, "created_at" | "updated_at">): MenuCategoryRow {
    const now = new Date().toISOString();
    const newCat: MenuCategoryRow = {
      ...cat,
      created_at: now,
      updated_at: now,
    };
    globalThis.__kalahari_dev_categories?.set(newCat.id, newCat);
    return newCat;
  },

  updateCategory(id: string, updates: Partial<MenuCategoryRow>): MenuCategoryRow | null {
    const existing = globalThis.__kalahari_dev_categories?.get(id);
    if (!existing) return null;
    const updated: MenuCategoryRow = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    globalThis.__kalahari_dev_categories?.set(id, updated);
    return updated;
  },

  // --- SETTINGS ---
  getSettings<T = unknown>(key: string): T | null {
    return (globalThis.__kalahari_dev_settings?.get(key) as T) || null;
  },

  updateSettings<T = unknown>(key: string, value: T): T {
    globalThis.__kalahari_dev_settings?.set(key, value);
    return value;
  },
};
