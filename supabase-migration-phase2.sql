-- ========================================================
-- ZEVORA Luxury Commerce — Supabase Migration (Phase 2)
-- Reviews, Payment Transactions & 1-Click Customer Profiles
-- Run this in your Supabase SQL Editor: New Query -> Paste -> Run
-- ========================================================

-- 1. REVIEWS TABLE (Customer Ratings & Reviews)
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

-- 2. PAYMENT TRANSACTIONS TABLE (JazzCash, EasyPaisa, Bank Wire & Card Records)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY, -- e.g. TXN-73921
  order_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  account_number TEXT, -- Mobile wallet number or bank IBAN
  transaction_reference TEXT, -- JazzCash / EasyPaisa TID or Bank Ref #
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Completed', 'Failed')),
  notes TEXT,
  created_at BIGINT NOT NULL
);

-- 3. ENHANCE CUSTOMERS TABLE FOR 1-CLICK CHECKOUT AUTO-FILL
ALTER TABLE customers ADD COLUMN IF NOT EXISTS default_address JSONB;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS saved_payment_method TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS saved_payment_account TEXT;

-- 4. ENABLE ROW LEVEL SECURITY & POLICIES
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Permissive Policies
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert payment_transactions" ON payment_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read payment_transactions" ON payment_transactions FOR SELECT USING (true);

-- 5. SEED INITIAL CUSTOMER REVIEWS
INSERT INTO reviews (id, product_id, author, location, rating, comment, verified, created_at)
VALUES
(
  'rev-1',
  'nx-shoe-01',
  'Hamza Malik',
  'Lahore, Pakistan',
  5,
  'The Cyber Runner 01 exceeded all expectations. The carbon fiber propulsion and finish quality are equal to high-end European luxury houses. Arrived in Lahore within 36 hours in gorgeous matte black packaging.',
  true,
  1792135430000
),
(
  'rev-2',
  'nx-bag-01',
  'Ayesha Siddiqui',
  'Karachi, Pakistan',
  5,
  'The Apex Leather Holdall is a work of art. Supple Tuscan leather, robust aluminum hardware, and the separate ventilated shoe garage is brilliant for weekend trips between Karachi and Islamabad.',
  true,
  1791876230000
),
(
  'rev-3',
  'nx-cloth-02',
  'Zainab Qureshi',
  'Islamabad, Pakistan',
  5,
  'Zevora’s attention to detail is remarkable. The 500 GSM heavyweight hoodie has an incredible drape and silhouette. Customer support reached out via WhatsApp within minutes to confirm delivery.',
  true,
  1791530630000
),
(
  'rev-4',
  'nx-wat-02',
  'Bilal Farooq',
  'Dubai, UAE',
  5,
  'Ordered the Horizon Minimalist Chrono. The ceramic bezel and smoked steel case look stunning in person. Easily the best luxury e-commerce experience.',
  true,
  1790925830000
)
ON CONFLICT (id) DO NOTHING;
