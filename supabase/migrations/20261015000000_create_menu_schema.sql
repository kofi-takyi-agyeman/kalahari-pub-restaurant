-- ==============================================================================
-- Migration: 20261015000000_create_menu_schema.sql
-- Project: Kalahari Pub & Restaurant
-- Developer: Data_Nova
-- Description: Core menu schema (menu_categories, menu_items), constraints,
--              automated timestamp triggers, indexes, and Row Level Security (RLS).
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Table: menu_categories
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_menu_categories_slug UNIQUE (slug)
);

-- Comments for documentation
COMMENT ON TABLE public.menu_categories IS 'Menu categories for Kalahari Pub & Restaurant (Local Dishes, Grilled Food, Rice Meals, Drinks).';
COMMENT ON COLUMN public.menu_categories.is_active IS 'Controls whether the category and its dishes are visible to public customers.';

-- ------------------------------------------------------------------------------
-- 2. Table: menu_items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    price NUMERIC(10, 2) NOT NULL,
    is_sample_price BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_menu_items_slug UNIQUE (slug),
    CONSTRAINT ck_menu_items_price_non_negative CHECK (price >= 0)
);

-- Comments for documentation
COMMENT ON TABLE public.menu_items IS 'Food and beverage menu items for Kalahari Pub & Restaurant.';
COMMENT ON COLUMN public.menu_items.price IS 'Dish price in Ghanaian Cedis (GHS). Uses NUMERIC(10,2) for exact monetary calculations.';
COMMENT ON COLUMN public.menu_items.is_sample_price IS 'Flags temporary demonstration estimates (SAMPLE PRICE — CONFIRM WITH RESTAURANT).';

-- ------------------------------------------------------------------------------
-- 3. Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_menu_categories_is_active_order
    ON public.menu_categories (is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_menu_items_category_id
    ON public.menu_items (category_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_is_available
    ON public.menu_items (is_available);

CREATE INDEX IF NOT EXISTS idx_menu_items_featured
    ON public.menu_items (is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_menu_items_display_order
    ON public.menu_items (display_order);

-- ------------------------------------------------------------------------------
-- 4. Automated updated_at Timestamp Trigger
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_menu_categories_updated_at ON public.menu_categories;
CREATE TRIGGER trigger_menu_categories_updated_at
    BEFORE UPDATE ON public.menu_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trigger_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ------------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
-- Enable RLS on both tables
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Category Policy: Public can only READ active categories
DROP POLICY IF EXISTS "Public can view active menu categories" ON public.menu_categories;
CREATE POLICY "Public can view active menu categories"
    ON public.menu_categories
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Menu Items Policy: Public can only READ available items belonging to active categories
DROP POLICY IF EXISTS "Public can view available menu items" ON public.menu_items;
CREATE POLICY "Public can view available menu items"
    ON public.menu_items
    FOR SELECT
    TO anon, authenticated
    USING (
        is_available = true
        AND EXISTS (
            SELECT 1 FROM public.menu_categories c
            WHERE c.id = menu_items.category_id
              AND c.is_active = true
        )
    );

-- Administrative Write Policies (Prepared for Phase 3 Authenticated Admin)
-- Non-admin and public users have NO insert/update/delete privileges.
-- Only authenticated users with app_metadata role = 'admin' may mutate menu records.
DROP POLICY IF EXISTS "Admin users can insert menu categories" ON public.menu_categories;
CREATE POLICY "Admin users can insert menu categories"
    ON public.menu_categories
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin users can update menu categories" ON public.menu_categories;
CREATE POLICY "Admin users can update menu categories"
    ON public.menu_categories
    FOR UPDATE
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin users can delete menu categories" ON public.menu_categories;
CREATE POLICY "Admin users can delete menu categories"
    ON public.menu_categories
    FOR DELETE
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin users can insert menu items" ON public.menu_items;
CREATE POLICY "Admin users can insert menu items"
    ON public.menu_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin users can update menu items" ON public.menu_items;
CREATE POLICY "Admin users can update menu items"
    ON public.menu_items
    FOR UPDATE
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin users can delete menu items" ON public.menu_items;
CREATE POLICY "Admin users can delete menu items"
    ON public.menu_items
    FOR DELETE
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );
