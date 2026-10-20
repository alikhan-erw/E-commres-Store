-- ========================================================
-- ZEVORA Luxury Commerce — Supabase PostgreSQL Schema
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Shoes', 'Clothing', 'Bags', 'Watches', 'Accessories')),
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 1,
  featured BOOLEAN NOT NULL DEFAULT false,
  best_seller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  sku TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- e.g. ZV-94821
  date TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  customer JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  tracking_number TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address JSONB,
  default_address JSONB,
  saved_payment_method TEXT,
  saved_payment_account TEXT,
  saved_orders JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. REVIEWS TABLE (Customer Ratings & Reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  author TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  created_at BIGINT NOT NULL
);

-- 5. PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  account_number TEXT,
  transaction_reference TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Completed', 'Failed')),
  notes TEXT,
  created_at BIGINT NOT NULL
);

-- 6. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  order_id TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Replied')),
  created_at BIGINT NOT NULL
);

-- 7. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  subscribed_at BIGINT NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Permissive public read for storefront products
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public insert contact" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public customers access" ON customers FOR ALL USING (true);

-- Seed Initial ZEVORA Products
INSERT INTO products (id, name, subtitle, category, price, original_price, images, description, details, sizes, colors, stock, rating, review_count, featured, best_seller, is_new_arrival, sku)
VALUES
(
  'nx-shoe-01',
  'Zevora Cyber Runner 01',
  'Ultralight Kinetic Footwear',
  'Shoes',
  24500,
  28900,
  '["/src/assets/images/hero_flagship_cyber_runner_1792134724574.jpg", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
  'Engineered with aerospace-grade carbon fiber shank and responsive kinetic foam cushioning.',
  '["Aerospace carbon propulsion plate", "Seamless 3D woven ballistic mesh upper", "High-traction obsidian rubber outsole"]'::jsonb,
  '["EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"]'::jsonb,
  '[{"name": "Obsidian & Neon Green", "hex": "#35F582"}, {"name": "Stealth Matte Black", "hex": "#121212"}]'::jsonb,
  8,
  4.9,
  47,
  true,
  true,
  false,
  'ZV-SH-001'
),
(
  'nx-cloth-01',
  'Zevora Technical Shell Parka',
  '3-Layer Weatherproof Membrane',
  'Clothing',
  38500,
  48000,
  '["/src/assets/images/hero_luxury_streetwear_editorial_1792134724316.jpg", "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
  'High-performance architectural outerwear. 20,000mm hydrostatic head waterproof rating.',
  '["GORE-grade 3-layer breathable membrane", "YKK Aquaguard matte waterproof zippers"]'::jsonb,
  '["S", "M", "L", "XL"]'::jsonb,
  '[{"name": "Pitch Black", "hex": "#050706"}, {"name": "Cyber Moss", "hex": "#1c2e22"}]'::jsonb,
  7,
  5.0,
  52,
  true,
  true,
  false,
  'ZV-CL-001'
),
(
  'nx-bag-01',
  'Zevora Apex Leather Holdall',
  'Architectural Weekend Duffle',
  'Bags',
  46000,
  55000,
  '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
  'Constructed from matte-finish Tuscan calfskin with anodized aluminum hardware.',
  '["Full-grain Italian vegetable-tanned leather", "Padded 16\" MacBook Pro sleeve"]'::jsonb,
  '["One Size (45L)"]'::jsonb,
  '[{"name": "Matte Obsidian", "hex": "#0a0a0a"}]'::jsonb,
  5,
  4.9,
  29,
  true,
  false,
  false,
  'ZV-BG-001'
)
ON CONFLICT (id) DO NOTHING;
