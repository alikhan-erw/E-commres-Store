import React from 'react';
import { ShieldCheck, Compass, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="pt-24 pb-20 bg-[#050706] text-white animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101512] border border-[#252D28] text-xs font-mono text-[#35F582]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]"></span>
            The Zevora Manifesto
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Where Brutalist Architecture <br />
            <span className="text-[#35F582]">Meets Kinetic Craftsmanship.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A5ADA8] leading-relaxed">
            Founded with the belief that luxury should be engineered, not merely decorated. Zevora produces limited-run garments, carbon fiber footwear, and forged titanium horology.
          </p>
        </div>

        {/* Cinematic Imagery Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#252D28] aspect-[21/9] bg-black">
          <img
            src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=85"
            alt="Zevora Atelier"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#35F582] uppercase">Atelier Archive</span>
              <h3 className="text-lg font-bold text-white">Engineered in Limited Batches</h3>
            </div>
            <span className="text-xs font-mono text-[#A5ADA8]">Edition 2026.04</span>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-[#101512] border border-[#252D28] space-y-3">
            <Compass className="w-6 h-6 text-[#35F582]" />
            <h3 className="text-base font-bold text-white">Uncompromising Materials</h3>
            <p className="text-xs text-[#A5ADA8] leading-relaxed">
              Grade 5 forged titanium, Japanese beta-titanium, Tuscan vegetable-tanned leather, and 3-layer weatherproof breathable membranes sourced directly from primary mills.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#101512] border border-[#252D28] space-y-3">
            <Award className="w-6 h-6 text-[#35F582]" />
            <h3 className="text-base font-bold text-white">Zero Excess Production</h3>
            <p className="text-xs text-[#A5ADA8] leading-relaxed">
              We reject fast-fashion surpluses. Every batch is manufactured to exact allocations, eliminating industrial waste and preserving lifetime rarity.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#101512] border border-[#252D28] space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#35F582]" />
            <h3 className="text-base font-bold text-white">Digital Precision Commerce</h3>
            <p className="text-xs text-[#A5ADA8] leading-relaxed">
              Sub-second storefront architecture, transparent PKR pricing, verified Cash on Delivery across Pakistan, and white-glove 48-hour delivery.
            </p>
          </div>
        </div>

        {/* CTA to Explore */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#101512] via-[#0e1310] to-[#101512] border border-[#252D28] text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Experience the New Standard</h2>
          <p className="text-xs sm:text-sm text-[#A5ADA8] max-w-lg mx-auto">
            Discover our curated lineup of footwear, garments, bags, watches, and accessories.
          </p>
          <button
            type="button"
            onClick={() => setActivePage('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#35F582] text-black font-extrabold text-xs tracking-wide hover:bg-[#2ed672] transition-colors"
          >
            <span>Explore The Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
