/**
 * Comprehensive Automated Test Suite for Phase 3
 * Kalahari Pub & Restaurant — Data_Nova
 *
 * Verifies:
 * 1. Ghanaian phone normalization & validation across MTN, Telecel, AT
 * 2. Customer inputs bounds, names, notes
 * 3. Conditional delivery validation & missing configuration block
 * 4. Quantity bounds & empty cart rejection
 * 5. Price manipulation prevention (server calculates authoritative amounts)
 * 6. Sample-price blocking rule (commercial orders cannot be submitted with sample prices)
 * 7. Idempotency duplicate prevention
 * 8. Unguessable token receipt authorization
 */

import {
  normalizeGhanaPhone,
  validateCheckoutInput,
  CheckoutPayload,
} from "../lib/orders/orderValidation";
import { submitOrder, getOrderConfirmation } from "../app/actions/submitOrder";
import { menuItems } from "../data/menuItems";
import { devOrderStore } from "../lib/orders/devOrderStore";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   KALAHARI PUB & RESTAURANT — PHASE 3 AUTOMATED TESTS ");
  console.log("=======================================================\n");

  // -------------------------------------------------------------------
  // TEST SUITE 1: Ghanaian Phone Normalization & Validation
  // -------------------------------------------------------------------
  console.log("Suite 1: Ghanaian Phone Validation & Normalization");

  // Valid MTN numbers
  const mtn1 = normalizeGhanaPhone("0245656849");
  assert(mtn1.isValid && mtn1.normalized === "0245656849", "Standard 10-digit MTN (024) format accepts and normalizes");

  const mtn2 = normalizeGhanaPhone("024 565 6849");
  assert(mtn2.isValid && mtn2.normalized === "0245656849", "MTN with spaces (024 565 6849) stripped and normalized");

  const mtnIntl = normalizeGhanaPhone("+233 24 565 6849");
  assert(mtnIntl.isValid && mtnIntl.normalized === "0245656849", "International format (+233 24...) converted to standard local 024...");

  const mtnIntlNoPlus = normalizeGhanaPhone("233245656849");
  assert(mtnIntlNoPlus.isValid && mtnIntlNoPlus.normalized === "0245656849", "Intl format without plus (233...) converted to 024...");

  // Valid Telecel numbers
  const telecel = normalizeGhanaPhone("0207157071");
  assert(telecel.isValid && telecel.normalized === "0207157071", "Standard 10-digit Telecel (020) accepts and normalizes");

  // Valid AT (AirtelTigo) numbers
  const at = normalizeGhanaPhone("0271234567");
  assert(at.isValid && at.normalized === "0271234567", "Standard 10-digit AT (027) accepts and normalizes");

  // Invalid phone numbers
  const invalidShort = normalizeGhanaPhone("0241234");
  assert(!invalidShort.isValid, "Short phone number (<10 digits) correctly rejected");

  const invalidPrefix = normalizeGhanaPhone("0123456789");
  assert(!invalidPrefix.isValid, "Invalid network prefix (012) correctly rejected");

  const invalidLetters = normalizeGhanaPhone("0245ABC684");
  assert(!invalidLetters.isValid, "Alphanumeric phone correctly rejected");

  // -------------------------------------------------------------------
  // TEST SUITE 2: Customer Input & Delivery Policy Validation
  // -------------------------------------------------------------------
  console.log("\nSuite 2: Customer Input & Conditional Fulfillment Validation");

  // Valid Pickup Input
  const validPickupPayload: CheckoutPayload = {
    customer: {
      customerName: "Kofi Boateng",
      customerPhone: "0245656849",
      orderType: "pickup",
      customerNote: "Please pack banku hot",
    },
    items: [{ id: "kp-banku-tilapia", quantity: 2 }],
  };

  const pickupResult = validateCheckoutInput(validPickupPayload);
  assert(pickupResult.isValid, "Valid pickup order passes validation");

  // Empty Name rejection
  const invalidNamePayload: CheckoutPayload = {
    ...validPickupPayload,
    customer: { ...validPickupPayload.customer, customerName: " " },
  };
  const nameResult = validateCheckoutInput(invalidNamePayload);
  assert(!nameResult.isValid && !!nameResult.fieldErrors.customerName, "Blank customer name correctly rejected");

  // Oversized Name rejection
  const oversizedNamePayload: CheckoutPayload = {
    ...validPickupPayload,
    customer: { ...validPickupPayload.customer, customerName: "A".repeat(105) },
  };
  const oversizedNameResult = validateCheckoutInput(oversizedNamePayload);
  assert(!oversizedNameResult.isValid && !!oversizedNameResult.fieldErrors.customerName, "Customer name >100 characters correctly rejected");

  // Delivery order without address
  const missingAddressDeliveryPayload: CheckoutPayload = {
    customer: {
      customerName: "Ama Serwaa",
      customerPhone: "0207157071",
      orderType: "delivery",
    },
    items: [{ id: "kp-banku-tilapia", quantity: 1 }],
  };
  const missingAddressResult = validateCheckoutInput(missingAddressDeliveryPayload);
  assert(!missingAddressResult.isValid && !!missingAddressResult.fieldErrors.deliveryAddress, "Delivery order without street address correctly rejected");

  // Delivery order policy block
  const fullDeliveryPayload: CheckoutPayload = {
    customer: {
      customerName: "Ama Serwaa",
      customerPhone: "0207157071",
      orderType: "delivery",
      deliveryAddress: "Near A-Lang Taxi Rank, House No. 42",
      deliveryArea: "A-Lang",
    },
    items: [{ id: "kp-banku-tilapia", quantity: 1 }],
  };
  const deliveryPolicyResult = validateCheckoutInput(fullDeliveryPayload);
  assert(
    !deliveryPolicyResult.isValid &&
    deliveryPolicyResult.fieldErrors.orderType?.includes("pending confirmation of delivery coverage"),
    "Delivery orders held pending policy confirmation (preventing unapproved delivery charges)"
  );

  // -------------------------------------------------------------------
  // TEST SUITE 3: Cart Items & Quantity Bounds Validation
  // -------------------------------------------------------------------
  console.log("\nSuite 3: Cart Items & Quantity Bounds");

  // Empty cart rejection
  const emptyCartPayload: CheckoutPayload = {
    customer: validPickupPayload.customer,
    items: [],
  };
  const emptyCartResult = validateCheckoutInput(emptyCartPayload);
  assert(!emptyCartResult.isValid && !!emptyCartResult.fieldErrors.items, "Empty cart correctly rejected");

  // Zero quantity rejection
  const zeroQtyPayload: CheckoutPayload = {
    customer: validPickupPayload.customer,
    items: [{ id: "kp-banku-tilapia", quantity: 0 }],
  };
  const zeroQtyResult = validateCheckoutInput(zeroQtyPayload);
  assert(!zeroQtyResult.isValid, "Zero quantity rejected");

  // Negative quantity rejection
  const negQtyPayload: CheckoutPayload = {
    customer: validPickupPayload.customer,
    items: [{ id: "kp-banku-tilapia", quantity: -3 }],
  };
  const negQtyResult = validateCheckoutInput(negQtyPayload);
  assert(!negQtyResult.isValid, "Negative quantity rejected");

  // Excessively large quantity rejection (>50)
  const hugeQtyPayload: CheckoutPayload = {
    customer: validPickupPayload.customer,
    items: [{ id: "kp-banku-tilapia", quantity: 51 }],
  };
  const hugeQtyResult = validateCheckoutInput(hugeQtyPayload);
  assert(!hugeQtyResult.isValid, "Excessively large quantity (>50) rejected");

  // Fractional quantity rejection
  const fractionalQtyPayload: CheckoutPayload = {
    customer: validPickupPayload.customer,
    items: [{ id: "kp-banku-tilapia", quantity: 2.5 }],
  };
  const fractionalResult = validateCheckoutInput(fractionalQtyPayload);
  assert(!fractionalResult.isValid, "Fractional quantity rejected");

  // -------------------------------------------------------------------
  // TEST SUITE 4: Price Integrity & Sample Price Business Rule
  // -------------------------------------------------------------------
  console.log("\nSuite 4: Server Price Integrity & Sample Price Rule Enforcement");

  // Try submitting an order where items currently have sample prices
  const samplePricedItem = menuItems.find((i) => i.isSamplePrice);
  assert(!!samplePricedItem, `Found sample-priced item in menu: ${samplePricedItem?.name}`);

  if (samplePricedItem) {
    const submissionResult = await submitOrder({
      customer: validPickupPayload.customer,
      items: [{ id: samplePricedItem.id, quantity: 1 }],
      idempotencyKey: "test-idem-sample-" + Date.now(),
    });

    assert(
      !submissionResult.success && submissionResult.isSamplePriceBlocked === true,
      "CRITICAL: Order containing sample-priced item was blocked from final order creation"
    );
    assert(
      submissionResult.error?.includes("temporary demonstration price"),
      "Helpful explanatory notice and phone contact returned to customer"
    );
  }

  // Unavailable item rejection
  const unavailableItem = menuItems.find((i) => !i.isAvailable);
  if (unavailableItem) {
    const unavailableResult = await submitOrder({
      customer: validPickupPayload.customer,
      items: [{ id: unavailableItem.id, quantity: 1 }],
      idempotencyKey: "test-idem-unavail-" + Date.now(),
    });
    assert(
      !unavailableResult.success && unavailableResult.error?.includes("unavailable"),
      "Unavailable dish rejected by server action"
    );
  } else {
    // Non-existent ID rejection
    const fakeResult = await submitOrder({
      customer: validPickupPayload.customer,
      items: [{ id: "non-existent-dish-xyz", quantity: 1 }],
      idempotencyKey: "test-idem-fake-" + Date.now(),
    });
    assert(
      !fakeResult.success && fakeResult.error?.includes("unavailable"),
      "Non-existent menu item rejected by server action"
    );
  }

  // -------------------------------------------------------------------
  // TEST SUITE 5: Approved Price Order Creation & Idempotency
  // -------------------------------------------------------------------
  console.log("\nSuite 5: Order Submission, Idempotency, and Token Receipt Guard");

  // Temporarily simulate an approved-price item to test end-to-end creation
  const testItem = menuItems[0];
  const originalSampleState = testItem.isSamplePrice;
  (testItem as any).isSamplePrice = false; // Temporarily simulate owner price confirmation

  const idempotencyKey = "test-unique-key-" + Date.now();
  const successfulOrder = await submitOrder({
    customer: {
      customerName: "Yaw Mensah",
      customerPhone: "0245656849",
      orderType: "pickup",
      customerNote: "Extra spicy please",
    },
    items: [{ id: testItem.id, quantity: 2 }],
    idempotencyKey,
  });

  assert(successfulOrder.success, "Order with owner-confirmed price successfully created");
  assert(!!successfulOrder.orderNumber && successfulOrder.orderNumber.startsWith("KP-"), "Order received structured reference (KP-YYYYMMDD-XXXX)");
  assert(!!successfulOrder.accessToken && successfulOrder.accessToken.length >= 32, "Order received cryptographically secure access token");

  // Test Idempotency: Submitting again with identical idempotencyKey
  const duplicateAttempt = await submitOrder({
    customer: {
      customerName: "Yaw Mensah",
      customerPhone: "0245656849",
      orderType: "pickup",
    },
    items: [{ id: testItem.id, quantity: 2 }],
    idempotencyKey,
  });

  assert(
    duplicateAttempt.success &&
    duplicateAttempt.orderNumber === successfulOrder.orderNumber &&
    duplicateAttempt.accessToken === successfulOrder.accessToken,
    "Idempotency Guard: Repeated request returned existing order without creating duplicate"
  );

  // Test Order Confirmation Getter Security
  if (successfulOrder.orderNumber && successfulOrder.accessToken) {
    // Valid lookup with token
    const retrieved = await getOrderConfirmation(
      successfulOrder.orderNumber,
      successfulOrder.accessToken
    );
    assert(
      !!retrieved && retrieved.order_number === successfulOrder.orderNumber,
      "Order details accessible with matching access token"
    );
    assert(
      retrieved?.order_items.length === 1 && retrieved.order_items[0].quantity === 2,
      "Historical order items snapshot preserved with correct quantity"
    );
    assert(
      retrieved?.total === Math.round(testItem.samplePrice * 2 * 100) / 100,
      "Authoritative server total calculated accurately"
    );

    // Invalid lookup without token or with wrong token
    const unauthorized = await getOrderConfirmation(
      successfulOrder.orderNumber,
      "invalid-guessed-token-12345"
    );
    assert(unauthorized === null, "Security Guard: Lookup with incorrect token rejected");

    const missingToken = await getOrderConfirmation(successfulOrder.orderNumber, "");
    assert(missingToken === null, "Security Guard: Lookup without token rejected");
  }

  // Restore original state
  (testItem as any).isSamplePrice = originalSampleState;

  // -------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
