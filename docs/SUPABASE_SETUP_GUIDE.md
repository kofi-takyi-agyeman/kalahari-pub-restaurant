# Kalahari Pub & Restaurant — Supabase Database Setup & Operations Guide

**Platform:** Kalahari Pub & Restaurant Web Platform  
**Developer Brand:** Data_Nova  
**Architecture Phase:** Phase 2 — Database Infrastructure, Menu Schema & Security  

---

## 1. Overview & Architecture

Phase 2 establishes the database foundation for Kalahari Pub & Restaurant using **Supabase PostgreSQL**. The solution replaces static menu representations with database-backed tables (`menu_categories` and `menu_items`), backed by:

1. **Relational Schema**: Normalized tables with UUID primary keys and foreign key constraints.
2. **Numeric Precision**: Monetary values stored as `NUMERIC(10, 2)` to eliminate floating-point rounding errors.
3. **Database Security (RLS)**: Row Level Security enabled on all tables. Public access is strictly read-only for active categories and available items. All write operations require authenticated administrative privileges.
4. **Idempotent Seeding**: SQL migrations and seed scripts that can be safely run multiple times without duplicating data or corrupting existing records.
5. **Architectural Separation**: Strict boundary between browser-safe client code and privileged server code.

---

## 2. Required Software & Dependencies

The project uses the following packages installed in `package.json`:

- `@supabase/supabase-js` (^2.48.0+): Official Supabase JavaScript/TypeScript client.
- `@supabase/ssr` (^0.5.2+): Official Next.js App Router client with cookie and session synchronization.
- `tsx` (devDependency): TypeScript execution engine for running administrative seed scripts.

---

## 3. Required Environment Variables

Create a local environment file `.env.local` in the project root by copying `.env.example`:

```bash
cp .env.example .env.local
```

Populate the following variables with credentials from your Supabase Dashboard:

