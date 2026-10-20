import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Search, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import type { ProductCategory } from '../types/index.ts';

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Shoes',
  'Clothing',
  'Bags',
  'Watches',
  'Accessories',
];

interface ProductGridProps {
  initialTab?: 'all' | 'bestSellers' | 'newArrivals';
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  initialTab = 'all',
  title = 'The Zevora Catalog',
  subtitle = 'Precision-engineered luxury essentials. Stocked locally and shipped across Pakistan & worldwide.',
}) => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'bestSellers' | 'newArrivals'>(initialTab);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(150000);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (activeTab === 'bestSellers' && !product.bestSeller) return false;
      if (activeTab === 'newArrivals' && !product.isNewArrival) return false;

      // In stock
      if (inStockOnly && product.stock <= 0) return false;

      // Price limit
      if (product.price > priceMax) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSub = product.subtitle.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesCat && !matchesSku) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // featured default
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, activeTab, inStockOnly, priceMax, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setActiveTab('all');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setPriceMax(150000);
  };

  return (
    <section id="shop-section" className="py-20 bg-[#050706] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101512] border border-[#252D28] text-xs font-mono text-[#35F582] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]"></span>
            Authentic Luxury Inventory
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A5ADA8]">
            {subtitle}
          </p>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-[#101512] border border-[#252D28] rounded-2xl p-4 mb-8 space-y-4">
          
          {/* Top row: Tab Switcher & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* View Tabs */}
            <div className="flex items-center p-1 bg-[#050706] rounded-xl border border-[#252D28] self-start">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#35F582] text-black shadow-sm'
                    : 'text-[#A5ADA8] hover:text-white'
                }`}
              >
                All Products ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bestSellers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'bestSellers'
                    ? 'bg-[#35F582] text-black shadow-sm'
                    : 'text-[#A5ADA8] hover:text-white'
                }`}
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('newArrivals')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'newArrivals'
                    ? 'bg-[#35F582] text-black shadow-sm'
                    : 'text-[#A5ADA8] hover:text-white'
                }`}
              >
                New Arrivals
              </button>
            </div>

            {/* Quick Search inside grid */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-[#A5ADA8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by name, SKU..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-xs text-white placeholder-[#A5ADA8]/60 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#A5ADA8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          {/* Bottom row: Category Pills & Sorting Select */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#252D28]/60">
            
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#35F582] text-black font-bold shadow-[0_0_10px_rgba(53,245,130,0.3)]'
                        : 'bg-[#161D19] text-[#A5ADA8] hover:text-white hover:bg-[#1a231e] border border-[#252D28]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort & In-stock toggle */}
            <div className="flex items-center gap-3 ml-auto">
              {/* In stock checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A5ADA8] hover:text-white">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#050706] border-[#252D28] text-[#35F582] focus:ring-0 accent-[#35F582]"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-[#050706] border border-[#252D28] rounded-xl px-2.5 py-1 text-xs text-[#A5ADA8]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#35F582]" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#101512] text-white">Featured</option>
                  <option value="price-asc" className="bg-[#101512] text-white">Price: Low to High</option>
                  <option value="price-desc" className="bg-[#101512] text-white">Price: High to Low</option>
                  <option value="rating" className="bg-[#101512] text-white">Highest Rated</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Product Grid Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-20 text-center bg-[#101512] border border-[#252D28] rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#161D19] border border-[#252D28] flex items-center justify-center mx-auto mb-4 text-[#35F582]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-[#A5ADA8] mt-1 mb-6">
              No products match your active search or filter criteria.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#35F582] text-black text-xs font-bold hover:bg-[#2ed672] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
