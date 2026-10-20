import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Product,
  CartItem,
  Order,
  CustomerUser,
  ProductCategory,
  OrderStatus,
  Review,
  PaymentTransaction,
  CustomerAddress,
} from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/products.ts';
import {
  calculateCartTotals,
  addOrUpdateCartItem,
  updateItemQuantity,
  CartTotals,
} from '../utils/cartLogic.ts';
import { generateOrderId, generateTrackingNumber } from '../utils/format.ts';
import { api } from '../services/api.ts';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'alert';
}

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, delta: number) => void;

  // Cart
  cart: CartItem[];
  cartTotals: CartTotals;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  addToCart: (product: Product, size: string, color: { name: string; hex: string }, quantity?: number) => boolean;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'createdAt' | 'trackingNumber'> & {
    saveProfile?: boolean;
    paymentDetails?: { accountNumber?: string; transactionReference?: string };
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // Customer Reviews
  reviews: Review[];
  addReview: (reviewData: {
    productId?: string;
    author: string;
    location?: string;
    rating: number;
    comment: string;
  }) => Promise<void>;

  // Customer Profile & 1-Click Fast Checkout
  customer: CustomerUser | null;
  loginCustomer: (email: string) => void;
  logoutCustomer: () => void;
  updateCustomerProfile: (updates: {
    name?: string;
    phone?: string;
    defaultAddress?: CustomerAddress;
    savedPaymentMethod?: CustomerUser['savedPaymentMethod'];
    savedPaymentAccount?: string;
  }) => Promise<void>;

  // Navigation & Modals
  activePage: 'home' | 'shop' | 'collections' | 'about' | 'contact' | 'admin';
  setActivePage: (page: 'home' | 'shop' | 'collections' | 'about' | 'contact' | 'admin') => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'alert') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'NX-89210',
    date: '2026-10-12',
    createdAt: Date.now() - 3 * 86400000,
    items: [
      {
        cartId: 'nx-shoe-01-EU 42-Obsidian',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'EU 42',
        selectedColor: { name: 'Obsidian & Neon Green', hex: '#35F582' },
        quantity: 1,
      },
    ],
    subtotal: 24500,
    shippingFee: 0,
    discount: 0,
    total: 24500,
    customer: {
      fullName: 'Kamran Shah',
      email: 'kamran.shah@gmail.com',
      phone: '03008456123',
      address: 'House 14-B, Street 9, DHA Phase 5',
      city: 'Lahore',
      postalCode: '54000',
      country: 'Pakistan',
    },
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Delivered',
    trackingNumber: 'TCS-8921470',
  },
  {
    id: 'NX-91402',
    date: '2026-10-14',
    createdAt: Date.now() - 1 * 86400000,
    items: [
      {
        cartId: 'nx-cloth-01-L-Pitch Black',
        product: INITIAL_PRODUCTS[3],
        selectedSize: 'L',
        selectedColor: { name: 'Pitch Black', hex: '#050706' },
        quantity: 1,
      },
      {
        cartId: 'nx-acc-02-Slim-Carbon',
        product: INITIAL_PRODUCTS[9],
        selectedSize: 'Slim (62mm x 95mm)',
        selectedColor: { name: 'Matte Carbon Weave', hex: '#141715' },
        quantity: 1,
      },
    ],
    subtotal: 48000,
    shippingFee: 0,
    discount: 4800,
    total: 43200,
    customer: {
      fullName: 'Sara Hashmi',
      email: 'sara.hashmi@yahoo.com',
      phone: '03214589201',
      address: 'Apartment 702, Ocean Towers, Clifton Block 9',
      city: 'Karachi',
      postalCode: '75600',
      country: 'Pakistan',
    },
    paymentMethod: 'Credit / Debit Card',
    status: 'Processing',
    trackingNumber: 'LEOPARDS-3982104',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  // Promo code
  const [promoCode, setPromoCode] = useState<string>('');

  // Active page & navigation
  const [activePage, setActivePage] = useState<'home' | 'shop' | 'collections' | 'about' | 'contact' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Customer Auth
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('nexora_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch initial data from backend API
  useEffect(() => {
    let mounted = true;
    api.getProducts().then(data => {
      if (mounted && data && data.length > 0) {
        setProducts(data);
      }
    }).catch(err => {
      console.warn('Backend products fetch:', err.message);
    });

    api.getOrders().then(data => {
      if (mounted && data && data.length > 0) {
        setOrders(data);
      }
    }).catch(err => {
      console.warn('Backend orders fetch:', err.message);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem('nexora_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('nexora_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('nexora_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('nexora_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Persist customer
  useEffect(() => {
    try {
      if (customer) {
        localStorage.setItem('nexora_customer', JSON.stringify(customer));
      } else {
        localStorage.removeItem('nexora_customer');
      }
    } catch {
      // ignore
    }
  }, [customer]);

  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'alert' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const cartTotals = calculateCartTotals(cart, promoCode);

  const applyPromoCode = (code: string): boolean => {
    setPromoCode(code);
    const result = calculateCartTotals(cart, code);
    if (result.discount > 0) {
      addToast('Promo Code Applied', `Saved ₨ ${result.discount.toLocaleString()}`, 'success');
      return true;
    } else {
      addToast('Invalid Promo Code', 'Try ZEVORA10 for 10% off', 'alert');
      return false;
    }
  };

  const addToCart = (
    product: Product,
    size: string,
    color: { name: string; hex: string },
    quantity = 1
  ): boolean => {
    if (product.stock <= 0) {
      addToast('Out of Stock', 'This item is currently unavailable.', 'alert');
      return false;
    }

    const cartId = `${product.id}-${size}-${color.name}`;
    const newItem: CartItem = {
      cartId,
      product,
      selectedSize: size,
      selectedColor: color,
      quantity,
    };

    const { items, wasCapped } = addOrUpdateCartItem(cart, newItem);
    setCart(items);

    if (wasCapped) {
      addToast('Cart Updated', `Max available stock reached (${product.stock} units)`, 'info');
    } else {
      addToast('Added to Cart', `${product.name} (${size})`, 'success');
    }
    return true;
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    setCart(prev => updateItemQuantity(prev, cartId, quantity));
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from Wishlist', undefined, 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to Wishlist', undefined, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const id = `zv-${productData.category.toLowerCase().slice(0, 3)}-${Date.now().toString(36)}`;
    const newProduct: Product = { ...productData, id };
    api.createProduct(newProduct).catch(err => console.warn('Backend addProduct sync:', err.message));
    setProducts(prev => [newProduct, ...prev]);
    addToast('Product Added', newProduct.name, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    api.updateProduct(id, updates).catch(err => console.warn('Backend updateProduct sync:', err.message));
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    addToast('Product Updated', undefined, 'success');
  };

  const deleteProduct = (id: string) => {
    api.deleteProduct(id).catch(err => console.warn('Backend deleteProduct sync:', err.message));
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('Product Removed', undefined, 'info');
  };

  const updateProductStock = (id: string, delta: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Place Order
  const placeOrder = (
    orderData: Omit<Order, 'id' | 'date' | 'createdAt' | 'trackingNumber'>
  ): Order => {
    const id = generateOrderId();
    const trackingNumber = generateTrackingNumber();
    const newOrder: Order = {
      ...orderData,
      id,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      trackingNumber,
      status: 'Confirmed',
    };

    // Decrement stock for ordered items
    orderData.items.forEach(item => {
      updateProductStock(item.product.id, -item.quantity);
    });

    // Sync order creation with backend REST API
    api.createOrder({
      items: orderData.items,
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod,
      promoCode,
    }).catch(err => console.warn('Backend order sync:', err.message));

    setOrders(prev => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    clearCart();

    // If logged in, record in customer history
    if (customer) {
      setCustomer(prev =>
        prev
          ? {
              ...prev,
              savedOrders: [id, ...prev.savedOrders],
            }
          : null
      );
    }

    addToast('Order Placed Successfully', `Order #${newOrder.id} confirmed.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    // Sync with backend API
    api.updateOrderStatus(orderId, status).catch(err => console.warn('Backend status sync:', err.message));

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    addToast('Order Status Updated', `#${orderId} -> ${status}`, 'info');
  };

  // Customer Auth
  const loginCustomer = (email: string) => {
    const existing = orders.find(o => o.customer.email.toLowerCase() === email.toLowerCase());
    const name = existing ? existing.customer.fullName : email.split('@')[0];
    const customerUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      phone: existing?.customer.phone,
      address: existing?.customer,
      savedOrders: orders
        .filter(o => o.customer.email.toLowerCase() === email.toLowerCase())
        .map(o => o.id),
    };
    setCustomer(customerUser);
    addToast('Welcome back', customerUser.name, 'success');
  };

  const logoutCustomer = () => {
    setCustomer(null);
    addToast('Logged out', undefined, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        cart,
        cartTotals,
        promoCode,
        applyPromoCode,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        lastCompletedOrder,
        setLastCompletedOrder,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeProductModal,
        setActiveProductModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminUnlocked,
        setIsAdminUnlocked,
        customer,
        loginCustomer,
        logoutCustomer,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
