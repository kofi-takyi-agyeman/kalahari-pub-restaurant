-- ==============================================================================
-- Seed: seed.sql
-- Project: Kalahari Dine
-- Developer: Data_Nova
-- Description: Idempotent demonstration menu seed data based on Kalahari Dine offerings.
--              Conspicuously flags all items with is_sample_price = true.
--              Every dish image precisely matches its title and culinary presentation.
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
        '/dishes/fufu_light_soup.jpg',
        1,
        true
    ),
    (
        'c0000001-0000-0000-0000-000000000002',
        'Grilled Food',
        'grilled-food',
        'Charcoal-grilled whole tilapia, seasoned meats, and savory kebabs hot off the flames.',
        '/dishes/grilled_tilapia_platter.jpg',
        2,
        true
    ),
    (
        'c0000001-0000-0000-0000-000000000003',
        'Rice Meals',
        'rice-meals',
        'Richly spiced Ghanaian Jollof rice, fried rice, and succulent protein pairings.',
        '/dishes/assorted_jollof_deluxe.jpg',
        3,
        true
    ),
    (
        'c0000001-0000-0000-0000-000000000004',
        'Drinks',
        'drinks',
        'Chilled lagers, stout, malt, soft drinks, and cold refreshing beverages.',
        'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
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
    -- 1. Pounded Fufu with Goat Meat Light Soup
    (
        'd0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000001',
        'Pounded Fufu with Goat Meat Light Soup',
        'fufu-light-soup',
        'Smooth, velvety pounded cassava and plantain fufu served in an authentic Ghanaian Asanka earthenware bowl with aromatic, spicy tomato and garden egg light soup loaded with tender goat meat pieces.',
        '/dishes/fufu_light_soup.jpg',
        85.00,
        true,
        true,
        true,
        1
    ),
    -- 2. Pounded Fufu with Rich Palm Nut Soup (Abenkwan)
    (
        'd0000001-0000-0000-0000-000000000002',
        'c0000001-0000-0000-0000-000000000001',
        'Pounded Fufu with Rich Palm Nut Soup (Abenkwan)',
        'fufu-palmnut-soup',
        'Silky pounded fufu submerged in thick, fragrant palm fruit broth slow-simmered with smoked fish, dried spices, tender beef, and scotch bonnet peppers.',
        '/dishes/fufu_palmnut_soup.jpg',
        85.00,
        true,
        true,
        true,
        2
    ),
    -- 3. Hot Banku with Okro Stew & Fresh Crab
    (
        'd0000001-0000-0000-0000-000000000003',
        'c0000001-0000-0000-0000-000000000001',
        'Hot Banku with Okro Stew & Fresh Crab',
        'banku-okro-stew',
        'Two freshly steamed, fermented corn and cassava banku dumplings served with rich, glistening green okro stew loaded with whole blue sea crab, tender beef, and savory wele.',
        '/dishes/banku_okro_stew.jpg',
        90.00,
        true,
        true,
        true,
        3
    ),
    -- 4. Traditional Red Red with Fried Fish & Plantains
    (
        'd0000001-0000-0000-0000-000000000004',
        'c0000001-0000-0000-0000-000000000001',
        'Traditional Red Red with Fried Fish & Plantains',
        'red-red-plantain',
        'Hearty black-eyed beans slow-cooked in fragrant red palm oil and tomato stew, garnished with roasted cassava gari granules and accompanied by sweet fried ripe plantains (dodo) and seasoned fried fish.',
        '/dishes/red_red_plantain.jpg',
        55.00,
        true,
        true,
        true,
        4
    ),
    -- 5. Charcoal Grilled Tilapia Platter
    (
        'd0000001-0000-0000-0000-000000000005',
        'c0000001-0000-0000-0000-000000000002',
        'Charcoal Grilled Tilapia Platter',
        'grilled-tilapia-whole',
        'Fresh Lake Volta whole tilapia scored and marinated in fresh ginger, garlic, chili, and local herbs, charcoal-grilled to smoky perfection and served with two balls of hot banku, authentic black shito, and sliced onions.',
        '/dishes/grilled_tilapia_platter.jpg',
        110.00,
        true,
        true,
        true,
        5
    ),
    -- 6. Charcoal Beef Suya Khebab (3 Skewers)
    (
        'd0000001-0000-0000-0000-000000000006',
        'c0000001-0000-0000-0000-000000000002',
        'Charcoal Beef Suya Khebab (3 Skewers)',
        'beef-suya-khebab',
        'Tender skewered lean beef strips coated generously in fragrant northern yaji (kuli-kuli peanut, ginger, and chili) spice rub, flame-grilled over glowing coals and served with sliced red onions and fresh tomatoes.',
        '/dishes/beef_suya_khebab.jpg',
        50.00,
        true,
        true,
        true,
        6
    ),
    -- 7. Kalahari Hot Spiced Kelewele
    (
        'd0000001-0000-0000-0000-000000000007',
        'c0000001-0000-0000-0000-000000000002',
        'Kalahari Hot Spiced Kelewele',
        'spicy-kelewele',
        'Golden ripe plantain cubes marinated in crushed ginger, hot chili peppers, nutmeg, and cloves, fried until caramelized with crispy edges and served piping hot with roasted Ghanaian peanuts.',
        '/dishes/spicy_kelewele.jpg',
        35.00,
        true,
        true,
        true,
        7
    ),
    -- 8. Charcoal Grilled Guinea Fowl (Akonfem)
    (
        'd0000001-0000-0000-0000-000000000008',
        'c0000001-0000-0000-0000-000000000002',
        'Charcoal Grilled Guinea Fowl (Akonfem)',
        'grilled-guinea-fowl',
        'Succulent flame-grilled guinea fowl quarter seasoned in traditional northern Ghanaian pepper rub, grilled with smoky crispy skin and served with hot chili dipping glaze and fresh sliced onions.',
        '/dishes/grilled_guinea_fowl.jpg',
        75.00,
        true,
        true,
        true,
        8
    ),
    -- 9. Flame-Grilled Spiced Quarter Chicken
    (
        'd0000001-0000-0000-0000-000000000009',
        'c0000001-0000-0000-0000-000000000002',
        'Flame-Grilled Spiced Quarter Chicken',
        'grilled-spiced-chicken',
        'Juicy chicken quarter steeped in crushed garlic, ginger, and spicy pepper marinade, flame-charred to seal in juices, served with fresh cucumber slices and spicy house sauce.',
        'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
        65.00,
        true,
        true,
        false,
        9
    ),
    -- 10. Charcoal Grilled Spiced Pork Chops
    (
        'd0000001-0000-0000-0000-000000000010',
        'c0000001-0000-0000-0000-000000000002',
        'Charcoal Grilled Spiced Pork Chops',
        'grilled-spiced-pork',
        'Tender, well-marinated pork cuts seasoned with local herbs, garlic, and coarse black pepper, flame-grilled until caramelized and served with spicy green pepper dip and onions.',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        70.00,
        true,
        false,
        false,
        10
    ),
    -- 11. Deluxe Ghanaian Jollof Rice with Fried Chicken
    (
        'd0000001-0000-0000-0000-000000000011',
        'c0000001-0000-0000-0000-000000000003',
        'Deluxe Ghanaian Jollof Rice with Fried Chicken',
        'jollof-rice-chicken',
        'Iconic Ghanaian smoky jollof rice simmered in rich spiced tomato and rosemary stew, accompanied by golden crispy fried chicken quarter, sweet fried plantains (dodo), crunchy coleslaw, and house shito.',
        '/dishes/assorted_jollof_deluxe.jpg',
        65.00,
        true,
        true,
        true,
        11
    ),
    -- 12. Authentic Ghanaian Waakye Special on Leaf
    (
        'd0000001-0000-0000-0000-000000000012',
        'c0000001-0000-0000-0000-000000000003',
        'Authentic Ghanaian Waakye Special on Leaf',
        'waakye-special',
        'Traditional Ghanaian rice and cowpea beans cooked with red sorghum leaf sheaths, served on fresh banana leaf with tender beef stew, spaghetti (talia), fried sweet plantain, hard-boiled egg, wele, and signature hot black shito.',
        '/dishes/waakye_special.jpg',
        65.00,
        true,
        true,
        true,
        12
    ),
    -- 13. Kalahari Special Fried Rice with Crispy Chicken
    (
        'd0000001-0000-0000-0000-000000000013',
        'c0000001-0000-0000-0000-000000000003',
        'Kalahari Special Fried Rice with Crispy Chicken',
        'fried-rice-chicken',
        'Wok-tossed seasoned golden rice loaded with crisp diced carrots, sweet corn, green peas, and scallions, served with a seasoned golden fried chicken quarter, coleslaw, and shito.',
        'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
        60.00,
        true,
        true,
        false,
        13
    ),
    -- 14. Chilled Club / Star Lager Beer (Large 625ml)
    (
        'd0000001-0000-0000-0000-000000000014',
        'c0000001-0000-0000-0000-000000000004',
        'Chilled Club / Star Lager Beer (Large 625ml)',
        'chilled-lager-beer',
        'Ice-cold large bottle of Ghana''s favorite crisp lager beer poured with a rich frothy head straight from the Kalahari cooler.',
        'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
        25.00,
        true,
        true,
        false,
        14
    ),
    -- 15. Guinness Foreign Extra Stout (Chilled)
    (
        'd0000001-0000-0000-0000-000000000015',
        'c0000001-0000-0000-0000-000000000004',
        'Guinness Foreign Extra Stout (Chilled)',
        'guinness-foreign-extra',
        'Rich, dark, and bittersweet iconic stout served cold with a velvety tan foam, straight from the cooler.',
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
        28.00,
        true,
        true,
        false,
        15
    ),
    -- 16. Chilled Malta Guinness / Alvaro
    (
        'd0000001-0000-0000-0000-000000000016',
        'c0000001-0000-0000-0000-000000000004',
        'Chilled Malta Guinness / Alvaro',
        'malt-drink-chilled',
        'Premium non-alcoholic nourishing malt beverage or sparkling malted pear drink served ice-cold.',
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
        18.00,
        true,
        true,
        false,
        16
    ),
    -- 17. Chilled Kalahari Hibiscus Sobolo (Spiced)
    (
        'd0000001-0000-0000-0000-000000000017',
        'c0000001-0000-0000-0000-000000000004',
        'Chilled Kalahari Hibiscus Sobolo (Spiced)',
        'chilled-hibiscus-sobolo',
        'Refreshing Ghanaian spiced hibiscus flower drink brewed with fresh pineapple peel, crushed ginger, cloves, and grains of selim (hwentia), served ice-cold over ice.',
        'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
        20.00,
        true,
        true,
        false,
        17
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
