import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR } from '../utils/format.ts';

export const Header: React.FC = () => {
  const {
    cartTotals,
    setIsCartOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    customer,
    wishlist,
    activePage,
    setActivePage,
    setSelectedCategory,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Shop', page: 'shop' as const },
    { label: 'Collections', page: 'collections' as const },
    { label: 'About', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  const handleNavClick = (page: 'home' | 'shop' | 'collections' | 'about' | 'contact' | 'admin') => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050706]/90 backdrop-blur-md border-b border-[#252D28]/80 py-3 shadow-lg shadow-black/40'
            : 'bg-transparent border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="group flex items-center text-left focus:outline-none cursor-pointer"
                aria-label="ZEVORA Home"
              >
                <span className="text-2xl font-black tracking-[0.2em] text-white group-hover:text-[#35F582] transition-colors">
                  ZEVORA
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-7">
              {navLinks.map(link => {
                const isActive = activePage === link.page;
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavClick(link.page)}
                    className={`relative py-1.5 text-xs font-bold tracking-widest uppercase transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-[#35F582]'
                        : 'text-[#A5ADA8] hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#35F582] rounded-full shadow-[0_0_8px_#35F582]" />
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
                  activePage === 'admin'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-[#A5ADA8] hover:text-amber-400 hover:bg-[#101512] border border-amber-400/20'
                }`}
                aria-label="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Currency badge */}
              <div className="hidden lg:flex items-center px-2.5 py-1 rounded-full bg-[#101512] border border-[#252D28] text-[11px] text-[#A5ADA8] font-mono">
                <span className="text-[#35F582] mr-1.5 font-bold">●</span>
                PKR (Rs.)
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-[#A5ADA8] hover:text-white hover:bg-[#101512] border border-transparent hover:border-[#252D28] transition-all relative group"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 group-hover:text-[#35F582] transition-colors" />
                <span className="sr-only">Search</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  handleNavClick('shop');
                }}
                className="p-2 rounded-full text-[#A5ADA8] hover:text-white hover:bg-[#101512] border border-transparent hover:border-[#252D28] transition-all relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 hover:text-[#35F582] transition-colors" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#35F582] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Account Button */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 rounded-full text-[#A5ADA8] hover:text-white hover:bg-[#101512] border border-transparent hover:border-[#252D28] transition-all relative"
                aria-label="Account details"
              >
                <User className="w-4 h-4 hover:text-[#35F582] transition-colors" />
                {customer && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#35F582] rounded-full ring-2 ring-[#050706]"></span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-[#101512] hover:bg-[#161D19] border border-[#252D28] hover:border-[#35F582]/50 transition-all text-white group"
                aria-label={`Cart containing ${cartTotals.itemCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#35F582]" />
                  {cartTotals.itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#35F582] text-black text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_8px_rgba(53,245,130,0.6)]">
                      {cartTotals.itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold hidden sm:inline text-white">
                  {cartTotals.total > 0 ? formatPKR(cartTotals.total) : 'Cart'}
                </span>
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#A5ADA8] hover:text-white hover:bg-[#101512] border border-[#252D28]"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="absolute top-0 right-0 w-4/5 max-w-sm h-full bg-[#050706] border-l border-[#252D28] p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header inside mobile drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-[#252D28]">
                <button
                  type="button"
                  onClick={() => {
                    handleNavClick('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left focus:outline-none"
                  aria-label="ZEVORA Home"
                >
                  <span className="text-xl font-black tracking-[0.2em] text-white">ZEVORA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#A5ADA8] hover:text-white bg-[#101512] border border-[#252D28]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mt-6 space-y-1">
                {navLinks.map(link => {
                  const isActive = activePage === link.page;
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => handleNavClick(link.page)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-[#35F582] text-black shadow-md'
                          : 'text-[#A5ADA8] hover:text-white hover:bg-[#101512]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#A5ADA8]'}`} />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 transition-all mt-3"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Store Admin Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </nav>

              {/* Quick Category links */}
              <div className="mt-8 pt-6 border-t border-[#252D28]">
                <span className="text-xs uppercase font-mono tracking-wider text-[#A5ADA8] block mb-3">
                  Shop Categories
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Shoes', 'Clothing', 'Bags', 'Watches', 'Accessories'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        handleNavClick('shop');
                      }}
                      className="px-3 py-2 text-xs rounded-lg bg-[#101512] hover:bg-[#161D19] border border-[#252D28] text-left text-white hover:border-[#35F582]/40 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="pt-6 border-t border-[#252D28]">
              <div className="flex items-center justify-between text-xs text-[#A5ADA8] mb-3">
                <span>Nationwide Shipping</span>
                <span className="text-[#35F582] font-semibold">Free over ₨10k</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-[#35F582] text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2ed672] transition-colors shadow-[0_0_20px_rgba(53,245,130,0.3)]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({cartTotals.itemCount}) • {formatPKR(cartTotals.total)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
