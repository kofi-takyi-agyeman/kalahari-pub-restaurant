-- ==============================================================================
-- Seed: seed.sql
-- Project: Kalahari Pub & Restaurant
-- Developer: Data_Nova
-- Description: Idempotent demonstration menu seed data based on Kalahari flyers.
--              Conspicuously flags all items with is_sample_price = true.
--              Safe to execute repeatedly without generating duplicates.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Seed Menu Categories (Idempotent via ON CONFLICT (slug) DO UPDATE)
-- ------------------------------------------------------------------------------
INSERT INTO public.menu_categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
    (
        'c0000001-0000-0000-0000-000000000001',
        'Local Dishes',
        'local-dishes',
        'Authentic Ghanaian soups, swallows, and stews prepared with traditional aromatic spices.',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        1,
        true
    ),
    (
        'c0000001-0000-0000-0000-000000000002',
        'Grilled Food',
        'grilled-food',
        'Charcoal-grilled whole tilapia, seasoned meats, and savory kebabs hot off the flames.',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        2,
        true
    ),
    (
        'c0000001-0000-0000-0000-000000000003',
        'Rice Meals',
        'rice-meals',
        'Richly spiced Ghanaian Jollof rice, fried rice, and succulent protein pairings.',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        3,
        true
    ),
    (
        'c0000001-0000-0000-0000-000000000004',
        'Drinks',
        'drinks',
        'Chilled lagers, stout, malt, soft drinks, and cold pub beverages.',
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        4,
        true
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- ------------------------------------------------------------------------------
-- 2. Seed Menu Items (Idempotent via ON CONFLICT (slug) DO UPDATE)
-- ------------------------------------------------------------------------------
INSERT INTO public.menu_items (
    id, category_id, name, slug, description, image_url, price,
    is_sample_price, is_available, is_featured, display_order
)
VALUES
    -- 1. Banku and Tilapia with Okro Stew (Flyer Dish)
    (
        'd0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000001',
        'Banku and Tilapia with Okro Stew',
        'banku-tilapia-okro-stew',
        'Freshly molded corn and cassava dough paired with seasoned grilled tilapia fish and rich, savory Ghanaian okro stew.',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        95.00,
        true,
        true,
        true,
        1
    ),
    -- 2. Fufu with Goat Meat and Okro Soup (Flyer Dish)
    (
        'd0000001-0000-0000-0000-000000000002',
        'c0000001-0000-0000-0000-000000000001',
        'Fufu with Goat Meat and Okro Soup',
        'fufu-goat-meat-okro-soup',
        'Soft, silky pounded cassava and plantain fufu served submerged in traditional seasoned okro soup with tender goat meat pieces.',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        85.00,
        true,
        true,
        true,
        2
    ),
    -- 3. Omo Tuo with Assorted Meat (Flyer Dish)
    (
        'd0000001-0000-0000-0000-000000000003',
        'c0000001-0000-0000-0000-000000000001',
        'Omo Tuo with Assorted Meat',
        'omo-tuo-assorted-meat',
        'Smooth, rounded rice balls paired with rich groundnut (peanut) soup or palm nut soup, enriched with assorted meats and fish.',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        75.00,
        true,
        true,
        true,
        3
    ),
    -- 4. Grilled Fish / Charcoal Grilled Tilapia (Flyer Dish)
    (
        'd0000001-0000-0000-0000-000000000004',
        'c0000001-0000-0000-0000-000000000002',
        'Charcoal Grilled Tilapia',
        'charcoal-grilled-tilapia',
        'Whole fresh tilapia seasoned with ginger, garlic, chili, and local spices, charcoal-grilled to smoky tenderness and served with hot shito and sliced onions.',
        'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
        110.00,
        true,
        true,
        true,
        4
    ),
    -- 5. Jollof Rice with Chicken (Flyer Dish)
    (
        'd0000001-0000-0000-0000-000000000005',
        'c0000001-0000-0000-0000-000000000003',
        'Ghanaian Jollof Rice with Chicken',
        'jollof-rice-with-chicken',
        'Smoky, aromatic long-grain rice slow-cooked in rich seasoned tomato stew, served with seasoned fried chicken, fried sweet plantain (kelewele), and coleslaw.',
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
        60.00,
        true,
        true,
        true,
        5
    ),
    -- 6. Fufu with Light Soup (Flyer Dish)
    (
        'd0000001-0000-0000-0000-000000000006',
        'c0000001-0000-0000-0000-000000000001',
        'Fufu with Light Soup',
        'fufu-with-light-soup',
        'Classic Ghanaian fufu served in fragrant, spicy tomato-based light soup loaded with seasoned fish and assorted meat cuts.',
        'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        80.00,
        true,
        true,
        true,
        6
    ),
    -- 7. Kokonte with Palm Nut Soup (Flyer Dish)
    (
        'd0000001-0000-0000-0000-000000000007',
        'c0000001-0000-0000-0000-000000000001',
        'Kokonte with Palm Nut Soup',
        'kokonte-with-palm-nut-soup',
        'Hearty brown cassava flour swallow accompanied by richly simmered aromatic palm nut soup and slow-cooked meat cuts.',
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        70.00,
        true,
        true,
        true,
        7
    ),
    -- Additional Grill & Rice specialties
    (
        'd0000001-0000-0000-0000-000000000008',
        'c0000001-0000-0000-0000-000000000002',
        'Grilled Spiced Quarter Chicken',
        'grilled-spiced-quarter-chicken',
        'Juicy chicken quarter marinated in Ghanaian pepper blend, flame-grilled and served with chili glaze and fresh garnish.',
        'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
        65.00,
        true,
        true,
        false,
        8
    ),
    (
        'd0000001-0000-0000-0000-000000000009',
        'c0000001-0000-0000-0000-000000000003',
        'Kalahari Special Fried Rice',
        'kalahari-special-fried-rice',
        'Wok-tossed rice with crisp diced bell peppers, carrots, spring onions, and oriental spices, served with golden crispy chicken.',
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        60.00,
        true,
        true,
        false,
        9
    ),
    -- Pub Chilled Drinks
    (
        'd0000001-0000-0000-0000-000000000010',
        'c0000001-0000-0000-0000-000000000004',
        'Chilled Club / Star Lager Beer (Large)',
        'chilled-club-star-lager-beer',
        'Ice-cold large bottle of Ghana crisp lager beer, straight from the Kalahari pub cooler.',
        'https://images.unsplash.com/photo-1608270116666-3d23f7bb54c9?auto=format&fit=crop&w=800&q=80',
        25.00,
        true,
        true,
        false,
        10
    ),
    (
        'd0000001-0000-0000-0000-000000000011',
        'c0000001-0000-0000-0000-000000000004',
        'Guinness Foreign Extra Stout',
        'guinness-foreign-extra-stout',
        'Rich, dark, and bittersweet iconic stout served chilled.',
        'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=80',
        28.00,
        true,
        true,
        false,
        11
    ),
    (
        'd0000001-0000-0000-0000-000000000012',
        'c0000001-0000-0000-0000-000000000004',
        'Chilled Malta Guinness / Alvaro',
        'chilled-malta-guinness-alvaro',
        'Non-alcoholic nourishing malt beverage or refreshing malted pear drink served ice-cold.',
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        18.00,
        true,
        true,
        false,
        12
    )
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    price = EXCLUDED.price,
    is_sample_price = EXCLUDED.is_sample_price,
    is_available = EXCLUDED.is_available,
    is_featured = EXCLUDED.is_featured,
    display_order = EXCLUDED.display_order;
