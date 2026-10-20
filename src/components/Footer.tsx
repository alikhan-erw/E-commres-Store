import React from 'react';
import { ShieldCheck, ArrowUp, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import type { ProductCategory } from '../types/index.ts';
import { SOCIAL_LINKS } from './SocialIcons.tsx';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useStore();

  const handleCategoryClick = (category: ProductCategory) => {
    setSelectedCategory(category);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050706] border-t border-[#252D28] text-[#A5ADA8] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-[0.2em] text-white">ZEVORA</span>
            </div>
            
            <p className="text-xs text-[#A5ADA8] max-w-sm leading-relaxed">
              International luxury commerce engineered for high performance. Specializing in carbon fiber kinetic footwear, technical outerwear, Tuscan leather luggage, and skeletonized horology.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#35F582] animate-pulse"></span>
              <span className="text-[11px] font-mono text-white">Live Storefront Status: 100% Operational</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A5ADA8] block mb-2.5">
                Official Social Channels
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_LINKS.map(s => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.id}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`ZEVORA on ${s.name}`}
                      title={`${s.name} • ${s.handle}`}
                      className="w-8 h-8 rounded-lg bg-[#101512] border border-[#252D28] hover:border-[#35F582]/60 hover:bg-[#161D19] text-[#A5ADA8] hover:text-[#35F582] flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_12px_rgba(53,245,130,0.25)]"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Collections
            </h4>
            <ul className="space-y-2">
              {(['Shoes', 'Clothing', 'Bags', 'Watches', 'Accessories'] as ProductCategory[]).map(cat => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-[#35F582] transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Concierge
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#35F582] transition-colors"
                >
                  Authenticity & Provenance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#35F582] transition-colors"
                >
                  Shipping & Dispatch (PKR)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#35F582] transition-colors"
                >
                  Returns & Exchanges (14 Days)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#35F582] transition-colors"
                >
                  Concierge Support & WhatsApp
                </button>
              </li>
            </ul>
          </div>

          {/* Store Operations & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
              <li>
                <span className="text-[#A5ADA8]/60">Engine: Vite React 19</span>
              </li>
              <li>
                <span className="text-[#A5ADA8]/60">Currency: Pakistani Rupee (PKR)</span>
              </li>
              <li>
                <span className="text-[#A5ADA8]/60">Hub: Lahore & Karachi</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Accepted Payment Methods & Country Notice */}
        <div className="py-6 border-y border-[#252D28]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
            <span className="text-[#A5ADA8] mr-2">Payment Verification:</span>
            <span className="px-2 py-1 rounded bg-[#101512] border border-[#252D28] text-white">Cash on Delivery (COD)</span>
            <span className="px-2 py-1 rounded bg-[#101512] border border-[#252D28] text-white">Visa</span>
            <span className="px-2 py-1 rounded bg-[#101512] border border-[#252D28] text-white">Mastercard</span>
            <span className="px-2 py-1 rounded bg-[#101512] border border-[#252D28] text-[#35F582]">JazzCash</span>
            <span className="px-2 py-1 rounded bg-[#101512] border border-[#252D28] text-[#35F582]">EasyPaisa</span>
            <span className="px-2 py-1 rounded bg-[#101512] border border-[#252D28] text-white">Bank Wire</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[#A5ADA8] hover:text-[#35F582] transition-colors group"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A5ADA8]/70">
          <p>© {new Date().getFullYear()} Zevora Luxury E-Commerce. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with pure precision and luxury craft.
          </p>
        </div>

      </div>
    </footer>
  );
};
