# KALAHARI PUB & RESTAURANT — PHASE 3 IMPLEMENTATION GUIDE
## Shopping Cart, Checkout Workflow, Server Validation & Secure Order Submission

**Author / Developer Attribution:** Data_Nova  
**Project:** Kalahari Pub & Restaurant  
**Location:** Kalahari Pub, A-Lang Taxi Rank, Ghana  
**Verified Contact Lines:** 0245656849 / 0207157071 / 0246773225  
**Version:** 3.0.0  
**Date:** October 2026  

---

## 1. Executive Summary

Phase 3 transitions the Kalahari Pub & Restaurant online experience from menu exploration into a functional e-commerce workflow. Customers can select dishes, adjust quantities, review order subtotals on both a quick drawer and a dedicated `/cart` page, enter verified customer information on `/checkout`, and submit orders that are verified on the server and committed atomically to PostgreSQL / Supabase.

This phase strictly enforces key real-world business constraints:
1. **Sample Price Guard**: Dishes currently carrying demonstration prices (`is_sample_price: true`) cannot be converted into final commercial orders. The server blocks final submission and prompts the customer with direct calling links.
2. **Delivery Policy Guard**: Because the restaurant owner has not yet ratified delivery zones or delivery fee tiers, automated delivery checkout is held pending management confirmation, steering customers toward self-pickup at A-Lang Taxi Rank or phone orders.
3. **Receipt Privacy Guard**: Customer orders and receipts are inaccessible via public sequential IDs; access strictly requires a cryptographically unguessable token (`access_token`).

---

## 2. Cart Architecture

### Shared Cart State (`lib/cartContext.tsx`)
- **State Provider**: React Context (`CartContext`) wraps the entire application in `app/layout.tsx`.
- **Browser Persistence**: Serialized into `localStorage` under key `kalahari_cart_v1`, allowing persistence across page navigations and browser refreshes.
- **Untrusted Client Assumption**: The browser localStorage holds only identifiers and selected quantities. The server action treats all quantities, prices, discounts, and totals provided by the client as untrusted.
- **Key Functions**:
  - `addToCart(item, quantity)`: Inserts or updates quantity.
  - `removeFromCart(id)`: Removes individual line items.
  - `updateQuantity(id, quantity)`: Bounded integer update (1 to 50).
  - `clearCart()`: Empties the cart.
  - `totalItems`: Accurately displays the sum of quantities in the Header indicator.
  - `subtotal`: Client-side visual estimation in GHS.

### User Interfaces:
1. **Persistent Cart Drawer (`components/cart/CartDrawer.tsx`)**:
   - Quick-access drawer triggered from the navigation bar.
   - Allows instant quantity adjustment, item removal, and subtotal calculation.
   - Provides direct links to `/cart` and `/checkout`.
2. **Dedicated Cart Review Page (`app/cart/page.tsx`)**:
   - Route: `/cart`
   - Shows detailed item cards, thumbnails, unit prices, sample price tags, line subtotals, clear-cart confirmation modal, and "Proceed to Checkout" CTA.

---

## 3. Checkout Workflow (`app/checkout/page.tsx`)

The checkout page is built mobile-first, ensuring smooth interaction on Ghanaian mobile devices.

### Collected Customer Fields:
- **Customer's Full Name**: Required (2 to 100 characters).
- **Ghanaian Phone Number**: Required. Normalized and validated to Ghanaian telecommunications format.
- **Fulfillment Method**:
  - `pickup`: Ready for collection at Kalahari Pub, A-Lang Taxi Rank. Zero delivery fee.
  - `delivery`: Displays conditional address fields (Street Address/Landmark, Area/Neighborhood, and optional directions). Online delivery orders are held pending owner delivery fee confirmation.
- **Special Cooking / Packaging Instructions**: Optional customer note (e.g., extra shito, separate pepper, temperature requests).

### Double-Submission & Abuse Safeguards:
- Client generates an initial `crypto.randomUUID()` idempotency key on mount.
- Submit button is disabled and displays a spinning loader during network transit.
- Repeated submissions using the same idempotency key return the existing order without generating duplicate records.

---

## 4. Database Architecture & Schema

### Migration File: `supabase/migrations/20261015000001_create_orders_schema.sql`

#### A. Table `orders`
Stores order header metadata, financial totals, customer contact details, and state machine lifecycle:
```sql
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) NOT NULL UNIQUE,
    access_token VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(64) UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(25) NOT NULL,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('pickup', 'delivery')),
    delivery_address TEXT,
    delivery_area VARCHAR(100),
    delivery_instructions TEXT,
    customer_note TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
    currency VARCHAR(3) NOT NULL DEFAULT 'GHS',
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

#### B. Table `order_items`
Preserves historical purchase snapshots of dish names and agreed-upon prices at order acceptance:
```sql
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(150) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 100),
    line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

