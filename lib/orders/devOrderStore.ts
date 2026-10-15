/**
 * Development In-Memory Order Store
 * Used when Supabase cloud database credentials have not yet been configured in .env.local.
 * Kalahari Pub & Restaurant — Phase 3
 */

import { OrderWithItems } from "@/types/database.types";

declare global {
  var __kalahari_dev_orders: Map<string, OrderWithItems> | undefined;
}

if (!globalThis.__kalahari_dev_orders) {
  globalThis.__kalahari_dev_orders = new Map<string, OrderWithItems>();
}

export const devOrderStore = {
  saveOrder(order: OrderWithItems) {
    globalThis.__kalahari_dev_orders?.set(order.order_number, order);
  },

  getOrderByNumber(orderNumber: string, accessToken: string): OrderWithItems | null {
    const order = globalThis.__kalahari_dev_orders?.get(orderNumber);
    if (!order) return null;
    if (order.access_token !== accessToken) return null;
    return order;
  },

  getOrderByIdempotencyKey(key: string): OrderWithItems | null {
    if (!globalThis.__kalahari_dev_orders) return null;
    for (const order of globalThis.__kalahari_dev_orders.values()) {
      if (order.idempotency_key === key) return order;
    }
    return null;
  },
};
