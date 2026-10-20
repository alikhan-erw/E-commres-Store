import React, { useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR } from '../utils/format.ts';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    setActiveProductModal,
    setSelectedCategory,
    setActivePage,
  } = useStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Global keyboard shortcut: cmd+k or ctrl+k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results = searchQuery.trim()
    ? products.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 4);

  const handleSelectProduct = (p: typeof products[0]) => {
    setIsSearchOpen(false);
    setActiveProductModal(p);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0e120f] border border-[#252D28] rounded-3xl overflow-hidden shadow-2xl space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#252D28] flex items-center gap-3 bg-[#101512]">
          <Search className="w-5 h-5 text-[#35F582]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search footwear, timepieces, technical outerwear, bags..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#A5ADA8]/60 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded text-[#A5ADA8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#050706] border border-[#252D28] text-[10px] font-mono text-[#A5ADA8]">
            ESC
          </span>
        </div>

        {/* Quick Category Buttons */}
        <div className="px-5 flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-[#A5ADA8] text-[11px] font-mono mr-1">Trending:</span>
          {(['Shoes', 'Clothing', 'Watches', 'Bags', 'Accessories'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActivePage('shop');
                setIsSearchOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#101512] hover:bg-[#161D19] border border-[#252D28] text-[#A5ADA8] hover:text-white transition-colors whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-2">
          <span className="text-[11px] font-mono text-[#A5ADA8] uppercase block mb-2">
            {searchQuery ? `Matching Results (${results.length})` : 'Popular Recommendations'}
          </span>

          {results.length > 0 ? (
            results.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectProduct(p)}
                className="group flex items-center justify-between p-3 rounded-2xl bg-[#101512] hover:bg-[#161D19] border border-[#252D28] hover:border-[#35F582]/60 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-xl bg-black"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#35F582] transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-[#A5ADA8]">{p.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    {formatPKR(p.price)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#050706] border border-[#252D28] flex items-center justify-center text-[#A5ADA8] group-hover:text-[#35F582]">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-[#A5ADA8] text-xs">
              No matching luxury pieces found for "{searchQuery}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
