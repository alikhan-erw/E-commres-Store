export type ProductCategory = 'Shoes' | 'Clothing' | 'Bags' | 'Watches' | 'Accessories';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ProductVariant {
  sizes?: string[];
  colors?: { name: string; hex: string }[];
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  createdAt?: number;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerEmail: string;
  paymentMethod: 'Cash on Delivery (COD)' | 'Credit / Debit Card' | 'JazzCash / EasyPaisa' | 'Direct Bank Transfer';
  amount: number;
  currency: string;
  accountNumber?: string; // JazzCash/EasyPaisa wallet or bank account
  transactionReference?: string; // JazzCash TID / Bank Transfer Ref
  status: 'Pending' | 'Verified' | 'Completed' | 'Failed';
  notes?: string;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number; // in PKR
  originalPrice?: number; // in PKR
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestSeller?: boolean;
  isNewArrival?: boolean;
  sku: string;
}

export interface CartItem {
  cartId: string; // unique item id in cart (product.id + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  customer: CustomerAddress;
  paymentMethod: 'Cash on Delivery (COD)' | 'Credit / Debit Card' | 'JazzCash / EasyPaisa' | 'Direct Bank Transfer';
  status: OrderStatus;
  trackingNumber: string;
  createdAt: number;
  paymentTransactionId?: string;
  paymentDetails?: {
    accountNumber?: string;
    transactionReference?: string;
  };
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: CustomerAddress;
  defaultAddress?: CustomerAddress;
  savedPaymentMethod?: 'Cash on Delivery (COD)' | 'Credit / Debit Card' | 'JazzCash / EasyPaisa' | 'Direct Bank Transfer';
  savedPaymentAccount?: string;
  savedOrders: string[]; // Order IDs
  createdAt?: number;
}

export interface FilterOptions {
  category: ProductCategory | 'All';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  inStockOnly: boolean;
}
