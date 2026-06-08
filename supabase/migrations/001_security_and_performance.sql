-- ============================================================
-- ApunBazar Security & Performance Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- PART 1: New Tables
-- ============================================================

-- Settings table (replaces localStorage shipping config)
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS settings_key_idx ON settings(key);

-- Coupons table (replaces localStorage coupons)
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value NUMERIC(10, 2) NOT NULL,
  minimum_order_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_idx ON coupons(code);
CREATE INDEX IF NOT EXISTS coupons_active_idx ON coupons(active);

-- Default shipping config
INSERT INTO settings (key, value)
VALUES ('shipping_config', '{"shippingFee":49,"freeShippingAbove":999,"codFee":30,"codEnabled":true,"freeShippingEnabled":true}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- PART 2: Performance Indexes on Existing Tables
-- ============================================================

-- Products
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_price_idx ON products(price);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at);

-- Orders
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_session_id_idx ON orders(session_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- Cart
CREATE INDEX IF NOT EXISTS cart_items_session_id_idx ON cart_items(session_id);

-- ============================================================
-- VERIFY: Check all tables exist
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
