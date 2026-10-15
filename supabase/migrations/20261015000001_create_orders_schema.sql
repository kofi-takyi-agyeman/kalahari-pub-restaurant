-- ==============================================================================
-- Migration: 20261015000001_create_orders_schema.sql
-- Project: Kalahari Pub & Restaurant
-- Developer: Data_Nova
-- Description: Core orders and order_items schema with historical price snapshots,
--              status lifecycle constraints, performance indexes, and privacy RLS.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table: orders
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) NOT NULL,
    access_token VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(64),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(25) NOT NULL,
    order_type VARCHAR(20) NOT NULL,
    delivery_address TEXT,
    delivery_area VARCHAR(100),
    delivery_instructions TEXT,
    customer_note TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    currency VARCHAR(3) NOT NULL DEFAULT 'GHS',
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_orders_order_number UNIQUE (order_number),
    CONSTRAINT uq_orders_idempotency_key UNIQUE (idempotency_key),
    CONSTRAINT ck_orders_order_type CHECK (order_type IN ('pickup', 'delivery')),
    CONSTRAINT ck_orders_status CHECK (
        status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
    ),
    CONSTRAINT ck_orders_subtotal_non_negative CHECK (subtotal >= 0),
    CONSTRAINT ck_orders_delivery_fee_non_negative CHECK (delivery_fee >= 0),
    CONSTRAINT ck_orders_total_non_negative CHECK (total >= 0)
);

-- Documentation comments
COMMENT ON TABLE public.orders IS 'Customer orders for Kalahari Pub & Restaurant.';
COMMENT ON COLUMN public.orders.order_number IS 'Human-readable unique order identifier (e.g. KP-20261015-XXXX).';
COMMENT ON COLUMN public.orders.access_token IS 'Cryptographically secure token for customer receipt lookup without requiring account login.';
COMMENT ON COLUMN public.orders.idempotency_key IS 'Unique submission key preventing accidental duplicate submissions from network retries.';

-- ------------------------------------------------------------------------------
-- 2. Table: order_items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(64) REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(150) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    line_total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT ck_order_items_unit_price_non_negative CHECK (unit_price >= 0),
    CONSTRAINT ck_order_items_quantity_valid CHECK (quantity > 0 AND quantity <= 100),
    CONSTRAINT ck_order_items_line_total_non_negative CHECK (line_total >= 0)
);

-- Documentation comments
COMMENT ON TABLE public.order_items IS 'Line items for orders. Stores snapshots of item names and unit prices at purchase time.';

-- ------------------------------------------------------------------------------
-- 3. Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_access_token ON public.orders (access_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

-- ------------------------------------------------------------------------------
-- 4. Trigger: update updated_at on orders
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ------------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Deny public browsing of all orders; allow lookup only by valid access_token
DROP POLICY IF EXISTS "Public can view own order by access_token" ON public.orders;
CREATE POLICY "Public can view own order by access_token"
    ON public.orders
    FOR SELECT
    TO anon, authenticated
    USING (
        access_token IS NOT NULL
        AND access_token = current_setting('request.headers', true)::json->>'x-order-token'
    );

-- Allow public to view items belonging to an authorized order
DROP POLICY IF EXISTS "Public can view items for authorized order" ON public.order_items;
CREATE POLICY "Public can view items for authorized order"
    ON public.order_items
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.access_token = current_setting('request.headers', true)::json->>'x-order-token'
        )
    );

-- Admin policies: Full management for authenticated staff (role = 'admin')
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
CREATE POLICY "Admin can view all orders"
    ON public.orders
    FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin can view all order items" ON public.order_items;
CREATE POLICY "Admin can view all order items"
    ON public.order_items
    FOR ALL
    TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

-- ------------------------------------------------------------------------------
-- 6. Atomic Order Creation Function (SECURITY DEFINER)
-- ------------------------------------------------------------------------------
-- Atomically inserts order header, all line items, and the initial status audit log.
CREATE OR REPLACE FUNCTION public.create_customer_order(
    p_order jsonb,
    p_items jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id uuid;
    v_order_number text;
    v_access_token text;
    v_item jsonb;
BEGIN
    v_order_id := coalesce((p_order->>'id')::uuid, gen_random_uuid());
    v_order_number := p_order->>'order_number';
    v_access_token := p_order->>'access_token';

    -- 1. Insert Order Header
    INSERT INTO public.orders (
        id,
        order_number,
        access_token,
        idempotency_key,
        customer_name,
        customer_phone,
        order_type,
        delivery_address,
        delivery_area,
        delivery_instructions,
        customer_note,
        status,
        currency,
        subtotal,
        delivery_fee,
        total
    ) VALUES (
        v_order_id,
        v_order_number,
        v_access_token,
        p_order->>'idempotency_key',
        p_order->>'customer_name',
        p_order->>'customer_phone',
        p_order->>'order_type',
        p_order->>'delivery_address',
        p_order->>'delivery_area',
        p_order->>'delivery_instructions',
        p_order->>'customer_note',
        'pending',
        coalesce(p_order->>'currency', 'GHS'),
        (p_order->>'subtotal')::numeric,
        coalesce((p_order->>'delivery_fee')::numeric, 0.00),
        (p_order->>'total')::numeric
    );

    -- 2. Insert Order Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            id,
            order_id,
            menu_item_id,
            item_name,
            unit_price,
            quantity,
            line_total
        ) VALUES (
            coalesce((v_item->>'id')::uuid, gen_random_uuid()),
            v_order_id,
            v_item->>'menu_item_id',
            v_item->>'item_name',
            (v_item->>'unit_price')::numeric,
            (v_item->>'quantity')::integer,
            (v_item->>'line_total')::numeric
        );
    END LOOP;

    -- 3. Insert Initial Audit Log Entry
    INSERT INTO public.order_status_logs (
        id,
        order_id,
        previous_status,
        new_status,
        changed_by,
        notes
    ) VALUES (
        gen_random_uuid(),
        v_order_id,
        NULL,
        'pending',
        'customer-checkout',
        'Order created via online checkout (' || (p_order->>'order_type') || ')'
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'access_token', v_access_token
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create order atomically: %', SQLERRM;
END;
$$;
