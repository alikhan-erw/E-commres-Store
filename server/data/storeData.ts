import type {
  Product,
  Order,
  CustomerUser,
  OrderStatus,
  Review,
  PaymentTransaction,
  CustomerAddress,
} from '../../src/types/index.ts';
import { INITIAL_PRODUCTS } from '../../src/data/products.ts';
import { TESTIMONIALS } from '../../src/data/testimonials.ts';
import {
  calculateCartTotals,
  evaluatePromoCode,
  validatePakistaniPhone,
  validateEmail,
} from '../../src/utils/cartLogic.ts';
import { generateOrderId, generateTrackingNumber } from '../../src/utils/format.ts';
import { supabase, isSupabaseConfigured } from './supabaseClient.ts';

// In-Memory Database stores (synchronized live with Supabase)
let products: Product[] = [...INITIAL_PRODUCTS];

let reviews: Review[] = TESTIMONIALS.map((t, idx) => ({
  ...t,
  productId: INITIAL_PRODUCTS[idx % INITIAL_PRODUCTS.length]?.id,
  createdAt: Date.now() - 3600000 * 24 * (idx + 1) * 3,
}));

let paymentTransactions: PaymentTransaction[] = [
  {
    id: 'TXN-94821',
    orderId: 'ZV-94821',
    customerEmail: 'hamza.malik@domain.pk',
    paymentMethod: 'Cash on Delivery (COD)',
    amount: 22050,
    currency: 'PKR',
    status: 'Verified',
    notes: 'COD Courier settlement assigned to TCS',
    createdAt: Date.now() - 3600000 * 24 * 2,
  },
  {
    id: 'TXN-78320',
    orderId: 'ZV-78320',
    customerEmail: 'ayesha.s@domain.pk',
    paymentMethod: 'Credit / Debit Card',
    amount: 38500,
    currency: 'PKR',
    accountNumber: '**** **** **** 4821',
    transactionReference: 'AUTH-VISA-982143',
    status: 'Completed',
    notes: 'Settled via 3D Secure Card Gateway',
    createdAt: Date.now() - 3600000 * 24 * 5,
  },
];

let orders: Order[] = [
  {
    id: 'ZV-94821',
    date: new Date(Date.now() - 3600000 * 24 * 2).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    items: [
      {
        cartId: 'nx-shoe-01-EU 42-Obsidian & Neon Green',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'EU 42',
        selectedColor: { name: 'Obsidian & Neon Green', hex: '#35F582' },
        quantity: 1,
      },
    ],
    subtotal: 24500,
    shippingFee: 0,
    discount: 2450,
    total: 22050,
    customer: {
      fullName: 'Hamza Malik',
      email: 'hamza.malik@domain.pk',
      phone: '03001234567',
      address: 'House 42, Street 8, Sector Y, DHA Phase 3',
      city: 'Lahore',
      postalCode: '54792',
      country: 'Pakistan',
      notes: 'Call before delivery',
    },
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Dispatched' as OrderStatus,
    trackingNumber: 'TCS-9482103',
    createdAt: Date.now() - 3600000 * 24 * 2,
    paymentTransactionId: 'TXN-94821',
  },
  {
    id: 'ZV-78320',
    date: new Date(Date.now() - 3600000 * 24 * 5).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    items: [
      {
        cartId: 'nx-cloth-01-M-Pitch Black',
        product: INITIAL_PRODUCTS[3] || INITIAL_PRODUCTS[0],
        selectedSize: 'M',
        selectedColor: { name: 'Pitch Black', hex: '#050706' },
        quantity: 1,
      },
    ],
    subtotal: 38500,
    shippingFee: 0,
    discount: 0,
    total: 38500,
    customer: {
      fullName: 'Ayesha Siddiqui',
      email: 'ayesha.s@domain.pk',
      phone: '03219876543',
      address: 'Apartment 14B, Executive Towers, Clifton Block 4',
      city: 'Karachi',
      postalCode: '75600',
      country: 'Pakistan',
    },
    paymentMethod: 'Credit / Debit Card',
    status: 'Delivered' as OrderStatus,
    trackingNumber: 'LEOPARDS-7832041',
    createdAt: Date.now() - 3600000 * 24 * 5,
    paymentTransactionId: 'TXN-78320',
  },
];

