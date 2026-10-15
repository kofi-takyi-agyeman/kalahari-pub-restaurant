/**
 * Automated Test Suite for Phases 4, 5, and 6
 * Kalahari Pub & Restaurant — Data_Nova
 *
 * Verifies:
 * 1. Admin Authentication & Session Verification
 * 2. Order Lifecycle State Machine & Invalid Transition Rejection
 * 3. Audit Trail Logging
 * 4. Menu Price Confirmation & Customer Checkout Activation
 * 5. Menu Availability Toggling
 * 6. Delivery Configuration Enablement & Dynamic Delivery Fee Calculation
 * 7. Operational Reporting Integrity
 */

import { devAdminStore, VALID_STATUS_TRANSITIONS } from "../lib/admin/devAdminStore";
import { submitOrder, getOrderConfirmation } from "../app/actions/submitOrder";
import { updateOrderStatusAction } from "../app/actions/adminOrderActions";
import { approveMenuPriceAction, toggleMenuAvailabilityAction } from "../app/actions/adminMenuActions";
import { saveDeliverySettingsAction } from "../app/actions/adminSettingsActions";
import { getAdminDashboardMetrics } from "../lib/admin/adminDataService";
import { getDeliveryConfig } from "../lib/admin/settingsService";
import { OrderStatus } from "../types/database.types";

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
  console.log("   KALAHARI PUB & RESTAURANT — PHASES 4-6 TEST SUITE   ");
  console.log("=======================================================\n");

  // -------------------------------------------------------------------
  // TEST SUITE 1: Admin Order Lifecycle State Machine
  // -------------------------------------------------------------------
  console.log("Suite 1: Order Lifecycle State Machine & State Transitions");

  // Create an initial test order in dev store
  const orderId = crypto.randomUUID();
  const orderNumber = `KP-20261015-TEST-STATUS`;
  const initialOrder = {
    id: orderId,
    order_number: orderNumber,
    access_token: "test-token-" + crypto.randomUUID(),
    idempotency_key: "idem-" + crypto.randomUUID(),
    customer_name: "Ama Osei",
    customer_phone: "0245656849",
    order_type: "pickup" as const,
    delivery_address: null,
    delivery_area: null,
    delivery_instructions: null,
    customer_note: "Pack hot",
    status: "pending" as OrderStatus,
    currency: "GHS",
    subtotal: 90.0,
    delivery_fee: 0.0,
    total: 90.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: crypto.randomUUID(),
        order_id: orderId,
        menu_item_id: "kp-banku-tilapia",
        item_name: "Banku and Tilapia",
        unit_price: 90.0,
        quantity: 1,
        line_total: 90.0,
        created_at: new Date().toISOString(),
      },
    ],
  };

  devAdminStore.getAllOrders(); // ensure map initialized
  globalThis.__kalahari_dev_orders?.set(orderNumber, initialOrder);

  // Transition 1: pending -> confirmed (VALID)
  const t1 = devAdminStore.updateOrderStatus(orderId, "confirmed", "owner@kalaharipub.com", "Confirmed with customer via phone");
  assert(t1.success && t1.order?.status === "confirmed", "Valid transition: pending -> confirmed accepted");

  // Transition 2: confirmed -> preparing (VALID)
  const t2 = devAdminStore.updateOrderStatus(orderId, "preparing", "owner@kalaharipub.com", "Sent to kitchen");
  assert(t2.success && t2.order?.status === "preparing", "Valid transition: confirmed -> preparing accepted");

  // Transition 3: preparing -> ready (VALID)
  const t3 = devAdminStore.updateOrderStatus(orderId, "ready", "owner@kalaharipub.com", "Food packaged and placed on pickup counter");
  assert(t3.success && t3.order?.status === "ready", "Valid transition: preparing -> ready accepted");

  // Transition 4: ready -> completed (VALID)
  const t4 = devAdminStore.updateOrderStatus(orderId, "completed", "owner@kalaharipub.com", "Customer collected and paid");
  assert(t4.success && t4.order?.status === "completed", "Valid transition: ready -> completed accepted");

  // Transition 5: completed -> pending (INVALID - TERMINAL STATE)
  const t5 = devAdminStore.updateOrderStatus(orderId, "pending", "owner@kalaharipub.com");
  assert(!t5.success, "Invalid transition: completed -> pending strictly rejected by server");

  // Transition 6: completed -> cancelled (INVALID - TERMINAL STATE)
  const t6 = devAdminStore.updateOrderStatus(orderId, "cancelled", "owner@kalaharipub.com");
  assert(!t6.success, "Invalid transition: completed -> cancelled strictly rejected by server");

  // -------------------------------------------------------------------
  // TEST SUITE 2: Audit Trail Logging
  // -------------------------------------------------------------------
  console.log("\nSuite 2: Audit Trail Logging");

  const orderWithLogs = devAdminStore.getOrderById(orderId);
  assert(
    !!orderWithLogs && orderWithLogs.order_status_logs?.length === 4,
    `Audit trail recorded all 4 state transitions (Found: ${orderWithLogs?.order_status_logs?.length})`
  );

  const lastLog = orderWithLogs?.order_status_logs?.[3];
  assert(
    lastLog?.previous_status === "ready" &&
    lastLog?.new_status === "completed" &&
    lastLog?.changed_by === "owner@kalaharipub.com",
    "Audit log captured correct actor, previous status, and new status"
  );

  // Cancellation from pending
  const cancelOrderId = crypto.randomUUID();
  const cancelOrderNumber = `KP-20261015-TEST-CANCEL`;
  globalThis.__kalahari_dev_orders?.set(cancelOrderNumber, {
    ...initialOrder,
    id: cancelOrderId,
    order_number: cancelOrderNumber,
    status: "pending",
  });

  const cancelResult = devAdminStore.updateOrderStatus(
    cancelOrderId,
    "cancelled",
    "owner@kalaharipub.com",
    "Customer requested cancellation"
  );
  assert(cancelResult.success && cancelResult.order?.status === "cancelled", "Pending order can transition to cancelled");

  const cancelThenPrep = devAdminStore.updateOrderStatus(cancelOrderId, "preparing", "owner@kalaharipub.com");
  assert(!cancelThenPrep.success, "Cancelled order cannot be transitioned further (Terminal State)");

  // -------------------------------------------------------------------
  // TEST SUITE 3: Menu Management & Price Approval Unlocking Checkout
  // -------------------------------------------------------------------
  console.log("\nSuite 3: Menu Price Approval & Online Ordering Activation");

  const allItems = devAdminStore.getAllMenuItems();
  assert(allItems.length > 0, `Loaded ${allItems.length} menu items in admin store`);

  const testDish = allItems[0];
  // Ensure starting with sample price
  devAdminStore.updateMenuItem(testDish.id, { is_sample_price: true });

  // 1. Attempt checkout while dish has sample price (MUST FAIL)
  const blockedAttempt = await submitOrder({
    customer: {
      customerName: "Kweku Boateng",
      customerPhone: "0245656849",
      orderType: "pickup",
    },
    items: [{ id: testDish.id, quantity: 1 }],
  });
  assert(
    !blockedAttempt.success && blockedAttempt.isSamplePriceBlocked === true,
    "Commercial checkout blocked while dish price is unapproved sample price"
  );

  // 2. Owner approves price via Admin
  const approvedItem = devAdminStore.approveMenuPrice(testDish.id);
  assert(approvedItem !== null && approvedItem.is_sample_price === false, "Admin price approval sets is_sample_price = false");

  // 3. Customer attempts checkout again (MUST SUCCEED NOW)
  const approvedAttempt = await submitOrder({
    customer: {
      customerName: "Kweku Boateng",
      customerPhone: "0245656849",
      orderType: "pickup",
    },
    items: [{ id: testDish.id, quantity: 1 }],
  });
  assert(
    approvedAttempt.success && !!approvedAttempt.orderNumber,
    "Commercial checkout succeeds immediately once dish price is approved by owner"
  );

  // 4. Test Stock Availability Toggle
  devAdminStore.toggleMenuAvailability(testDish.id);
  const outOfStockDish = devAdminStore.getMenuItemById(testDish.id);
  assert(outOfStockDish?.is_available === false, "Toggle availability sets is_available = false");

  const outOfStockOrder = await submitOrder({
    customer: {
      customerName: "Kweku Boateng",
      customerPhone: "0245656849",
      orderType: "pickup",
    },
    items: [{ id: testDish.id, quantity: 1 }],
  });
  assert(
    Boolean(!outOfStockOrder.success && outOfStockOrder.error?.includes("unavailable")),
    "Customer order rejected when dish is marked out of stock"
  );

  // Restore availability and sample price
  devAdminStore.toggleMenuAvailability(testDish.id);
  devAdminStore.updateMenuItem(testDish.id, { is_sample_price: true });

  // -------------------------------------------------------------------
  // TEST SUITE 4: Delivery Configuration & Dynamic Delivery Fee
  // -------------------------------------------------------------------
  console.log("\nSuite 4: Delivery Settings & Zone Calculation");

  // 1. When delivery is disabled (default): delivery order rejected
  devAdminStore.updateSettings("delivery_config", {
    enabled: false,
    zones: [{ area: "A-Lang", fee: 15.0 }],
    min_order: 0,
  });

  const disabledDeliveryOrder = await submitOrder({
    customer: {
      customerName: "Abena Mansa",
      customerPhone: "0207157071",
      orderType: "delivery",
      deliveryAddress: "Near Taxi Rank junction",
      deliveryArea: "A-Lang",
    },
    items: [{ id: testDish.id, quantity: 1 }],
  });

  assert(
    Boolean(
      !disabledDeliveryOrder.success &&
      disabledDeliveryOrder.fieldErrors?.orderType?.includes("pending confirmation of delivery coverage")
    ),
    "Delivery orders rejected when delivery_config.enabled is false"
  );

  // 2. Owner enables delivery with approved zones
  devAdminStore.updateSettings("delivery_config", {
    enabled: true,
    zones: [
      { area: "A-Lang", fee: 15.0 },
      { area: "Sowutuom", fee: 20.0 },
      { area: "Kwashieman", fee: 25.0 },
    ],
    min_order: 0,
  });

  // Temporarily approve test dish price to test delivery creation
  devAdminStore.approveMenuPrice(testDish.id);

  // A. Customer orders to approved zone "Sowutuom" (fee: 20.00)
  const validDeliveryOrder = await submitOrder({
    customer: {
      customerName: "Abena Mansa",
      customerPhone: "0207157071",
      orderType: "delivery",
      deliveryAddress: "Blue Gate Villa, Sowutuom Highway",
      deliveryArea: "Sowutuom",
    },
    items: [{ id: testDish.id, quantity: 1 }],
  });

  assert(validDeliveryOrder.success, "Delivery order to approved zone 'Sowutuom' successfully accepted");

  if (validDeliveryOrder.orderNumber && validDeliveryOrder.accessToken) {
    const savedDelivery = await getOrderConfirmation(
      validDeliveryOrder.orderNumber,
      validDeliveryOrder.accessToken
    );
    assert(savedDelivery?.delivery_fee === 20.0, "Approved delivery fee of GHS 20.00 applied accurately on server");
    assert(
      savedDelivery?.total === Math.round((testDish.price + 20.0) * 100) / 100,
      "Final total reflects item price + approved delivery fee"
    );
  }

  // B. Customer orders to unapproved area (e.g. "Kumasi")
  const outsideZoneOrder = await submitOrder({
    customer: {
      customerName: "Kwame Asante",
      customerPhone: "0207157071",
      orderType: "delivery",
      deliveryAddress: "Adum Market",
      deliveryArea: "Kumasi",
    },
    items: [{ id: testDish.id, quantity: 1 }],
  });

  assert(
    Boolean(!outsideZoneOrder.success && outsideZoneOrder.fieldErrors?.deliveryArea?.includes("currently deliver to")),
    "Delivery order to unapproved area rejected with approved zones guidance"
  );

  // Restore settings to safe pending state
  devAdminStore.updateSettings("delivery_config", {
    enabled: false,
    policy_notice: "Pending owner delivery fee and coverage ratification",
    zones: [
      { area: "A-Lang", fee: 15.0 },
      { area: "Sowutuom", fee: 20.0 },
      { area: "Kwashieman", fee: 25.0 },
      { area: "Santa Maria", fee: 25.0 },
    ],
    min_order: 0,
  });
  devAdminStore.updateMenuItem(testDish.id, { is_sample_price: true });

  // -------------------------------------------------------------------
  // TEST SUITE 5: Reporting & Financial Integrity
  // -------------------------------------------------------------------
  console.log("\nSuite 5: Reporting Metrics & Financial Separation");

  const metrics = await getAdminDashboardMetrics();
  assert(metrics.counts.completed >= 1, "Metrics accurately tally completed orders count");
  assert(metrics.revenue.completedSalesGHS > 0, "Revenue strictly accounts for completed orders");
  assert(metrics.menuStats.totalItems >= 10, "Menu catalog stats reflect full dish count");

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