#### C. Indexes:
- `idx_orders_order_number`: Fast receipt lookup by human-readable reference.
- `idx_orders_access_token`: Rapid token security verification.
- `idx_orders_status`: High-efficiency filtering for staff and kitchen display systems.
- `idx_orders_created_at`: Chronological ordering for kitchen queue.
- `idx_order_items_order_id`: Fast joining of line items to order headers.

---

## 5. Row Level Security (RLS) & Security Policies

1. **Deny Arbitrary Public Browsing**: Neither anonymous visitors nor authenticated customers can run `SELECT * FROM orders` or inspect another customer's contact information.
2. **Token-Guarded Customer Policy**: Customers can query their own submitted order only if they possess the unguessable `access_token` returned at checkout creation:
   ```sql
   CREATE POLICY "Public can view own order by access_token"
       ON public.orders
       FOR SELECT
       TO anon, authenticated
       USING (
           access_token IS NOT NULL
           AND access_token = current_setting('request.headers', true)::json->>'x-order-token'
       );
   ```
3. **Staff Admin Full Access**: Staff with JWT claim `(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'` have full management privileges across all orders and order items.
4. **Isomorphic Development Fallback**: When Supabase cloud environment variables are unconfigured in development, `lib/orders/devOrderStore.ts` provides safe, isolated in-memory storage matching the exact PostgreSQL schema and access controls.

---

## 6. Server Validation Engine (`lib/orders/orderValidation.ts`)

The server action revalidates all incoming payloads before executing database writes:
1. **Phone Number Normalization (`normalizeGhanaPhone`)**:
   - Cleans all whitespace, dashes, and country prefixes (`+233`, `233`, `00233`).
   - Validates Ghanaian telecom prefixes (`024`, `054`, `055`, `059` for MTN; `020`, `050` for Telecel; `026`, `027`, `056`, `057` for AT).
   - Normalizes to canonical 10-digit format (`02XXXXXXXX`).
2. **Customer Information Validation**:
   - Customer name length: 2 to 100 characters.
   - Order type validation: strictly `'pickup' | 'delivery'`.
   - Conditional delivery validation: requires address (5–300 chars) and neighborhood area.
3. **Delivery Policy Rejection**:
   - Returns a friendly message indicating that online delivery fees are awaiting management confirmation, prompting the customer to select pickup or call directly.
4. **Item Quantity Bounds**:
   - Rejects empty carts, null IDs, negative numbers, fractional values, and quantities exceeding 50 items.

---

## 7. Server-Side Order Submission (`app/actions/submitOrder.ts`)

The `submitOrder` Next.js Server Action executes the following lifecycle:
1. **Schema & Input Validation**: Invokes `validateCheckoutInput`.
2. **Idempotency Check**: Looks up `idempotency_key` in the database / dev store. If found, returns the previously created order number and access token without re-running order insertion.
3. **Authoritative Price & Availability Verification**:
   - Queries `menu_items` table in Supabase (or trusted fallback) using the requested IDs.
   - Verifies `is_available = true`.
   - **Enforces Sample Price Policy**: If `is_sample_price = true`, aborts submission with `isSamplePriceBlocked: true` and verified restaurant numbers.
   - Calculates financial arithmetic: `line_total = unit_price * quantity`, `subtotal = sum(line_totals)`, and `total = subtotal + delivery_fee`.
4. **Generates Cryptographic Credentials**:
   - `order_number`: Formatted as `KP-YYYYMMDD-XXXX` (e.g. `KP-20261015-E4B2`).
   - `access_token`: 48-character hexadecimal entropy string (`crypto.randomBytes(24)`).
5. **Atomic Database Insertion**:
   - Inserts order header row into `orders`.
   - Inserts snapshots of all line items into `order_items`.
   - If line item insertion fails, rolls back the header record to prevent orphan headers.

---

## 8. Order Lifecycle & Status State Machine

The order lifecycle follows documented restaurant operational stages:

```
[ pending ] ──► Customer submitted order; awaiting restaurant phone call/review
     │
     ▼
[ confirmed ] ──► Staff called customer, confirmed items, and accepted order
     │
     ▼
[ preparing ] ──► Kitchen has started cooking (grill, banku, rice, etc.)
     │
     ▼
[   ready   ] ──► Packaged and ready for pickup at A-Lang Taxi Rank (or dispatch)
     │
     ▼
[ completed ] ──► Customer collected order and paid
     │
     ▼
[ cancelled ] ──► Cancelled by authorized staff (e.g. customer request, out of stock)
```

