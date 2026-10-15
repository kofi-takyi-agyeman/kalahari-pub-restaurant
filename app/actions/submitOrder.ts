"use server";

import crypto from "crypto";
import {
  CheckoutPayload,
  validateCheckoutInput,
} from "@/lib/orders/orderValidation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { menuItems as localFallbackItems } from "@/data/menuItems";
import { devOrderStore } from "@/lib/orders/devOrderStore";
import { devAdminStore } from "@/lib/admin/devAdminStore";
import { getDeliveryConfig } from "@/lib/admin/settingsService";
import { OrderRow, OrderItemRow, OrderWithItems } from "@/types/database.types";
import { businessConfig } from "@/lib/businessConfig";

export interface SubmitOrderResponse {
  success: boolean;
  orderNumber?: string;
  accessToken?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  isSamplePriceBlocked?: boolean;
}

/**
 * Server Action: Submit Customer Order
 * Validates customer data, verifies authoritative database prices, enforces
 * sample price and delivery rules, and saves orders atomically.
 */
export async function submitOrder(payload: CheckoutPayload): Promise<SubmitOrderResponse> {
  try {
    // 1. Fetch current delivery config and validate customer/cart payload
    const deliveryConfig = await getDeliveryConfig();
    const validation = validateCheckoutInput(payload, deliveryConfig);
    if (!validation.isValid) {
      return {
        success: false,
        fieldErrors: validation.fieldErrors,
        error: validation.generalError || "Validation failed. Please check the form.",
      };
    }

    const { cleanCustomer, cleanItems } = validation;
    const idempotencyKey = payload.idempotencyKey || null;

    // 2. Prevent duplicate submissions using idempotency key
    if (idempotencyKey) {
      if (isSupabaseConfigured()) {
        const supabase = await createSupabaseServerClient();
        if (supabase) {
          const { data: existingOrder } = await supabase
            .from("orders")
            .select("order_number, access_token")
            .eq("idempotency_key", idempotencyKey)
            .maybeSingle();

          if (existingOrder) {
            return {
              success: true,
              orderNumber: existingOrder.order_number,
              accessToken: existingOrder.access_token,
            };
          }
        }
      } else {
        const existingOrder = devOrderStore.getOrderByIdempotencyKey(idempotencyKey);
        if (existingOrder) {
          return {
            success: true,
            orderNumber: existingOrder.order_number,
            accessToken: existingOrder.access_token,
          };
        }
      }
    }

    // 3. Authoritative item verification (Lookup authoritative prices and availability)
    interface VerifiedItem {
      id: string;
      name: string;
      price: number;
      isAvailable: boolean;
      isSamplePrice: boolean;
      quantity: number;
      lineTotal: number;
    }

    const verifiedItems: VerifiedItem[] = [];

    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) {
        return {
          success: false,
          error: "Database client initialization failed. Please contact the restaurant.",
        };
      }

      const itemIds = cleanItems.map((i) => i.id);
      const { data: dbItems, error: fetchError } = await supabase
        .from("menu_items")
        .select("id, name, price, is_available, is_sample_price")
        .in("id", itemIds);

      if (fetchError || !dbItems) {
        return {
          success: false,
          error: "Unable to verify dish prices from database. Please try again or call the restaurant.",
        };
      }

      for (const reqItem of cleanItems) {
        const dbItem = dbItems.find((d) => d.id === reqItem.id);
        if (!dbItem || !dbItem.is_available) {
          return {
            success: false,
            error: `The dish "${dbItem?.name || reqItem.id}" is currently unavailable or no longer on the menu.`,
          };
        }

        // CRITICAL BUSINESS RULE: Block commercial orders with unapproved sample prices
        if (dbItem.is_sample_price) {
          return {
            success: false,
            isSamplePriceBlocked: true,
            error: `Unable to complete online order: "${dbItem.name}" is currently listed with a temporary demonstration price (${businessConfig.samplePriceNotice}). Official prices must be confirmed with management. Please call any of our lines (${businessConfig.phones[0].formatted} / ${businessConfig.phones[1].formatted}) to place your order directly.`,
          };
        }

        const unitPrice = Number(dbItem.price);
        const lineTotal = Math.round(unitPrice * reqItem.quantity * 100) / 100;

        verifiedItems.push({
          id: dbItem.id,
          name: dbItem.name,
          price: unitPrice,
          isAvailable: dbItem.is_available,
          isSamplePrice: dbItem.is_sample_price,
          quantity: reqItem.quantity,
          lineTotal,
        });
      }
    } else {
      // Local fallback lookup when Supabase environment variables have not been connected
      for (const reqItem of cleanItems) {
        // Check devAdminStore first (reflects any live owner updates), then fallback static items
        const adminItem = devAdminStore.getMenuItemById(reqItem.id);
        const localItem = adminItem
          ? {
              id: adminItem.id,
              name: adminItem.name,
              samplePrice: adminItem.price,
              isAvailable: adminItem.is_available,
              isSamplePrice: adminItem.is_sample_price,
            }
          : localFallbackItems.find((l) => l.id === reqItem.id);

        if (!localItem || !localItem.isAvailable) {
          return {
            success: false,
            error: `The dish "${localItem?.name || reqItem.id}" is currently unavailable.`,
          };
        }

        // CRITICAL BUSINESS RULE: Block commercial orders with sample prices
        if (localItem.isSamplePrice) {
          return {
            success: false,
            isSamplePriceBlocked: true,
            error: `Unable to complete online order: "${localItem.name}" is currently listed with a temporary demonstration price (${businessConfig.samplePriceNotice}). Official commercial prices must be confirmed with management. Please call us directly at ${businessConfig.phones[0].formatted} to place your order with our staff.`,
          };
        }

        const unitPrice = Number(localItem.samplePrice);
        const lineTotal = Math.round(unitPrice * reqItem.quantity * 100) / 100;

        verifiedItems.push({
          id: localItem.id,
          name: localItem.name,
          price: unitPrice,
          isAvailable: localItem.isAvailable,
          isSamplePrice: localItem.isSamplePrice,
          quantity: reqItem.quantity,
          lineTotal,
        });
      }
    }

    // 4. Calculate Server-Side Financials
    const subtotal = verifiedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryFee = cleanCustomer.orderType === "delivery" ? validation.approvedDeliveryFee : 0.0;
    const total = Math.round((subtotal + deliveryFee) * 100) / 100;

    // 5. Generate secure identifiers
    const dateSegment = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderNumber = `KP-${dateSegment}-${randomHex}`;
    const accessToken = crypto.randomBytes(24).toString("hex");
    const orderId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    // 6. Atomic Database Persistence
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) {
        return {
          success: false,
          error: "Database connection failed during order submission.",
        };
      }

      // Insert Order Header
      const { error: orderInsertError } = await supabase.from("orders").insert({
        id: orderId,
        order_number: orderNumber,
        access_token: accessToken,
        idempotency_key: idempotencyKey,
        customer_name: cleanCustomer.customerName,
        customer_phone: cleanCustomer.customerPhone,
        order_type: cleanCustomer.orderType,
        delivery_address: cleanCustomer.deliveryAddress || null,
        delivery_area: cleanCustomer.deliveryArea || null,
        delivery_instructions: cleanCustomer.deliveryInstructions || null,
        customer_note: cleanCustomer.customerNote || null,
        status: "pending",
        currency: "GHS",
        subtotal,
        delivery_fee: deliveryFee,
        total,
      });

      if (orderInsertError) {
        console.error("[Kalahari Order Action] Error inserting order:", orderInsertError.message);
        return {
          success: false,
          error: "Failed to create order record. Please try again or call the restaurant directly.",
        };
      }

      // Insert Line Items
      const orderItemsRows = verifiedItems.map((item) => ({
        id: crypto.randomUUID(),
        order_id: orderId,
        menu_item_id: item.id,
        item_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.lineTotal,
      }));

      const { error: itemsInsertError } = await supabase
        .from("order_items")
        .insert(orderItemsRows);

      if (itemsInsertError) {
        console.error(
          "[Kalahari Order Action] Error inserting order items:",
          itemsInsertError.message
        );
        // Attempt rollback by deleting header
        await supabase.from("orders").delete().eq("id", orderId);
        return {
          success: false,
          error: "Failed to save order details. Please contact the restaurant.",
        };
      }
    } else {
      // Save to development in-memory store
      const orderHeader: OrderRow = {
        id: orderId,
        order_number: orderNumber,
        access_token: accessToken,
        idempotency_key: idempotencyKey,
        customer_name: cleanCustomer.customerName,
        customer_phone: cleanCustomer.customerPhone,
        order_type: cleanCustomer.orderType,
        delivery_address: cleanCustomer.deliveryAddress || null,
        delivery_area: cleanCustomer.deliveryArea || null,
        delivery_instructions: cleanCustomer.deliveryInstructions || null,
        customer_note: cleanCustomer.customerNote || null,
        status: "pending",
        currency: "GHS",
        subtotal,
        delivery_fee: deliveryFee,
        total,
        created_at: nowIso,
        updated_at: nowIso,
      };

      const orderItemsList: OrderItemRow[] = verifiedItems.map((item) => ({
        id: crypto.randomUUID(),
        order_id: orderId,
        menu_item_id: item.id,
        item_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.lineTotal,
        created_at: nowIso,
      }));

      devOrderStore.saveOrder({
        ...orderHeader,
        order_items: orderItemsList,
      });
    }

    return {
      success: true,
      orderNumber,
      accessToken,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "An unexpected server error occurred.";
    console.error("[Kalahari Order Action] Unexpected error:", errorMsg);
    return {
      success: false,
      error: "An unexpected server error occurred during order submission.",
    };
  }
}

/**
 * Server Action: Retrieve Order Confirmation Details
 * Protects customer privacy by requiring matching access_token.
 */
export async function getOrderConfirmation(orderNumber: string, accessToken: string) {
  if (!orderNumber || !accessToken) {
    return null;
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .eq("access_token", accessToken)
      .maybeSingle();

    return order as OrderWithItems | null;
  } else {
    return devOrderStore.getOrderByNumber(orderNumber, accessToken);
  }
}
