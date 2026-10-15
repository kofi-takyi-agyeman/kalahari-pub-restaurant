"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { devAdminStore, VALID_STATUS_TRANSITIONS } from "@/lib/admin/devAdminStore";
import { OrderStatus } from "@/types/database.types";

export interface UpdateStatusResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Update Order Status
 * Enforces valid state transitions and records audit logs.
 */
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<UpdateStatusResult> {
  const session = await getAdminSession();
  if (!session.isAuthenticated || !session.user) {
    return { success: false, error: "Unauthorized: Administrator login required." };
  }

  const staffIdentifier = session.user.email || "staff-admin";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return { success: false, error: "Database client unavailable." };

      // 1. Fetch current order status
      const { data: currentOrder, error: fetchErr } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .maybeSingle();

      if (fetchErr || !currentOrder) {
        return { success: false, error: "Order not found." };
      }

      const prevStatus = currentOrder.status as OrderStatus;
      const allowed = VALID_STATUS_TRANSITIONS[prevStatus];
      if (!allowed || !allowed.includes(newStatus)) {
        return {
          success: false,
          error: `Cannot transition order from "${prevStatus}" to "${newStatus}".`,
        };
      }

      // 2. Update status
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // 3. Insert audit log
      await supabase.from("order_status_logs").insert({
        order_id: orderId,
        previous_status: prevStatus,
        new_status: newStatus,
        changed_by: staffIdentifier,
        notes: notes || null,
      });

      revalidatePath("/admin");
      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update order.";
      return { success: false, error: msg };
    }
  }

  // Development Fallback
  const result = devAdminStore.updateOrderStatus(orderId, newStatus, staffIdentifier, notes);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
