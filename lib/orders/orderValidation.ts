/**
 * Order Validation and Business Logic Rules
 * Kalahari Pub & Restaurant — Phase 3
 */

export interface CheckoutCustomerInput {
  customerName: string;
  customerPhone: string;
  orderType: "pickup" | "delivery";
  deliveryAddress?: string;
  deliveryArea?: string;
  deliveryInstructions?: string;
  customerNote?: string;
}

export interface CheckoutItemInput {
  id: string; // Menu item ID
  quantity: number;
}

export interface CheckoutPayload {
  customer: CheckoutCustomerInput;
  items: CheckoutItemInput[];
  idempotencyKey?: string;
}

export interface ValidationSuccess {
  isValid: true;
  normalizedPhone: string;
  cleanCustomer: CheckoutCustomerInput;
  cleanItems: CheckoutItemInput[];
}

export interface ValidationFailure {
  isValid: false;
  fieldErrors: Record<string, string>;
  generalError?: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Normalizes Ghanaian phone numbers into standard local 10-digit format (e.g. 024XXXXXXX)
 * or international format (+233XXXXXXXXX).
 */
export function normalizeGhanaPhone(phone: string): { normalized: string | null; isValid: boolean } {
  if (!phone || typeof phone !== "string") {
    return { normalized: null, isValid: false };
  }

  // Remove spaces, dashes, brackets
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, "").trim();

  // If starts with +233, convert to 0...
  if (cleaned.startsWith("+233")) {
    cleaned = "0" + cleaned.slice(4);
  } else if (cleaned.startsWith("233")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("00233")) {
    cleaned = "0" + cleaned.slice(5);
  }

  // Ghanaian standard mobile numbers are 10 digits starting with 0 followed by 2, 5, or 3
  // Examples: 024 (MTN), 054 (MTN), 020 (Telecel), 050 (Telecel), 027 (AT), 026 (AT), etc.
  const ghanaPhoneRegex = /^0(2[034678]|5[045679]|3[0-9])[0-9]{7}$/;

  if (ghanaPhoneRegex.test(cleaned)) {
    return { normalized: cleaned, isValid: true };
  }

  return { normalized: null, isValid: false };
}

/**
 * Validates checkout inputs on the server before processing database records.
 */
export function validateCheckoutInput(payload: CheckoutPayload): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (!payload || typeof payload !== "object") {
    return {
      isValid: false,
      fieldErrors: { form: "Invalid request payload." },
      generalError: "Invalid request structure.",
    };
  }

  const { customer, items } = payload;

  // 1. Customer Name
  if (!customer?.customerName || customer.customerName.trim().length < 2) {
    fieldErrors.customerName = "Full name is required (minimum 2 characters).";
  } else if (customer.customerName.trim().length > 100) {
    fieldErrors.customerName = "Full name must be under 100 characters.";
  }

  // 2. Customer Phone
  if (!customer?.customerPhone || customer.customerPhone.trim() === "") {
    fieldErrors.customerPhone = "Contact phone number is required.";
  } else {
    const { isValid, normalized } = normalizeGhanaPhone(customer.customerPhone);
    if (!isValid || !normalized) {
      fieldErrors.customerPhone =
        "Please enter a valid 10-digit Ghanaian phone number (e.g., 024 565 6849).";
    }
  }

  // 3. Order Type
  if (customer?.orderType !== "pickup" && customer?.orderType !== "delivery") {
    fieldErrors.orderType = "Order type must be either 'pickup' or 'delivery'.";
  }

  // 4. Delivery Rules (Conditional Validation)
  if (customer?.orderType === "delivery") {
    if (!customer.deliveryAddress || customer.deliveryAddress.trim().length < 5) {
      fieldErrors.deliveryAddress =
        "Delivery address / street landmark is required (min 5 characters).";
    } else if (customer.deliveryAddress.trim().length > 300) {
      fieldErrors.deliveryAddress = "Delivery address must be under 300 characters.";
    }

    if (!customer.deliveryArea || customer.deliveryArea.trim().length < 2) {
      fieldErrors.deliveryArea = "Area or neighborhood is required for delivery.";
    }

    // CRITICAL BUSINESS RULE: Delivery fee & coverage are unconfirmed by restaurant owner
    fieldErrors.orderType =
      "Online delivery ordering is currently pending confirmation of delivery coverage and fees by restaurant management. Please choose Pickup at A-Lang Taxi Rank or call us directly at 024 565 6849 to arrange delivery with our team.";
  }

  // 5. Cart Items Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    fieldErrors.items = "Your cart is empty. Please add items before checking out.";
  } else {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.id || typeof item.id !== "string") {
        fieldErrors[`items[${i}]`] = "Invalid item identifier in cart.";
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
        fieldErrors[`items[${i}].quantity`] =
          "Item quantity must be a positive integer between 1 and 50.";
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      isValid: false,
      fieldErrors,
      generalError: fieldErrors.orderType || Object.values(fieldErrors)[0],
    };
  }

  const { normalized } = normalizeGhanaPhone(customer.customerPhone);

  return {
    isValid: true,
    normalizedPhone: normalized || customer.customerPhone.trim(),
    cleanCustomer: {
      ...customer,
      customerName: customer.customerName.trim(),
      customerPhone: normalized || customer.customerPhone.trim(),
      deliveryAddress: customer.deliveryAddress?.trim(),
      deliveryArea: customer.deliveryArea?.trim(),
      deliveryInstructions: customer.deliveryInstructions?.trim(),
      customerNote: customer.customerNote?.trim(),
    },
    cleanItems: items.map((i) => ({
      id: i.id.trim(),
      quantity: Math.floor(i.quantity),
    })),
  };
}