Orders initially enter the `pending` state. **A pending order is not a paid order.**

---

## 9. Order Confirmation Route (`/order-confirmation/[orderNumber]`)

- **Route**: `app/order-confirmation/[orderNumber]/page.tsx`
- **Security Check**: Requires query parameter `?token=<access_token>`. Without a matching token, the page renders a security authorization advisory and blocks receipt viewing.
- **Client Cart Clearing**: `OrderConfirmationClient.tsx` clears the customer's browser cart once the confirmed receipt has loaded.
- **Kitchen Follow-Up Triggers**:
  - Pre-formatted WhatsApp button with order number, customer name, items summary, and total.
  - Direct telephone links (`tel:0245656849`, `tel:0207157071`, `tel:0246773225`).

---

## 10. Automated Testing & Verification Results

An automated test suite was executed via `tests/phase3-validation.test.ts`:

```
=======================================================
   KALAHARI PUB & RESTAURANT — PHASE 3 AUTOMATED TESTS 
=======================================================

Suite 1: Ghanaian Phone Validation & Normalization
  ✓ PASS: Standard 10-digit MTN (024) format accepts and normalizes
  ✓ PASS: MTN with spaces (024 565 6849) stripped and normalized
  ✓ PASS: International format (+233 24...) converted to standard local 024...
  ✓ PASS: Intl format without plus (233...) converted to 024...
  ✓ PASS: Standard 10-digit Telecel (020) accepts and normalizes
  ✓ PASS: Standard 10-digit AT (027) accepts and normalizes
  ✓ PASS: Short phone number (<10 digits) correctly rejected
  ✓ PASS: Invalid network prefix (012) correctly rejected
  ✓ PASS: Alphanumeric phone correctly rejected

Suite 2: Customer Input & Conditional Fulfillment Validation
  ✓ PASS: Valid pickup order passes validation
  ✓ PASS: Blank customer name correctly rejected
  ✓ PASS: Customer name >100 characters correctly rejected
  ✓ PASS: Delivery order without street address correctly rejected
  ✓ PASS: Delivery orders held pending policy confirmation (preventing unapproved delivery charges)

Suite 3: Cart Items & Quantity Bounds
  ✓ PASS: Empty cart correctly rejected
  ✓ PASS: Zero quantity rejected
  ✓ PASS: Negative quantity rejected
  ✓ PASS: Excessively large quantity (>50) rejected
  ✓ PASS: Fractional quantity rejected

Suite 4: Server Price Integrity & Sample Price Rule Enforcement
  ✓ PASS: Found sample-priced item in menu: Banku and Tilapia with Okro Stew
  ✓ PASS: CRITICAL: Order containing sample-priced item was blocked from final order creation
  ✓ PASS: Helpful explanatory notice and phone contact returned to customer
  ✓ PASS: Non-existent menu item rejected by server action

Suite 5: Order Submission, Idempotency, and Token Receipt Guard
  ✓ PASS: Order with owner-confirmed price successfully created
  ✓ PASS: Order received structured reference (KP-YYYYMMDD-XXXX)
  ✓ PASS: Order received cryptographically secure access token
  ✓ PASS: Idempotency Guard: Repeated request returned existing order without creating duplicate
  ✓ PASS: Order details accessible with matching access token
  ✓ PASS: Historical order items snapshot preserved with correct quantity
  ✓ PASS: Authoritative server total calculated accurately
  ✓ PASS: Security Guard: Lookup with incorrect token rejected
  ✓ PASS: Security Guard: Lookup without token rejected

=======================================================
TEST SUMMARY: 32 PASSED, 0 FAILED
=======================================================
```

### Static & Build Verification:
- **TypeScript (`npx tsc --noEmit`)**: 0 errors.
- **ESLint (`npm run lint`)**: 0 warnings, 0 errors.
- **Production Build (`npm run build`)**: 13/13 pages compiled successfully.

---

## 11. Environment Variables Configuration

To connect Supabase in production or staging, configure `.env.local`:

```env
# Public Supabase Client Keys (Safe for Browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-Side Only Service Role Key (NEVER expose to browser bundles)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 12. Remaining Owner Decisions for Phase 4

Before online ordering can transition to full commercial automation:
1. **Menu Price Approval**: Restaurant management must review and approve actual commercial menu prices, updating `is_sample_price = false` in Supabase.
2. **Delivery Radius & Fee Schedule**: Owner must specify delivery zones (e.g. A-Lang, Sowutuom, Kwashieman, Santa Maria) and corresponding fixed or per-kilometer delivery fees.
3. **Staff Roles & Admin Credentials**: Owner must establish staff email accounts for access to the Phase 4 Admin Dashboard.