let customers: CustomerUser[] = [
  {
    id: 'cust-1',
    name: 'Hamza Malik',
    email: 'hamza.malik@domain.pk',
    phone: '03001234567',
    defaultAddress: {
      fullName: 'Hamza Malik',
      email: 'hamza.malik@domain.pk',
      phone: '03001234567',
      address: 'House 42, Street 8, Sector Y, DHA Phase 3',
      city: 'Lahore',
      postalCode: '54792',
      country: 'Pakistan',
      notes: 'Ring bell at main gate',
    },
    savedPaymentMethod: 'Cash on Delivery (COD)',
    savedOrders: ['ZV-94821'],
    createdAt: Date.now() - 3600000 * 24 * 30,
  },
  {
    id: 'cust-2',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@domain.pk',
    phone: '03219876543',
    defaultAddress: {
      fullName: 'Ayesha Siddiqui',
      email: 'ayesha.s@domain.pk',
      phone: '03219876543',
      address: 'Apartment 14B, Executive Towers, Clifton Block 4',
      city: 'Karachi',
      postalCode: '75600',
      country: 'Pakistan',
    },
    savedPaymentMethod: 'JazzCash / EasyPaisa',
    savedPaymentAccount: '03219876543',
    savedOrders: ['ZV-78320'],
    createdAt: Date.now() - 3600000 * 24 * 20,
  },
];

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  orderId?: string;
  message: string;
  createdAt: number;
  status: 'New' | 'Replied';
}

let contactInquiries: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Taimur Khan',
    email: 'taimur@domain.pk',
    orderId: 'ZV-94821',
    message: 'Requesting tracking status update for Lahore delivery consignment.',
    createdAt: Date.now() - 3600000 * 12,
    status: 'Replied',
  },
];

let newsletterSubscribers: { email: string; subscribedAt: number }[] = [
  { email: 'hamza.malik@domain.pk', subscribedAt: Date.now() - 3600000 * 48 },
  { email: 'client@zevora.pk', subscribedAt: Date.now() - 3600000 * 24 },
];

// Helper to safely execute Supabase operations without crashing in-memory state
async function safeDbAction(action: () => PromiseLike<any>, context: string) {
  if (!isSupabaseConfigured) return;
  try {
    const res = await action();
    if (res && typeof res === 'object' && 'error' in res && res.error) {
      console.warn(`[Supabase ${context} Notice]:`, res.error.message);
    }
  } catch (err: any) {
    console.warn(`[Supabase ${context} Exception]:`, err.message);
  }
}

// Asynchronous Supabase initial sync
async function syncWithSupabase() {
  if (!isSupabaseConfigured) return;
  try {
    // 1. Sync products
    const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*');
    if (!prodErr && dbProducts && dbProducts.length > 0) {
      console.log(`[Supabase] Loaded ${dbProducts.length} products from PostgreSQL.`);
      products = dbProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        images: Array.isArray(p.images) ? p.images : [],
        description: p.description,
        details: Array.isArray(p.details) ? p.details : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        stock: Number(p.stock),
        rating: Number(p.rating),
        reviewCount: Number(p.review_count),
        featured: Boolean(p.featured),
        bestSeller: Boolean(p.best_seller),
        isNewArrival: Boolean(p.is_new_arrival),
        sku: p.sku,
      }));
    }

    // 2. Sync orders
    const { data: dbOrders, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!orderErr && dbOrders && dbOrders.length > 0) {
      console.log(`[Supabase] Loaded ${dbOrders.length} orders from PostgreSQL.`);
      orders = dbOrders.map((o: any) => ({
        id: o.id,
        date: o.date,
        items: o.items,
        subtotal: Number(o.subtotal),
        shippingFee: Number(o.shipping_fee),
        discount: Number(o.discount),
        total: Number(o.total),
        customer: o.customer,
        paymentMethod: o.payment_method,
        status: o.status,
        trackingNumber: o.tracking_number,
        createdAt: Number(o.created_at),
        paymentTransactionId: o.payment_transaction_id,
      }));
    }

    // 3. Sync reviews
    const { data: dbReviews, error: revErr } = await supabase.from('reviews').select('*');
    if (!revErr && dbReviews && dbReviews.length > 0) {
      console.log(`[Supabase] Loaded ${dbReviews.length} reviews from PostgreSQL.`);
      reviews = dbReviews.map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        author: r.author,
        location: r.location,
        rating: Number(r.rating),
        comment: r.comment,
        verified: Boolean(r.verified),
        date: new Date(Number(r.created_at) || Date.now()).toLocaleDateString('en-PK', {
          day: 'numeric',
          month: 'short',
        }),
        createdAt: Number(r.created_at),
      }));
    }

    // 4. Sync payment transactions
    const { data: dbTxns, error: txnErr } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!txnErr && dbTxns && dbTxns.length > 0) {
      console.log(`[Supabase] Loaded ${dbTxns.length} payment transactions from PostgreSQL.`);
      paymentTransactions = dbTxns.map((t: any) => ({
        id: t.id,
        orderId: t.order_id,
        customerEmail: t.customer_email,
        paymentMethod: t.payment_method,
        amount: Number(t.amount),
        currency: t.currency || 'PKR',
        accountNumber: t.account_number,
        transactionReference: t.transaction_reference,
        status: t.status,
        notes: t.notes,
        createdAt: Number(t.created_at),
      }));
    }

    // 5. Sync customers
    const { data: dbCusts, error: custErr } = await supabase.from('customers').select('*');
    if (!custErr && dbCusts && dbCusts.length > 0) {
      console.log(`[Supabase] Loaded ${dbCusts.length} customers from PostgreSQL.`);
      customers = dbCusts.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        defaultAddress: c.default_address,
        address: c.default_address || c.address,
        savedPaymentMethod: c.saved_payment_method,
        savedPaymentAccount: c.saved_payment_account,
        savedOrders: Array.isArray(c.saved_orders) ? c.saved_orders : [],
        createdAt: c.created_at ? new Date(c.created_at).getTime() : Date.now(),
      }));
    }
  } catch (err: any) {
    console.warn('[Supabase Sync Notice]', err.message);
  }
}

