# Nexora — Premium Luxury E-Commerce Platform

Nexora is a high-performance, international-caliber e-commerce platform engineered with a brutalist dark-mode aesthetic, vibrant neon green accents (`#35F582`), cinematic device mockups, full Pakistani Rupee (PKR) commerce support, and an end-to-end shopping and administration architecture.

---

## 1. Brand Identity & Visual System

- **Primary Background:** Deep Black (`#050706`)
- **Secondary Background / Surfaces:** Dark Charcoal (`#101512`, `#161D19`)
- **Accent Neon:** Electric Neon Green (`#35F582`)
- **Primary Text:** Crisp White (`#FFFFFF`)
- **Secondary Text:** Muted Gray (`#A5ADA8`)
- **Borders:** Subtle Dark Emerald Slate (`#252D28`)
- **Typography:** Manrope & Plus Jakarta Sans with modern sans-serif hierarchy

---

## 2. Key Features

### 💎 Cinematic Homepage Hero
- **Left Side:** Minimalist code-inspired brand badge `<nexora.store />`, bold headline **"Start Selling Online."** with glowing neon highlight, supporting subtitle *"Custom E-Commerce Websites"*, and primary CTA button.
- **Right Side:** Realistic macOS-style dark laptop mockup with camera notch and live interactive storefront preview, gracefully overlapping an ultra-thin smartphone mockup with dynamic island, 5G status bar, and interactive product card.

### 🛍️ Product Catalog & Categories
- **5 Core Categories:** Shoes, Clothing, Bags, Watches, Accessories.
- **Real PKR Pricing:** e.g., `Rs. 24,500` with strike-through original prices and discount badges (`-15%`, `-20%`).
- **Authentic Photography:** High-resolution luxury imagery across all categories.
- **Filtering & Search:** Real-time category pills, tab switches (*All*, *Best Sellers*, *New Arrivals*), price filter, in-stock toggle, and keyboard shortcut search (`⌘K`).

### 🔍 Dedicated Product View
- Multi-image gallery with interactive thumbnail selector and zoom.
- Size and color variant swatches with active selection indicators.
- Quantity stepper with stock-capped increments.
- Nationwide 48-hour delivery and technical specification accordions.
- Instant checkout and related product recommendations.

### 🛒 Functional Cart & Pakistani Checkout
- Slide-over drawer with item quantity adjustments and stock validation.
- Free nationwide express delivery progress meter (threshold: `Rs. 10,000`).
- Voucher codes with real-time deduction:
  - `NEXORA10`: 10% discount
  - `VIP20`: 20% patron discount
  - `LAUNCH1500`: Flat Rs. 1,500 welcome credit
- Complete Pakistani checkout validation:
  - Full Name, Phone (`03xx-xxxxxxx` or `+923xxxxxxxxx`), Email, Address, City dropdown (Lahore, Karachi, Islamabad, etc.).
  - Payment methods: **Cash on Delivery (COD)** [Default], Credit/Debit Card, JazzCash / EasyPaisa, and Direct Bank Wire.

### 📦 Order Confirmation & Tracking
- Generated unique Order ID (e.g., `#NX-25744`).
- Courier tracking code (e.g., `TRAX-3588080` / `TCS Express Overnight`).
- Estimated 48-hour delivery window.
- Printable receipt and persistent order history.

### 🛡️ Protected Store Administration Dashboard
- Password-gated entry (`admin123` or instant demo bypass).
- **KPI Metrics:** Total Gross Sales in PKR, Total Orders, Active Catalog Items, Low Stock Alerts.
- **Orders Table:** Live customer details, city, line items, payment type, and order status update dropdown (*Pending, Confirmed, Processing, Shipped, Delivered, Cancelled*).
- **Product Management:** Create new product, edit existing product, delete item, and instant stock increment/decrement (`-` / `+`).
- **Sales Analytics:** Category revenue distribution and logistics performance metrics.

### 👤 Customer Concierge Portal
- Customer login, registration, and logout.
- Profile overview and past order tracking with status badges.

---

## 3. Database Schema (PostgreSQL / Supabase)

```sql
-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  tagline TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  category_id UUID REFERENCES categories(id),
  price NUMERIC(12, 2) NOT NULL,
  original_price NUMERIC(12, 2),
  description TEXT NOT NULL,
  details JSONB DEFAULT '[]'::jsonb,
  stock INT NOT NULL DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  address TEXT,
  postal_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  subtotal NUMERIC(12, 2) NOT NULL,
  discount NUMERIC(12, 2) DEFAULT 0,
  shipping_fee NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Confirmed',
  tracking_number VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  size VARCHAR(50),
  color VARCHAR(50),
  quantity INT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL
);
```

---

## 4. Running Unit Tests

Nexora decouples pure business calculations (subtotal, shipping threshold, promo deductions, stock capping, phone/email validation) into `src/utils/cartLogic.ts`.

Run the native test suite:
```bash
node --test src/utils/cartLogic.test.ts
```

All 9 assertions pass deterministically in milliseconds without browser overhead.

---

## 5. Development & Production Build

```bash
# Start local development server (Port 3000)
npm run dev

# Run TypeScript checks
npm run lint

# Compile production bundle
npm run build
```
