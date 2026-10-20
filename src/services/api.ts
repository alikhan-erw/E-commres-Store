import type {
  Product,
  Order,
  CustomerUser,
  OrderStatus,
  CartItem,
  CustomerAddress,
  Review,
  PaymentTransaction,
} from '../types/index.ts';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Products
  async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    inStockOnly?: boolean;
  }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.inStockOnly) params.set('inStockOnly', 'true');

    const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
    return handleResponse<Product[]>(res);
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`);
    return handleResponse<Product>(res);
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders`);
    return handleResponse<Order[]>(res);
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(id)}`);
    return handleResponse<Order>(res);
  },

  async createOrder(payload: {
    items: CartItem[];
    customer: CustomerAddress;
    paymentMethod: Order['paymentMethod'];
    promoCode?: string;
  }): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Order>(res);
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse<Order>(res);
  },

  // Promo
  async validatePromoCode(code: string, subtotal: number, items?: CartItem[]): Promise<{
    code: string;
    discountAmount: number;
    discountPercent: number;
    message: string;
    cartTotals?: any;
  }> {
    const res = await fetch(`${BASE_URL}/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal, items }),
    });
    return handleResponse(res);
  },

  // Auth & Profile
  async loginCustomer(email: string, name?: string, phone?: string): Promise<CustomerUser> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, phone }),
    });
    return handleResponse<CustomerUser>(res);
  },

  async getCustomerProfile(email: string): Promise<CustomerUser & { orders: Order[] }> {
    const res = await fetch(`${BASE_URL}/auth/profile?email=${encodeURIComponent(email)}`);
    return handleResponse<CustomerUser & { orders: Order[] }>(res);
  },

  // Contact
  async sendContactInquiry(inquiry: {
    name: string;
    email: string;
    orderId?: string;
    message: string;
  }): Promise<{ ticketId: string; message: string }> {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    return handleResponse(res);
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{
    success: boolean;
    email: string;
    promoCode: string;
    discountPercent: number;
    message: string;
  }> {
    const res = await fetch(`${BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  // Admin Stats
  async getAdminStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    lowStockCount: number;
    totalCustomers: number;
    pendingOrders: number;
    totalProducts: number;
    recentOrders: Order[];
  }> {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return handleResponse(res);
  },

  // Customer Profile & 1-Click Checkout Preferences
  async updateCustomerProfile(
    email: string,
    updates: {
      name?: string;
      phone?: string;
      defaultAddress?: CustomerAddress;
      savedPaymentMethod?: CustomerUser['savedPaymentMethod'];
      savedPaymentAccount?: string;
    }
  ): Promise<CustomerUser> {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...updates }),
    });
    return handleResponse<CustomerUser>(res);
  },

  // Customer Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    const url = productId
      ? `${BASE_URL}/reviews?productId=${encodeURIComponent(productId)}`
      : `${BASE_URL}/reviews`;
    const res = await fetch(url);
    return handleResponse<Review[]>(res);
  },

  async addReview(data: {
    productId?: string;
    author: string;
    location?: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Review>(res);
  },

  // Payment Transactions
  async getPaymentTransactions(): Promise<PaymentTransaction[]> {
    const res = await fetch(`${BASE_URL}/payments`);
    return handleResponse<PaymentTransaction[]>(res);
  },

  async createPaymentTransaction(payload: {
    orderId: string;
    customerEmail: string;
    paymentMethod: PaymentTransaction['paymentMethod'];
    amount: number;
    accountNumber?: string;
    transactionReference?: string;
    notes?: string;
  }): Promise<PaymentTransaction> {
    const res = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<PaymentTransaction>(res);
  },
};