| Variable Name | Environment | Description | Where to Find |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser & Server | The public HTTPS endpoint of your Supabase project (e.g. `https://xyz.supabase.co`). | **Dashboard** &rarr; Project Settings &rarr; API &rarr; Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser & Server | The public Anonymous API key. Subject to Row Level Security (RLS). | **Dashboard** &rarr; Project Settings &rarr; API &rarr; Project API keys (`anon` / `public`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Privileged secret key. **NEVER expose in browser code or commit to Git.** Bypasses RLS for administrative migrations and seeding. | **Dashboard** &rarr; Project Settings &rarr; API &rarr; Project API keys (`service_role` / `secret`) |

> [!CAUTION]
> **Security Protocol**: Never commit `.env.local` or any file containing live API keys to Git. The `.gitignore` file already excludes `.env*.local`.

---

## 4. Connecting Your Supabase Project & Applying the Migration

### Step 4.1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and specify:
   - **Name**: `kalahari-pub-restaurant`
   - **Region**: West Africa or Europe (choose lowest latency to Ghana/West Africa)
   - **Database Password**: Generate and securely store a strong password.

### Step 4.2: Apply the SQL Migration
You can apply the migration via the Supabase Dashboard SQL Editor or via the Supabase CLI:

#### Option A: Via Supabase Dashboard (Recommended for quick setup)
1. Open your Supabase Dashboard &rarr; **SQL Editor**.
2. Click **New Query**.
3. Copy and paste the entire contents of `supabase/migrations/20261015000000_create_menu_schema.sql`.
4. Click **Run**.
5. Verify in **Table Editor** that `menu_categories` and `menu_items` tables have been created with Row Level Security enabled.

#### Option B: Via Supabase CLI
```bash
npx supabase db push
```

---

## 5. Running the Demonstration Menu Seed

The seed populates the 4 core categories and the 12 initial flyer dishes (including Banku & Grilled Tilapia, Fufu with Goat Meat, Omo Tuo, Jollof Rice, and chilled pub drinks).

### Option A: Via SQL Editor (Dashboard)
1. Open Supabase Dashboard &rarr; **SQL Editor**.
2. Copy and paste the contents of `supabase/seed.sql`.
3. Click **Run**.

### Option B: Via Seeder Command (Terminal)
With `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` configured in `.env.local`:
```bash
npm run db:seed
```
Output:
```text
🌱 Starting Kalahari Pub & Restaurant Menu Seed...
📦 Upserting 4 categories...
✅ Categories successfully synced.
🥘 Upserting 12 menu items...
✅ Successfully seeded all 12 demonstration dishes and beverages!
ℹ️ All dishes are flagged with is_sample_price: true.
```

The seed uses `ON CONFLICT (slug) DO UPDATE`, guaranteeing that re-running the seed will update records in-place without duplicating rows.

---

## 6. How Row Level Security (RLS) Protects the Menu

Row Level Security is active on both menu tables:

```sql
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
```

### Public Access Rules
1. **Active Categories Only**: Unauthenticated (anon) public users can only view categories where `is_active = true`.
2. **Available Items Only**: Public users can only query items where `is_available = true` AND where the category itself is active.
3. **No Public Writes**: Anonymous users have zero `INSERT`, `UPDATE`, or `DELETE` permissions.

### Administrative Access Rules (Phase 3 Preparation)
- Mutations require an authenticated user with `app_metadata.role = 'admin'` or the server-side `SUPABASE_SERVICE_ROLE_KEY`.
- Regular authenticated customers cannot edit menu items or modify prices.

---

## 7. Storage Bucket Setup (Menu Images)

When image upload capabilities are deployed in the Phase 3 Admin Dashboard, configure a storage bucket in Supabase:

1. In Supabase Dashboard &rarr; **Storage** &rarr; **Create a new bucket**:
   - **Name**: `menu-images`
   - **Public bucket**: `true` (enables public read for active dish photos).
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`.
   - **File size limit**: `5MB`.
2. Storage Access Policies:
   - **SELECT (Read)**: Accessible to public (`true`).
   - **INSERT / UPDATE / DELETE (Write)**: Restricted to authenticated users with `app_metadata.role = 'admin'`.

---

## 8. Replacing Demonstration Prices with Owner-Confirmed Prices

All seed dishes are created with:
```sql
is_sample_price = true
```

The UI displays the prominent banner:
`SAMPLE PRICE — CONFIRM WITH RESTAURANT`

### Procedure for Updating to Owner-Approved Pricing:
When the restaurant owner submits official price lists:
1. Update the price and toggle `is_sample_price = false` in the database:
   ```sql
   UPDATE public.menu_items
   SET price = 85.00,
       is_sample_price = false
   WHERE slug = 'banku-tilapia-okro-stew';
   ```
2. Once `is_sample_price` is set to `false`, the customer-facing sample notice is automatically removed for that dish.
3. In Phase 3, this operation will be performed directly through the authenticated Admin Portal UI.

---

## 9. Data Integrity & Future Ordering Rules (Phase 3 Preparation)

When implementing the cart checkout and order submission in Phase 3, the following rules **must be enforced**:

1. **Server-Side Price Validation**:
   - The server must re-fetch current prices from `menu_items` using the item UUID.
   - Client-provided prices must **NEVER** be trusted.
2. **Safe Monetary Arithmetic**:
   - Perform all order total additions and tax calculations using exact numeric amounts or minor units (e.g. Ghana pesewas) to prevent floating-point inaccuracies.
3. **Availability Checks**:
   - Validate that every requested item has `is_available = true` and `category.is_active = true` at the moment of checkout. Reject orders containing deactivated items.
4. **Historical Price Snapshotting**:
   - Order line items in `order_items` must store the agreed unit price at time of order creation (`unit_price NUMERIC(10,2)`), ensuring future menu price updates do not retroactively alter historic customer receipts.
5. **Sample Price Guard**:
   - Warn or restrict automated checkout if an item in the cart is still marked with `is_sample_price = true`.

---

## 10. Local Execution & Verification

### Start Local Development Server:
```bash
npm run dev
```
Navigate to:
- Homepage: `http://localhost:3000/`
- Live Menu: `http://localhost:3000/menu`
- Contact: `http://localhost:3000/contact`
- Cart: `http://localhost:3000/cart`
- Admin Blueprint: `http://localhost:3000/admin`

### Verifying Database Connection:
- When Supabase credentials are configured in `.env.local`, `/menu` will display the green **"Live Database Connected: Serving active menu items directly from Supabase PostgreSQL"** banner.
- When unconfigured, `/menu` will display the blue **"Phase 2 Architecture: Supabase Schema Prepared (Viewing Local Seed Data)"** banner with setup guidance.
- If a database query fails, an honest error banner with diagnostic details is presented.
