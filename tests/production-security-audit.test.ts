/**
 * KALAHARI PUB & RESTAURANT — PRODUCTION READINESS & SECURITY AUDIT TEST SUITE
 * Developed under the Data_Nova Brand
 * 
 * Verifies security hardening, production fallback refusal, payment protection,
 * token verification, and state machine integrity.
 */

import assert from "assert";
import crypto from "crypto";
import { submitOrder, getOrderConfirmation } from "../app/actions/submitOrder";
import { getAdminSession, loginAdmin } from "../lib/admin/adminAuth";
import {
  canMarkOrderPaid,
  verifyPaystackSignature,
  getPaymentGatewayConfig,
} from "../lib/orders/paymentIntegration";
import { devAdminStore, VALID_STATUS_TRANSITIONS } from "../lib/admin/devAdminStore";
import { normalizeGhanaPhone, validateCheckoutInput } from "../lib/orders/orderValidation";
import { OrderStatus } from "../types/database.types";

async function runSecurityAuditTests() {
  console.log("=======================================================");
  console.log("   KALAHARI PUB — PRODUCTION SECURITY & RELEASE AUDIT  ");
  console.log("=======================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    totalTests++;
    try {
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passedTests++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ FAIL: ${name}\n    Error: ${msg}`);
    }
  }

  // -------------------------------------------------------------------
  // SUITE 1: Production Fallback Protection & Safe Failure
  // -------------------------------------------------------------------
  console.log("Suite 1: Production Fallback Protection & Safe Failure");

  // Temporarily simulate production environment
  const originalNodeEnv = process.env.NODE_ENV;

  try {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    // 1. Admin login must be strictly rejected in production when Supabase is unconfigured
    const loginFormData = new FormData();
    loginFormData.append("email", "owner@kalaharipub.com");
    loginFormData.append("password", "KalahariOwner2026!");
    const prodLoginResult = await loginAdmin(loginFormData);
    test("Production blocks development admin login fallback", () => {
      assert(
        !prodLoginResult.success && prodLoginResult.error?.includes("disabled in production"),
        "Admin dev login must be refused in production"
      );
    });

    // 2. Admin session verification must reject dev fallback in production
    const prodSession = await getAdminSession();
    test("Production rejects dev session cookie fallback", () => {
      assert(
        !prodSession.isAuthenticated,
        "Production session verification must not accept dev fallback"
      );
    });

    // 3. Customer order submission must fail safely in production when DB is unconfigured
    const prodOrderResult = await submitOrder({
      customer: {
        customerName: "Audited Customer",
        customerPhone: "0245656849",
        orderType: "pickup",
      },
      items: [{ id: "grilled-tilapia-whole", quantity: 1 }],
    });
    test("Production refuses to silently store customer orders in-memory", () => {
      assert(
        !prodOrderResult.success &&
          prodOrderResult.error?.includes("temporarily unavailable due to server configuration"),
        "Must fail safely with explicit customer contact guidance rather than silently using RAM"
      );
    });

    // 4. Token confirmation lookup refuses memory fallback in production
    const prodLookupResult = await getOrderConfirmation("KP-20261015-TEST", "fake-token");
    test("Production refuses in-memory order receipt lookup", () => {
      assert(prodLookupResult === null, "Must return null in production if DB unconfigured");
    });
  } finally {
    (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
  }

  // -------------------------------------------------------------------
  // SUITE 2: Payment Architecture & Anti-Tampering Safeguards
  // -------------------------------------------------------------------
  console.log("\nSuite 2: Payment Architecture & Anti-Tampering Safeguards");

  const gatewayConfig = getPaymentGatewayConfig();
  test("Online payment gateway is offline/disabled by default without merchant keys", () => {
    assert(gatewayConfig.isLive === false, "Payment gateway must default to offline");
    assert(
      gatewayConfig.supportedMethods.includes("cash_on_pickup") &&
        !gatewayConfig.supportedMethods.includes("card"),
      "Only cash/pay-at-pickup supported when unconfigured"
    );
  });

  // Client cannot claim an order is paid
  const clientPayAttempt = canMarkOrderPaid({
    currentPaymentStatus: "unpaid",
    actor: "client",
  });
  test("Browser client cannot directly mark order as paid", () => {
    assert(
      !clientPayAttempt.allowed && clientPayAttempt.reason?.includes("Security Violation"),
      "Client-side payment spoofing strictly blocked"
    );
  });

  // Unverified webhook cannot mark an order as paid
  const unverifiedWebhookAttempt = canMarkOrderPaid({
    currentPaymentStatus: "unpaid",
    actor: "webhook",
    isWebhookVerified: false,
  });
  test("Unverified webhook callback cannot mark order as paid", () => {
    assert(
      !unverifiedWebhookAttempt.allowed &&
        unverifiedWebhookAttempt.reason?.includes("Unverified webhook"),
      "Unsigned webhook rejected"
    );
  });

  // Verified admin can mark paid
  const adminPayAttempt = canMarkOrderPaid({
    currentPaymentStatus: "unpaid",
    actor: "admin",
  });
  test("Authenticated staff can record cash payment receipt", () => {
    assert(adminPayAttempt.allowed, "Admin payment recording accepted");
  });

  // Webhook HMAC signature verification
  const testSecret = "kalahari-audit-secret-key";
  process.env.PAYSTACK_WEBHOOK_SECRET = testSecret;
  const samplePayload = JSON.stringify({ event: "charge.success", data: { reference: "ref-123" } });
  const validSignature = crypto.createHmac("sha512", testSecret).update(samplePayload).digest("hex");
  const invalidSignature = crypto.createHmac("sha512", "wrong-secret").update(samplePayload).digest("hex");

  test("Valid HMAC SHA-512 webhook signature passes verification", () => {
    assert(verifyPaystackSignature(samplePayload, validSignature) === true);
  });

  test("Forged webhook signature fails verification", () => {
    assert(verifyPaystackSignature(samplePayload, invalidSignature) === false);
  });

  delete process.env.PAYSTACK_WEBHOOK_SECRET;

  // -------------------------------------------------------------------
  // SUITE 3: Customer Privacy & Access Token Entropy
  // -------------------------------------------------------------------
  console.log("\nSuite 3: Customer Privacy & Access Token Entropy");

  test("Order confirmation lookup requires both orderNumber and accessToken", async () => {
    const missingToken = await getOrderConfirmation("KP-20261015-ABCD", "");
    assert(missingToken === null, "Lookup without token must return null");

    const missingOrderNum = await getOrderConfirmation("", "valid-token-string");
    assert(missingOrderNum === null, "Lookup without orderNumber must return null");
  });

  test("Access token guessing is blocked when token does not match", async () => {
    const dish = devAdminStore.getAllMenuItems()[0];
    devAdminStore.approveMenuPrice(dish.id);

    const created = await submitOrder({
      customer: {
        customerName: "Privacy Test Customer",
        customerPhone: "0245656849",
        orderType: "pickup",
      },
      items: [{ id: dish.id, quantity: 1 }],
    });

    assert(created.success && created.orderNumber && created.accessToken);

    // Attempt lookup with wrong token
    const leakedLookup = await getOrderConfirmation(created.orderNumber, "wrong-guessed-token-12345");
    assert(leakedLookup === null, "Unauthorized token lookup must fail");

    // Lookup with correct token
    const correctLookup = await getOrderConfirmation(created.orderNumber, created.accessToken);
    assert(correctLookup !== null, "Authorized token lookup must succeed");
    assert(
      correctLookup.customer_name === "Privacy Test Customer",
      "Authorized customer details returned"
    );
  });

  // -------------------------------------------------------------------
  // SUITE 4: Order Lifecycle State Machine Integrity
  // -------------------------------------------------------------------
  console.log("\nSuite 4: Order Lifecycle State Machine Integrity");

  test("Valid status transitions are accepted according to state machine", () => {
    assert(VALID_STATUS_TRANSITIONS.pending.includes("confirmed"));
    assert(VALID_STATUS_TRANSITIONS.pending.includes("cancelled"));
    assert(VALID_STATUS_TRANSITIONS.confirmed.includes("preparing"));
    assert(VALID_STATUS_TRANSITIONS.preparing.includes("ready"));
    assert(VALID_STATUS_TRANSITIONS.ready.includes("completed"));
  });

  test("Terminal states strictly prohibit further transitions", () => {
    assert(
      VALID_STATUS_TRANSITIONS.completed.length === 0,
      "Completed is a terminal state with no allowed transitions"
    );
    assert(
      VALID_STATUS_TRANSITIONS.cancelled.length === 0,
      "Cancelled is a terminal state with no allowed transitions"
    );
  });

  // -------------------------------------------------------------------
  // SUITE 5: Phone Normalization & Input Validation
  // -------------------------------------------------------------------
  console.log("\nSuite 5: Phone Normalization & Input Validation");

  const phoneCases = [
    { input: "0245656849", expected: "0245656849", valid: true },
    { input: "+233 24 565 6849", expected: "0245656849", valid: true },
    { input: "233207157071", expected: "0207157071", valid: true },
    { input: "00233246773225", expected: "0246773225", valid: true },
    { input: "0123456789", expected: null, valid: false }, // Invalid Ghanaian prefix
    { input: "024565684", expected: null, valid: false }, // 9 digits (too short)
    { input: "02456568490", expected: null, valid: false }, // 11 digits (too long)
    { input: "phone-number", expected: null, valid: false },
  ];

  phoneCases.forEach((tc) => {
    const res = normalizeGhanaPhone(tc.input);
    test(`Phone normalization: "${tc.input}" -> valid=${tc.valid}`, () => {
      assert(res.isValid === tc.valid);
      if (tc.valid) {
        assert(res.normalized === tc.expected);
      }
    });
  });

  // -------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`TEST SUMMARY: ${passedTests} PASSED, ${totalTests - passedTests} FAILED (TOTAL: ${totalTests})`);
  console.log("=======================================================\n");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runSecurityAuditTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
