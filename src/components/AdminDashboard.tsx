import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle,
  X,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import type { Product, Order, OrderStatus, ProductCategory } from '../types/index.ts';
import { formatPKR } from '../utils/format.ts';

const CATEGORIES: ProductCategory[] = ['Shoes', 'Clothing', 'Bags', 'Watches', 'Accessories'];
const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    orders,
    updateOrderStatus,
    isAdminUnlocked,
    setIsAdminUnlocked,
    setActivePage,
  } = useStore();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Product management modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: '',
    category: 'Shoes' as ProductCategory,
    price: 15000,
    originalPrice: 18000,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    description: '',
    sku: 'NX-NEW-01',
    sizes: 'S, M, L',
    colors: 'Obsidian Black',
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin' || pinInput === 'admin123' || pinInput === '1234') {
      setIsAdminUnlocked(true);
      setPinError('');
    } else {
      setPinError('Invalid Security Passcode. Try: admin123');
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const pendingFulfillments = orders.filter(o => o.status === 'Confirmed' || o.status === 'Processing').length;
  const lowStockProducts = products.filter(p => p.stock <= 4);

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchCity = o.customer.city.toLowerCase().includes(q);
      const matchTracking = o.trackingNumber.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchCity && !matchTracking) return false;
    }
    return true;
  });

  // Handle Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = productForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = productForm.colors.split(',').map(c => ({
      name: c.trim(),
      hex: '#35F582',
    }));

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        subtitle: productForm.subtitle,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        description: productForm.description,
        sizes: sizesArray,
        sku: productForm.sku,
      });
    } else {
      addProduct({
        name: productForm.name,
        subtitle: productForm.subtitle,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        images: [productForm.imageUrl],
        description: productForm.description || 'Premium curated Zevora collection item.',
        details: ['Precision crafted luxury', 'Quality tested'],
        sizes: sizesArray.length > 0 ? sizesArray : ['Standard'],
        colors: colorsArray.length > 0 ? colorsArray : [{ name: 'Default', hex: '#000000' }],
        rating: 5.0,
        reviewCount: 1,
        sku: productForm.sku,
        featured: false,
        bestSeller: false,
        isNewArrival: true,
      });
    }

    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      subtitle: p.subtitle,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock,
      imageUrl: p.images[0] || '',
      description: p.description,
      sku: p.sku,
      sizes: p.sizes.join(', '),
      colors: p.colors.map(c => c.name).join(', '),
    });
    setIsProductModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      subtitle: '',
      category: 'Shoes',
      price: 18500,
      originalPrice: 22000,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      description: 'Engineered high-performance luxury design.',
      sku: `NX-NEW-${Math.floor(100 + Math.random() * 900)}`,
      sizes: 'S, M, L, XL',
      colors: 'Obsidian Black, Neon Green',
    });
    setIsProductModalOpen(true);
  };

  return (
    <section className="min-h-screen py-24 bg-[#050706] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* If Locked, show Security PIN Gate */}
        {!isAdminUnlocked ? (
          <div className="max-w-md mx-auto py-16">
            <div className="bg-[#101512] rounded-3xl p-8 border border-[#252D28] text-center shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
                <Lock className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-extrabold text-white">Store Administration Gate</h2>
              <p className="text-xs text-[#A5ADA8] mt-1 mb-6">
                Enforced access control. Authenticate to manage inventory, customer orders, and sales reports.
              </p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="text-left">
                  <label className="block text-xs font-mono text-[#A5ADA8] mb-1">
                    Security Passcode
                  </label>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={e => {
                      setPinInput(e.target.value);
                      setPinError('');
                    }}
                    placeholder="Enter passcode (e.g. admin123)"
                    className="w-full px-4 py-3 rounded-xl bg-[#050706] border border-[#252D28] focus:border-amber-400 text-white font-mono text-center text-sm focus:outline-none"
                  />
                  {pinError && <p className="text-red-400 text-xs mt-1.5">{pinError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg"
                >
                  Authorize Entry
                </button>
              </form>

              {/* Quick Demo Shortcut */}
              <div className="mt-6 pt-4 border-t border-[#252D28]">
                <button
                  type="button"
                  onClick={() => setIsAdminUnlocked(true)}
                  className="text-xs text-[#35F582] hover:underline font-mono"
                >
                  Click here for instant demo bypass
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* UNLOCKED DASHBOARD */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252D28] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#35F582] animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#35F582] font-semibold">
                    Admin Session Active
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Zevora Operations Portal
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActivePage('home')}
                  className="px-4 py-2 rounded-xl bg-[#101512] hover:bg-[#161D19] border border-[#252D28] text-xs font-semibold text-white"
                >
                  View Live Storefront
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminUnlocked(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#101512] hover:bg-red-500/10 border border-[#252D28] text-xs font-semibold text-red-400"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="bg-[#101512] p-5 sm:p-6 rounded-2xl border border-[#252D28]">
                <div className="flex items-center justify-between text-[#A5ADA8] mb-3">
                  <span className="text-xs font-mono uppercase">Total Gross Sales</span>
                  <div className="w-8 h-8 rounded-lg bg-[#35F582]/10 text-[#35F582] flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {formatPKR(totalRevenue)}
                </div>
                <span className="text-[11px] text-[#35F582] font-mono mt-1 block">
                  ↑ +18.4% vs last cycle
                </span>
              </div>

              <div className="bg-[#101512] p-5 sm:p-6 rounded-2xl border border-[#252D28]">
                <div className="flex items-center justify-between text-[#A5ADA8] mb-3">
                  <span className="text-xs font-mono uppercase">Total Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {orders.length}
                </div>
                <span className="text-[11px] text-[#A5ADA8] font-mono mt-1 block">
                  {pendingFulfillments} currently in fulfillment
                </span>
              </div>

              <div className="bg-[#101512] p-5 sm:p-6 rounded-2xl border border-[#252D28]">
                <div className="flex items-center justify-between text-[#A5ADA8] mb-3">
                  <span className="text-xs font-mono uppercase">Active Products</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#35F582] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {products.length}
                </div>
                <span className="text-[11px] text-[#A5ADA8] font-mono mt-1 block">
                  Across 5 luxury categories
                </span>
              </div>

              <div className="bg-[#101512] p-5 sm:p-6 rounded-2xl border border-[#252D28]">
                <div className="flex items-center justify-between text-[#A5ADA8] mb-3">
                  <span className="text-xs font-mono uppercase">Low Stock Alerts</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-mono font-extrabold text-amber-400">
                  {lowStockProducts.length}
                </div>
                <span className="text-[11px] text-amber-400/80 font-mono mt-1 block">
                  Items requiring restocking
                </span>
              </div>

            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#252D28] gap-4 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'orders'
                    ? 'border-[#35F582] text-white'
                    : 'border-transparent text-[#A5ADA8] hover:text-white'
                }`}
              >
                Order Management ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'products'
                    ? 'border-[#35F582] text-white'
                    : 'border-transparent text-[#A5ADA8] hover:text-white'
                }`}
              >
                Product Catalog ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'analytics'
                    ? 'border-[#35F582] text-white'
                    : 'border-transparent text-[#A5ADA8] hover:text-white'
                }`}
              >
                Sales & Category Reports
              </button>
            </div>

            {/* TAB 1: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                
                {/* Search & Status Filter */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101512] p-3 rounded-2xl border border-[#252D28]">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-[#A5ADA8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      placeholder="Search orders, customers, cities..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-xs text-white placeholder-[#A5ADA8]/60 focus:outline-none focus:border-[#35F582]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-3.5 h-3.5 text-[#A5ADA8]" />
                    <select
                      value={orderStatusFilter}
                      onChange={e => setOrderStatusFilter(e.target.value)}
                      className="bg-[#050706] border border-[#252D28] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      {STATUSES.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-[#101512] rounded-2xl border border-[#252D28] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0c100e] text-[#A5ADA8] font-mono uppercase text-[10px] border-b border-[#252D28]">
                        <tr>
                          <th className="p-4">Order ID & Date</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Items</th>
                          <th className="p-4">Total (PKR)</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Status & Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#252D28]/60">
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map(order => {
                            const isExpanded = expandedOrderId === order.id;
                            return (
                              <React.Fragment key={order.id}>
                                <tr className="hover:bg-[#161D19]/60 transition-colors">
                                  <td className="p-4 font-mono font-bold text-white">
                                    #{order.id}
                                    <span className="block text-[10px] text-[#A5ADA8] font-normal">
                                      {order.date}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="font-bold text-white">{order.customer.fullName}</div>
                                    <div className="text-[11px] text-[#A5ADA8]">{order.customer.phone}</div>
                                  </td>
                                  <td className="p-4 text-[#A5ADA8]">{order.customer.city}</td>
                                  <td className="p-4 text-[#A5ADA8]">
                                    {order.items.reduce((s, i) => s + i.quantity, 0)} units
                                  </td>
                                  <td className="p-4 font-mono font-bold text-[#35F582]">
                                    {formatPKR(order.total)}
                                  </td>
                                  <td className="p-4 text-[11px] text-[#A5ADA8]">
                                    {order.paymentMethod}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      <select
                                        value={order.status}
                                        onChange={e =>
                                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                                        }
                                        className="bg-[#050706] border border-[#252D28] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#35F582]"
                                      >
                                        {STATUSES.map(s => (
                                          <option key={s} value={s} className="bg-[#101512] text-white">
                                            {s}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedOrderId(isExpanded ? null : order.id)
                                        }
                                        className="p-1 rounded text-[#A5ADA8] hover:text-white"
                                        aria-label="Expand order details"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Expanded order row */}
                                {isExpanded && (
                                  <tr className="bg-[#080b09]">
                                    <td colSpan={7} className="p-4 text-xs space-y-2 border-b border-[#252D28]">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <span className="font-mono text-[#35F582] uppercase text-[10px] block">
                                            Delivery Address
                                          </span>
                                          <p className="text-white">{order.customer.address}</p>
                                          <p className="text-[#A5ADA8]">
                                            {order.customer.city}, {order.customer.postalCode}
                                          </p>
                                          {order.customer.notes && (
                                            <p className="text-amber-300 italic text-[11px] mt-1">
                                              Note: "{order.customer.notes}"
                                            </p>
                                          )}
                                        </div>

                                        <div>
                                          <span className="font-mono text-[#35F582] uppercase text-[10px] block">
                                            Tracking & Logistics
                                          </span>
                                          <p className="font-mono text-white">
                                            Tracking #: {order.trackingNumber}
                                          </p>
                                          <p className="text-[#A5ADA8]">Carrier: TCS Express Overnight</p>
                                        </div>

                                        <div>
                                          <span className="font-mono text-[#35F582] uppercase text-[10px] block">
                                            Consignment Items
                                          </span>
                                          {order.items.map(it => (
                                            <p key={it.cartId} className="text-white">
                                              • {it.quantity}x {it.product.name} ({it.selectedSize}) - {formatPKR(it.product.price)}
                                            </p>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-[#A5ADA8]">
                              No orders found matching filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#A5ADA8]">
                    Manage active store inventory, adjust live prices in PKR, and monitor stock availability.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="px-4 py-2 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(53,245,130,0.3)]"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Create New Product</span>
                  </button>
                </div>

                <div className="bg-[#101512] rounded-2xl border border-[#252D28] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0c100e] text-[#A5ADA8] font-mono uppercase text-[10px] border-b border-[#252D28]">
                        <tr>
                          <th className="p-4">Item</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price (PKR)</th>
                          <th className="p-4">Stock Control</th>
                          <th className="p-4">SKU</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#252D28]/60">
                        {products.map(product => (
                          <tr key={product.id} className="hover:bg-[#161D19]/60 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded-lg bg-black"
                                />
                                <div>
                                  <span className="font-bold text-white block">{product.name}</span>
                                  <span className="text-[11px] text-[#A5ADA8]">{product.subtitle}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#050706] border border-[#252D28] text-[#A5ADA8] font-mono text-[11px]">
                                {product.category}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-white">
                              {formatPKR(product.price)}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateProductStock(product.id, -1)}
                                  className="w-6 h-6 rounded bg-[#050706] border border-[#252D28] text-white hover:bg-[#161D19] flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <span
                                  className={`font-mono font-bold min-w-[20px] text-center ${
                                    product.stock <= 4 ? 'text-amber-400' : 'text-[#35F582]'
                                  }`}
                                >
                                  {product.stock}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateProductStock(product.id, 1)}
                                  className="w-6 h-6 rounded bg-[#050706] border border-[#252D28] text-white hover:bg-[#161D19] flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[#A5ADA8]">{product.sku}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(product)}
                                  className="p-1.5 rounded-lg bg-[#050706] hover:bg-[#161D19] border border-[#252D28] text-white hover:text-[#35F582]"
                                  aria-label="Edit product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteProduct(product.id)}
                                  className="p-1.5 rounded-lg bg-[#050706] hover:bg-red-500/10 border border-[#252D28] text-[#A5ADA8] hover:text-red-400"
                                  aria-label="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: ANALYTICS & REPORTS */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Category Revenue Distribution */}
                <div className="bg-[#101512] p-6 rounded-2xl border border-[#252D28] space-y-4">
                  <h3 className="text-sm font-bold text-white">Revenue by Category</h3>
                  <div className="space-y-3">
                    {CATEGORIES.map(cat => {
                      const catRevenue = orders
                        .filter(o => o.status !== 'Cancelled')
                        .reduce((sum, o) => {
                          const catItemsTotal = o.items
                            .filter(i => i.product.category === cat)
                            .reduce((isum, i) => isum + i.product.price * i.quantity, 0);
                          return sum + catItemsTotal;
                        }, 0);

                      const percent = totalRevenue > 0 ? Math.round((catRevenue / totalRevenue) * 100) : 0;

                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white font-medium">{cat}</span>
                            <span className="font-mono text-[#A5ADA8]">
                              {formatPKR(catRevenue)} ({percent}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#050706] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#35F582]"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Operations & Shipping Metrics */}
                <div className="bg-[#101512] p-6 rounded-2xl border border-[#252D28] space-y-4">
                  <h3 className="text-sm font-bold text-white">Logistics Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#050706] border border-[#252D28]">
                      <span className="text-[10px] font-mono text-[#A5ADA8] uppercase block">
                        Average Dispatch Time
                      </span>
                      <span className="text-xl font-mono font-extrabold text-[#35F582]">
                        14.2 Hours
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#050706] border border-[#252D28]">
                      <span className="text-[10px] font-mono text-[#A5ADA8] uppercase block">
                        COD Delivery Success Rate
                      </span>
                      <span className="text-xl font-mono font-extrabold text-[#35F582]">
                        98.4%
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#050706] border border-[#252D28]">
                      <span className="text-[10px] font-mono text-[#A5ADA8] uppercase block">
                        Customer Return Rate
                      </span>
                      <span className="text-xl font-mono font-extrabold text-white">
                        0.9%
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#050706] border border-[#252D28]">
                      <span className="text-[10px] font-mono text-[#A5ADA8] uppercase block">
                        Active Concierge Inquiries
                      </span>
                      <span className="text-xl font-mono font-extrabold text-white">
                        3
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* CREATE / EDIT PRODUCT MODAL */}
            {isProductModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                <div 
                  className="relative w-full max-w-lg bg-[#0e120f] border border-[#252D28] rounded-3xl p-6 sm:p-7 shadow-2xl my-auto space-y-4 text-xs"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#252D28]">
                    <h3 className="text-base font-bold text-white">
                      {editingProductId ? 'Edit Product' : 'Create New Luxury Item'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="p-1 rounded-lg text-[#A5ADA8] hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-3">
                    <div>
                      <label className="block text-[#A5ADA8] mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g. Zevora Apex Velocity"
                        className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white focus:outline-none focus:border-[#35F582]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A5ADA8] mb-1">Subtitle / Material Tagline</label>
                      <input
                        type="text"
                        value={productForm.subtitle}
                        onChange={e => setProductForm({ ...productForm, subtitle: e.target.value })}
                        placeholder="e.g. Carbon Fiber & Italian Calfskin"
                        className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white focus:outline-none focus:border-[#35F582]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#A5ADA8] mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white focus:outline-none cursor-pointer"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#A5ADA8] mb-1">SKU</label>
                        <input
                          type="text"
                          value={productForm.sku}
                          onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[#A5ADA8] mb-1">Price (PKR)</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#A5ADA8] mb-1">Original Price</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={e => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white font-mono focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#A5ADA8] mb-1">Stock</label>
                        <input
                          type="number"
                          required
                          value={productForm.stock}
                          onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#A5ADA8] mb-1">High-Res Image URL</label>
                      <input
                        type="url"
                        value={productForm.imageUrl}
                        onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white text-[11px] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A5ADA8] mb-1">Sizes (comma-separated)</label>
                      <input
                        type="text"
                        value={productForm.sizes}
                        onChange={e => setProductForm({ ...productForm, sizes: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] text-white focus:outline-none"
                      />
                    </div>

                    <div className="pt-3 border-t border-[#252D28] flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-[#101512] text-[#A5ADA8] hover:text-white border border-[#252D28]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#35F582] text-black font-extrabold hover:bg-[#2ed672] transition-colors"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