// Trigger initial sync
syncWithSupabase();

export const storeDb = {
  // Products
  getProducts: (filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    inStockOnly?: boolean;
  }) => {
    let result = [...products];

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  getProductById: (id: string) => {
    return products.find(p => p.id === id);
  },

  createProduct: (data: Partial<Product>) => {
    const newProduct: Product = {
      id: data.id || `zv-prod-${Date.now()}`,
      name: data.name || 'Untitled ZEVORA Piece',
      subtitle: data.subtitle || 'Luxury Edition',
      category: data.category || 'Accessories',
      price: Number(data.price) || 10000,
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      images: data.images && data.images.length > 0 ? data.images : [INITIAL_PRODUCTS[0].images[0]],
      description: data.description || 'Premium curated ZEVORA collection piece.',
      details: data.details || ['Hand-finished luxury', 'Tested for precision'],
      sizes: data.sizes || ['Standard'],
      colors: data.colors || [{ name: 'Obsidian Black', hex: '#050706' }],
      stock: data.stock !== undefined ? Number(data.stock) : 10,
      rating: 5.0,
      reviewCount: 1,
      sku: data.sku || `ZV-SKU-${Math.floor(100 + Math.random() * 900)}`,
      featured: Boolean(data.featured),
      bestSeller: Boolean(data.bestSeller),
      isNewArrival: Boolean(data.isNewArrival),
    };

    products.unshift(newProduct);

    safeDbAction(() => {
      return supabase.from('products').insert({
        id: newProduct.id,
        name: newProduct.name,
        subtitle: newProduct.subtitle,
        category: newProduct.category,
        price: newProduct.price,
        original_price: newProduct.originalPrice || null,
        images: newProduct.images,
        description: newProduct.description,
        details: newProduct.details,
        sizes: newProduct.sizes,
        colors: newProduct.colors,
        stock: newProduct.stock,
        rating: newProduct.rating,
        review_count: newProduct.reviewCount,
        featured: newProduct.featured,
        best_seller: newProduct.bestSeller,
        is_new_arrival: newProduct.isNewArrival,
        sku: newProduct.sku,
      });
    }, 'Insert Product');

    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
    };

    safeDbAction(() => {
      return supabase.from('products').update(updates).eq('id', id);
    }, 'Update Product');

    return products[index];
  },

  deleteProduct: (id: string) => {
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    safeDbAction(() => {
      return supabase.from('products').delete().eq('id', id);
    }, 'Delete Product');

    return products.length < initialLength;
  },

  // Reviews (Customer Feedback)
  getReviews: (productId?: string) => {
    if (productId) {
      return reviews.filter(r => r.productId === productId);
    }
    return [...reviews].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },

  addReview: (data: {
    productId?: string;
    author: string;
    location?: string;
    rating: number;
    comment: string;
  }) => {
    const id = `rev-${Date.now()}`;
    const createdAt = Date.now();
    const newReview: Review = {
      id,
      productId: data.productId,
      author: data.author,
      location: data.location || 'Pakistan',
      rating: Math.max(1, Math.min(5, data.rating)),
      comment: data.comment,
      verified: true,
      date: 'Just now',
      createdAt,
    };

    reviews.unshift(newReview);

    // Also update product review count and average rating
    if (data.productId) {
      const prod = products.find(p => p.id === data.productId);
      if (prod) {
        prod.reviewCount = (prod.reviewCount || 0) + 1;
        prod.rating = Number(((prod.rating * (prod.reviewCount - 1) + newReview.rating) / prod.reviewCount).toFixed(1));
      }
    }

    safeDbAction(() => {
      return supabase.from('reviews').insert({
        id: newReview.id,
        product_id: newReview.productId || null,
        author: newReview.author,
        location: newReview.location,
        rating: newReview.rating,
        comment: newReview.comment,
        verified: newReview.verified,
        created_at: newReview.createdAt,
      });
    }, 'Insert Review');

    return newReview;
  },

  // Payment Transactions
  getPaymentTransactions: () => {
    return [...paymentTransactions].sort((a, b) => b.createdAt - a.createdAt);
  },

  createPaymentTransaction: (payload: {
    orderId: string;
    customerEmail: string;
    paymentMethod: PaymentTransaction['paymentMethod'];
    amount: number;
    accountNumber?: string;
    transactionReference?: string;
    notes?: string;
  }) => {
    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn: PaymentTransaction = {
      id: txnId,
      orderId: payload.orderId,
      customerEmail: payload.customerEmail,
      paymentMethod: payload.paymentMethod,
      amount: payload.amount,
      currency: 'PKR',
      accountNumber: payload.accountNumber,
      transactionReference: payload.transactionReference,
      status: payload.paymentMethod === 'Cash on Delivery (COD)' ? 'Verified' : 'Pending',
      notes: payload.notes || `Payment via ${payload.paymentMethod}`,
      createdAt: Date.now(),
    };

    paymentTransactions.unshift(newTxn);

    safeDbAction(() => {
      return supabase.from('payment_transactions').insert({
        id: newTxn.id,
        order_id: newTxn.orderId,
        customer_email: newTxn.customerEmail,
        payment_method: newTxn.paymentMethod,
        amount: newTxn.amount,
        currency: newTxn.currency,
        account_number: newTxn.accountNumber || null,
        transaction_reference: newTxn.transactionReference || null,
        status: newTxn.status,
        notes: newTxn.notes || null,
        created_at: newTxn.createdAt,
      });
    }, 'Insert Payment Transaction');

    return newTxn;
  },

  // Orders
  getOrders: () => {
    return [...orders].sort((a, b) => b.createdAt - a.createdAt);
  },

  getOrderById: (id: string) => {
    return orders.find(o => o.id === id);
  },

  createOrder: (orderPayload: {
    items: Order['items'];
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
    promoCode?: string;
    paymentDetails?: { accountNumber?: string; transactionReference?: string };
    saveProfile?: boolean;
  }) => {
    if (!orderPayload.customer?.fullName?.trim()) {
      throw new Error('Customer full name is required');
    }
    if (!validateEmail(orderPayload.customer.email)) {
      throw new Error('A valid email address is required');
    }
    if (!validatePakistaniPhone(orderPayload.customer.phone)) {
      throw new Error('A valid Pakistani mobile number is required (e.g. 03001234567)');
    }
    if (!orderPayload.customer.address?.trim() || !orderPayload.customer.city?.trim()) {
      throw new Error('Delivery address and city are required');
    }
    if (!orderPayload.items || orderPayload.items.length === 0) {
      throw new Error('Cart cannot be empty when placing an order');
    }

    // Verify stock and update inventory
    for (const item of orderPayload.items) {
      const prod = products.find(p => p.id === item.product.id);
      if (!prod) {
        throw new Error(`Product ${item.product.name} no longer exists`);
      }
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stock}`);
      }
    }

    // Deduct stock
    for (const item of orderPayload.items) {
      const prod = products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stock -= item.quantity;
      }
    }

    const totals = calculateCartTotals(orderPayload.items, orderPayload.promoCode);
    const orderId = generateOrderId();
    const trackingNumber = generateTrackingNumber();

    // Auto-create payment transaction record
    const paymentTxn = storeDb.createPaymentTransaction({
      orderId,
      customerEmail: orderPayload.customer.email,
      paymentMethod: orderPayload.paymentMethod,
      amount: totals.total,
      accountNumber: orderPayload.paymentDetails?.accountNumber,
      transactionReference: orderPayload.paymentDetails?.transactionReference,
      notes: `Order settlement via ${orderPayload.paymentMethod}`,
    });

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: orderPayload.items,
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      discount: totals.discount,
      total: totals.total,
      customer: orderPayload.customer,
      paymentMethod: orderPayload.paymentMethod,
      status: 'Confirmed' as OrderStatus,
      trackingNumber,
      createdAt: Date.now(),
      paymentTransactionId: paymentTxn.id,
      paymentDetails: orderPayload.paymentDetails,
    };

    orders.unshift(newOrder);

    // Asynchronously insert into Supabase
    safeDbAction(() => {
      return supabase.from('orders').insert({
        id: newOrder.id,
        date: newOrder.date,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        shipping_fee: newOrder.shippingFee,
        discount: newOrder.discount,
        total: newOrder.total,
        customer: newOrder.customer,
        payment_method: newOrder.paymentMethod,
        status: newOrder.status,
        tracking_number: newOrder.trackingNumber,
        created_at: newOrder.createdAt,
      });
    }, 'Insert Order');

    // Customer Account & 1-Click Profile auto-save
    const cleanEmail = orderPayload.customer.email.toLowerCase().trim();
    let existingCust = customers.find(c => c.email.toLowerCase() === cleanEmail);

    if (existingCust) {
      if (!existingCust.savedOrders.includes(newOrder.id)) {
        existingCust.savedOrders.push(newOrder.id);
      }
      if (orderPayload.saveProfile) {
        existingCust.defaultAddress = orderPayload.customer;
        existingCust.savedPaymentMethod = orderPayload.paymentMethod;
        existingCust.savedPaymentAccount = orderPayload.paymentDetails?.accountNumber || orderPayload.customer.phone;
      }
      safeDbAction(() => {
        return supabase.from('customers').update({
          default_address: existingCust?.defaultAddress || existingCust?.address,
          saved_payment_method: existingCust?.savedPaymentMethod || null,
          saved_payment_account: existingCust?.savedPaymentAccount || null,
          saved_orders: existingCust?.savedOrders,
        }).eq('email', cleanEmail);
      }, 'Update Customer Orders');
    } else {
      const newCust: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: orderPayload.customer.fullName,
        email: cleanEmail,
        phone: orderPayload.customer.phone,
        defaultAddress: orderPayload.customer,
        address: orderPayload.customer,
        savedPaymentMethod: orderPayload.paymentMethod,
        savedPaymentAccount: orderPayload.paymentDetails?.accountNumber || orderPayload.customer.phone,
        savedOrders: [newOrder.id],
        createdAt: Date.now(),
      };
      customers.push(newCust);

      safeDbAction(() => {
        return supabase.from('customers').insert({
          id: newCust.id,
          name: newCust.name,
          email: newCust.email,
          phone: newCust.phone,
          default_address: newCust.defaultAddress,
          saved_payment_method: newCust.savedPaymentMethod,
          saved_payment_account: newCust.savedPaymentAccount,
          saved_orders: newCust.savedOrders,
        });
      }, 'Insert New Customer');
    }

    return newOrder;
  },

  updateOrderStatus: (id: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;

    safeDbAction(() => {
      return supabase.from('orders').update({ status }).eq('id', id);
    }, 'Update Order Status');

    return order;
  },

  // Customers & Auth
  getCustomers: () => [...customers],

  loginOrRegisterCustomer: (email: string, name?: string, phone?: string) => {
    if (!validateEmail(email)) {
      throw new Error('Valid email address is required');
    }

    const cleanEmail = email.trim().toLowerCase();
    let cust = customers.find(c => c.email.toLowerCase() === cleanEmail);

    if (!cust) {
      cust = {
        id: `cust-${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: phone || '',
        savedOrders: [],
        createdAt: Date.now(),
      };
      customers.push(cust);

      safeDbAction(() => {
        return supabase.from('customers').insert({
          id: cust!.id,
          name: cust!.name,
          email: cust!.email,
          phone: cust!.phone,
          saved_orders: cust!.savedOrders,
        });
      }, 'Insert Customer');
    }

    return cust;
  },

  updateCustomerProfile: (
    email: string,
    updates: {
      name?: string;
      phone?: string;
      defaultAddress?: CustomerAddress;
      savedPaymentMethod?: CustomerUser['savedPaymentMethod'];
      savedPaymentAccount?: string;
    }
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    let cust = customers.find(c => c.email.toLowerCase() === cleanEmail);
    if (!cust) return null;

    if (updates.name) cust.name = updates.name;
    if (updates.phone) cust.phone = updates.phone;
    if (updates.defaultAddress) {
      cust.defaultAddress = updates.defaultAddress;
      cust.address = updates.defaultAddress;
    }
    if (updates.savedPaymentMethod) cust.savedPaymentMethod = updates.savedPaymentMethod;
    if (updates.savedPaymentAccount) cust.savedPaymentAccount = updates.savedPaymentAccount;

    safeDbAction(() => {
      return supabase.from('customers').update({
        name: cust?.name,
        phone: cust?.phone,
        default_address: cust?.defaultAddress,
        saved_payment_method: cust?.savedPaymentMethod,
        saved_payment_account: cust?.savedPaymentAccount,
      }).eq('email', cleanEmail);
    }, 'Update Customer Profile');

    return cust;
  },

  getCustomerProfile: (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cust = customers.find(c => c.email.toLowerCase() === cleanEmail);
    if (!cust) return null;

    const customerOrders = orders.filter(
      o => o.customer.email.toLowerCase() === cleanEmail || cust.savedOrders.includes(o.id)
    );

    return {
      ...cust,
      orders: customerOrders,
    };
  },

  // Inquiries / Contact
  saveContactMessage: (msg: { name: string; email: string; orderId?: string; message: string }) => {
    if (!msg.name?.trim() || !msg.message?.trim()) {
      throw new Error('Name and message are required');
    }
    if (!validateEmail(msg.email)) {
      throw new Error('A valid email address is required');
    }

    const entry: ContactInquiry = {
      id: `inq-${Date.now()}`,
      name: msg.name.trim(),
      email: msg.email.trim(),
      orderId: msg.orderId?.trim() || undefined,
      message: msg.message.trim(),
      createdAt: Date.now(),
      status: 'New',
    };

    contactInquiries.unshift(entry);

    safeDbAction(() => {
      return supabase.from('contact_inquiries').insert({
        id: entry.id,
        name: entry.name,
        email: entry.email,
        order_id: entry.orderId || null,
        message: entry.message,
        status: entry.status,
        created_at: entry.createdAt,
      });
    }, 'Insert Inquiry');

    return entry;
  },

  getContactMessages: () => [...contactInquiries],

  // Newsletter
  subscribeNewsletter: (email: string) => {
    if (!validateEmail(email)) {
      throw new Error('A valid email address is required');
    }
    const cleanEmail = email.trim().toLowerCase();
    const exists = newsletterSubscribers.find(s => s.email === cleanEmail);

    if (!exists) {
      newsletterSubscribers.push({ email: cleanEmail, subscribedAt: Date.now() });

      safeDbAction(() => {
        return supabase.from('newsletter_subscribers').insert({
          email: cleanEmail,
          subscribed_at: Date.now(),
        });
      }, 'Insert Subscriber');
    }

    return {
      success: true,
      email: cleanEmail,
      promoCode: 'ZEVORA10',
      discountPercent: 10,
      message: 'Subscribed to ZEVORA Circle with 10% welcome privilege',
    };
  },

  // Analytics & Stats
  getAdminStats: () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const lowStockCount = products.filter(p => p.stock <= 5).length;
    const totalCustomers = customers.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;

    return {
      totalOrders,
      totalRevenue,
      lowStockCount,
      totalCustomers,
      pendingOrders,
      totalProducts: products.length,
      recentOrders: orders.slice(0, 5),
      paymentTransactionsCount: paymentTransactions.length,
      totalReviews: reviews.length,
    };
  },
};
