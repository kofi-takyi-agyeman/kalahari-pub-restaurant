/**
 * Kalahari Pub & Restaurant — Payment Architecture & Gateway Integration Safety
 * Developed under the Data_Nova Brand
 * 
 * CRITICAL FINANCIAL INTEGRITY RULES:
 * 1. Online payments (Paystack, Hubtel Mobile Money, Card) are strictly OFFLINE/DISABLED
 *    until the restaurant owner ratifies merchant accounts and configures signed webhook secrets.
 * 2. Orders placed through this system are recorded as "unpaid" cash/pay-at-pickup.
 * 3. Never trust client-submitted payment confirmations or browser redirect parameters.
 * 4. Only cryptographically verified server-to-server webhooks or authenticated admin actions
 *    can transition an order to "paid".
 */

import crypto from "crypto";

export type PaymentMethod = "cash_on_delivery" | "cash_on_pickup" | "mobile_money" | "card";

export type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "failed" | "refunded";

export interface PaymentGatewayConfig {
  provider: "none" | "paystack" | "hubtel";
  isLive: boolean;
  currency: "GHS";
  supportedMethods: PaymentMethod[];
}

/**
 * Returns the authoritative payment gateway configuration.
 * In current production state without merchant keys, online processing is disabled.
 */
export function getPaymentGatewayConfig(): PaymentGatewayConfig {
  const provider = (process.env.PAYMENT_PROVIDER || "none").toLowerCase() as "none" | "paystack" | "hubtel";
  const hasPaystackSecret = Boolean(
    process.env.PAYSTACK_SECRET_KEY &&
    process.env.PAYSTACK_SECRET_KEY.trim() !== "" &&
    !process.env.PAYSTACK_SECRET_KEY.includes("your-")
  );

  const isLive = provider === "paystack" && hasPaystackSecret;

  return {
    provider: isLive ? "paystack" : "none",
    isLive,
    currency: "GHS",
    supportedMethods: isLive
      ? ["cash_on_pickup", "cash_on_delivery", "mobile_money", "card"]
      : ["cash_on_pickup", "cash_on_delivery"],
  };
}

/**
 * Validates a Paystack webhook signature using HMAC SHA-512.
 * Prevents forged payment confirmations.
 */
export function verifyPaystackSignature(
  rawBody: string,
  signatureHeader: string | null | undefined
): boolean {
  const secretKey = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || !signatureHeader || !rawBody) {
    return false;
  }

  try {
    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(signatureHeader, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Validates whether an order can be marked as paid.
 * Rejects unverified client-side claims.
 */
export function canMarkOrderPaid(params: {
  currentPaymentStatus: PaymentStatus;
  actor: "admin" | "webhook" | "client";
  isWebhookVerified?: boolean;
}): { allowed: boolean; reason?: string } {
  const { currentPaymentStatus, actor, isWebhookVerified } = params;

  if (actor === "client") {
    return {
      allowed: false,
      reason: "Security Violation: Browser clients cannot directly mark orders as paid.",
    };
  }

  if (currentPaymentStatus === "paid") {
    return { allowed: false, reason: "Order is already marked as paid." };
  }

  if (currentPaymentStatus === "refunded") {
    return { allowed: false, reason: "Cannot pay a refunded order." };
  }

  if (actor === "webhook" && !isWebhookVerified) {
    return {
      allowed: false,
      reason: "Security Violation: Unverified webhook signature rejected.",
    };
  }

  return { allowed: true };
}
