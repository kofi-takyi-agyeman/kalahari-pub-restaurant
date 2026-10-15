-- ==============================================================================
-- Migration: 20261015000002_create_admin_and_settings_schema.sql
-- Project: Kalahari Pub & Restaurant
-- Developer: Data_Nova
-- Description: Operational settings, order audit logs, storage bucket policies,
--              and admin management RLS rules.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table: order_status_logs (Audit Trail for Status Transitions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100) DEFAULT 'admin',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT ck_status_logs_new_status CHECK (
        new_status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
    )
);

CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id ON public.order_status_logs (order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_created_at ON public.order_status_logs (created_at DESC);

COMMENT ON TABLE public.order_status_logs IS 'Audit log recording status changes and timestamps for restaurant orders.';

-- ------------------------------------------------------------------------------
-- 2. Table: restaurant_settings (Authorized Operational Settings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(64) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_restaurant_settings_key ON public.restaurant_settings (key);

COMMENT ON TABLE public.restaurant_settings IS 'Operational business configuration for Kalahari Pub & Restaurant.';

-- Seed initial operational settings
INSERT INTO public.restaurant_settings (key, value, description)
VALUES 
(
    'delivery_config',
    '{
        "enabled": false,
        "policy_notice": "Pending owner delivery fee and coverage ratification",
        "zones": [
            {"area": "A-Lang", "fee": 15.00},
            {"area": "Sowutuom", "fee": 20.00},
            {"area": "Kwashieman", "fee": 25.00},
            {"area": "Santa Maria", "fee": 25.00}
        ],
        "min_order": 0.00
    }'::jsonb,
    'Delivery enablement, confirmed zones, and fee schedule.'
),
(
    'operating_hours',
    '{
        "monday_saturday": "10:00 AM - 11:00 PM",
        "sunday": "12:00 PM - 11:00 PM",
        "pickup_enabled": true,
        "location": "Kalahari Pub, A-Lang Taxi Rank"
    }'::jsonb,
    'Opening hours and pickup status.'
),
(
    'contact_info',
    '{
        "business_name": "Kalahari Pub & Restaurant",
        "location": "Kalahari Pub, A-Lang Taxi Rank",
        "phones": ["0245656849", "0207157071", "0246773225"],
        "currency": "GHS"
    }'::jsonb,
    'Verified contact details and currency settings.'
)
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- restaurant_settings: Public can read (for storefront hours & delivery fee lookup)
DROP POLICY IF EXISTS "Public can view operational settings" ON public.restaurant_settings;
CREATE POLICY "Public can view operational settings"
    ON public.restaurant_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- restaurant_settings: Only admin can modify settings
DROP POLICY IF EXISTS "Admin can manage operational settings" ON public.restaurant_settings;
CREATE POLICY "Admin can manage operational settings"
    ON public.restaurant_settings
    FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

-- order_status_logs: Public can read logs belonging to an authorized order with access_token
DROP POLICY IF EXISTS "Public can view logs for authorized order" ON public.order_status_logs;
CREATE POLICY "Public can view logs for authorized order"
    ON public.order_status_logs
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_status_logs.order_id
              AND o.access_token = current_setting('request.headers', true)::json->>'x-order-token'
        )
    );

-- order_status_logs: Admin can manage all audit logs
DROP POLICY IF EXISTS "Admin can manage all order logs" ON public.order_status_logs;
CREATE POLICY "Admin can manage all order logs"
    ON public.order_status_logs
    FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

-- ------------------------------------------------------------------------------
-- 4. Storage Bucket Configuration for Dish Photos
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'menu-images',
    'menu-images',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- Storage RLS Policies: Public Read
DROP POLICY IF EXISTS "Public can read menu images" ON storage.objects;
CREATE POLICY "Public can read menu images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'menu-images');

-- Storage RLS Policies: Admin Upload, Update, Delete
DROP POLICY IF EXISTS "Admin can upload menu images" ON storage.objects;
CREATE POLICY "Admin can upload menu images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'menu-images' AND
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin can update menu images" ON storage.objects;
CREATE POLICY "Admin can update menu images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'menu-images' AND
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin can delete menu images" ON storage.objects;
CREATE POLICY "Admin can delete menu images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'menu-images' AND
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );
