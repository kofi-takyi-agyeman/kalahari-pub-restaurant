# KALAHARI PUB & RESTAURANT
## Production Deployment & Operations Guide — Phases 1 to 6
**Brand**: Data_Nova  
**Client**: Kalahari Pub & Restaurant  
**Location**: Kalahari Pub, A-Lang Taxi Rank, Ghana  
**Verified Phone Lines**: 0245656849 | 0207157071 | 0246773225  
**Currency**: Ghanaian Cedi (GHS)  
**Slogan**: Good Food, Good Drinks, Great Vibes  

---

## 1. Executive Summary & Architecture

The Kalahari Pub & Restaurant web platform is a modern, mobile-first restaurant e-commerce and administrative operations management system built with:
- **Framework**: Next.js 15 (App Router with Server Actions)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom Kalahari brand tokens (`#F9D817` golden yellow, `#D92323` restaurant red, `#171714` deep charcoal, `#F7F4EC` warm cream, `#235A36` deep green)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Storage
- **Resilient Hybrid Architecture**: Fully operational in production against Supabase PostgreSQL, with an intelligent local memory fallback store for development and testing environments without active database credentials.

---

## 2. Directory Structure & Key Routes

### Public Customer Routes
- `/` — Homepage featuring restaurant hero, highlights, popular dishes, and taxi rank location.
- `/menu` — Live searchable and filterable menu catalog with sample-price warnings and category navigation.
- `/cart` — Responsive shopping cart with real-time subtotal calculations and safe quantity controls.
- `/checkout` — Customer checkout supporting pickup at A-Lang Taxi Rank and delivery (when enabled).
- `/order-confirmation/[reference]` — Protected confirmation page displaying itemized bill and live status.
- `/about` — Authentic background, values, and culinary tradition of Kalahari Pub.
- `/contact` — Verified telephone numbers, directions, and direct WhatsApp links.

### Administrative Routes (Protected)
- `/admin/login` — Secure owner authentication screen.
- `/admin` — High-level overview dashboard displaying real-time order counts, sales metrics, and recent orders.
- `/admin/orders` — Filterable order queue with tabbed status filtering (`pending`, `confirmed`, `preparing`, `ready`, `completed`, `cancelled`).
- `/admin/orders/[id]` — Detailed order inspector, customer phone actions, status transition controls, cancellation modals, and audit logs.
- `/admin/menu` — Dish management table with one-click commercial price approval and availability toggles.
- `/admin/menu/new` — Create new menu items with image URLs and category assignments.
- `/admin/menu/[id]/edit` — Edit existing dishes, prices, descriptions, and featured flags.
- `/admin/categories` — Menu category manager with ordering and active state controls.
- `/admin/settings` — Operational settings panel for delivery zones, flat fees, opening hours, and pickup preferences.
- `/admin/reports` — Real-time operational reporting on order volume, sales pipeline, and dish popularity.

---

## 3. Database Schema & Migrations

All database structures are version-controlled in `supabase/migrations/`:

### Migration 1: `20261015000000_create_menu_schema.sql`
- **Tables**: `menu_categories`, `menu_items`
- **Features**:
  - UUID primary keys, slug unique constraints, `display_order` indexing.
  - `is_sample_price` flag protecting unconfirmed flyer prices.
  - Public `SELECT` policy enabled for active items.
  - Write/update/delete policies restricted to authenticated administrators.

### Migration 2: `20261015000001_create_orders_schema.sql`
- **Tables**: `orders`, `order_items`
- **Features**:
  - Human-friendly order references (`KAL-YYYYMMDD-XXXX`).
  - Strict Ghanaian phone number validation.
  - `order_token` (UUID) ensuring customer privacy; knowing an order number alone does not reveal private addresses or contact details.
  - RLS policies permitting public inserts, customer reads restricted to matching token, and full access granted to authenticated staff.

### Migration 3: `20261015000002_create_admin_and_settings_schema.sql`
- **Tables**: `order_status_logs`, `restaurant_settings`
- **Features**:
  - `order_status_logs`: Immutable audit trail recording every state change, timestamp, and optional reason.
  - `restaurant_settings`: Key-value JSONB storage for dynamic delivery zones, flat fees, and operating hours.
  - `menu-images` Storage Bucket: Configured with public read access and write access restricted to administrators.

---

## 4. Step-by-Step Production Setup

### Step 1: Provision Supabase Project
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g., `kalahari-pub-restaurant`).
3. Note your project URL and API keys from **Project Settings -> API**.

### Step 2: Apply Database Migrations
Run the SQL migrations in order via the Supabase SQL Editor or Supabase CLI:
```bash
npx supabase db push
```
Alternatively, copy and run the contents of each file in order:
1. `supabase/migrations/20261015000000_create_menu_schema.sql`
2. `supabase/migrations/20261015000001_create_orders_schema.sql`
3. `supabase/migrations/20261015000002_create_admin_and_settings_schema.sql`

### Step 3: Configure Storage
The third migration creates the `menu-images` storage bucket. Ensure the bucket is set to **Public** for image downloads and restricted to authenticated users for uploads.

### Step 4: Provision the Initial Administrator
Run the administrative provisioning script:
```bash
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
ADMIN_EMAIL=owner@kalaharipub.com \
ADMIN_PASSWORD=SecurePassword123! \
npx tsx scripts/provisionAdmin.ts
```
This assigns `app_metadata: { role: 'admin' }` to the account, granting full access to `/admin` routes.

---

## 5. Core Business Safeguards & Workflows

### The Sample Price Commercial Safeguard
- Flyer prices are marked with `is_sample_price = true`.
- **Server-Side Enforcement**: The order submission action (`app/actions/submitOrder.ts`) strictly rejects any order containing a sample-priced item. Customers are shown a friendly banner directing them to call the pub (`0245656849`) for current daily market prices.
- **Approval Workflow**: The restaurant owner navigates to `/admin/menu` and clicks **Approve Price**. This sets `is_sample_price = false` and immediately unlocks commercial checkout for that dish.

### Delivery Configuration & Safeguard
- By default, delivery is **disabled** until the owner ratifies coverage and fees.
- Any customer attempt to submit a delivery order while disabled is rejected server-side with advice to select pickup at A-Lang Taxi Rank.
- Once the owner configures delivery zones (e.g., Sowutuom, Lapaz, Odorkor, Kwashieman) and fees in `/admin/settings`, delivery checkout becomes active and automatically applies the authoritative fee.

### Order State Machine & Audit Trail
Valid transitions are strictly enforced:
- `pending` -> `confirmed` or `cancelled`
- `confirmed` -> `preparing` or `cancelled`
- `preparing` -> `ready` or `cancelled`
- `ready` -> `completed` or `cancelled`
- `completed` -> Terminal state
- `cancelled` -> Terminal state (requires optional reason)

Every transition is recorded in `order_status_logs` with a timestamp and user attribution.

---

## 6. Payment Architecture & Readiness

- **Current Active State**: Cash on Pickup / Pay at Restaurant Counter.
- **Payment State Separation**: `payment_status` (`unpaid`, `pending`, `paid`, `failed`, `refunded`) is decoupled from operational `status` (`pending`, `confirmed`, etc.). Orders are never marked as paid without verified payment confirmation.
- **Future Online Payment Activation**:
  - The codebase includes hooks for Paystack and Hubtel integration.
  - When approved by the owner, set `PAYMENT_PROVIDER=paystack` and supply `PAYSTACK_SECRET_KEY` and `PAYSTACK_WEBHOOK_SECRET`.

---

## 7. Automated Test Suite & Quality Verification

Run all test suites locally:
```bash
# 1. Phase 3 Cart & Checkout Validation (32 tests)
npx tsx tests/phase3-validation.test.ts

# 2. Phases 4-6 Admin, State Machine, Delivery & Safeguards (24 tests)
npx tsx tests/phase4-phase6.test.ts

# 3. TypeScript Typecheck
npx tsc --noEmit

# 4. ESLint
npm run lint

# 5. Production Next.js Build
npm run build
```

---

## 8. Deployment Platforms

### Vercel (Recommended)
1. Push repository to GitHub.
2. Import project into Vercel.
3. Add environment variables from `.env.example`.
4. Deploy with build command `npm run build`.

### Rollback Strategy
If any production anomaly occurs:
1. Revert to previous deployment via Vercel Dashboard -> Deployments -> Instant Rollback.
2. In Supabase, order data remains intact as migrations only add additive non-destructive tables and columns.
