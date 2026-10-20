import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import type { ProductCategory } from '../types/index.ts';

interface CategoryCardInfo {
  name: ProductCategory;
  tagline: string;
  image: string;
}

const CATEGORIES_DATA: CategoryCardInfo[] = [
  {
    name: 'Shoes',
    tagline: 'Carbon Fiber & Kinetic Soles',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Clothing',
    tagline: 'Technical Outerwear & 500 GSM Heavyweight',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bags',
    tagline: 'Tuscan Leather & X-Pac Waterproof Carry',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Watches',
    tagline: 'Automatic Tourbillons & Sapphire Crystal',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Accessories',
    tagline: 'Beta-Titanium Eyewear & 3K Carbon Wallets',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  },
];

export const CategoryPills: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, setActivePage } = useStore();

  const handleSelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setActivePage('shop');
    const target = document.getElementById('shop-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-[#050706] border-y border-[#252D28]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#35F582] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]"></span>
              Architectural Curations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setActivePage('shop');
            }}
            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A5ADA8] hover:text-[#35F582] transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5-Column Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES_DATA.map(cat => {
            const count = products.filter(p => p.category === cat.name).length;
            const isCurrent = selectedCategory === cat.name;

            return (
              <div
                key={cat.name}
                onClick={() => handleSelect(cat.name)}
                className={`group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-[#101512] border transition-all duration-300 ${
                  isCurrent
                    ? 'border-[#35F582] shadow-[0_0_25px_rgba(53,245,130,0.3)] -translate-y-1'
                    : 'border-[#252D28] hover:border-[#35F582]/60 hover:-translate-y-1'
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  loading="lazy"
                />

                {/* Gradient scrim for high readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-[#A5ADA8]">
                      {count} Items
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#050706]/80 border border-[#252D28] group-hover:border-[#35F582] flex items-center justify-center text-white group-hover:text-[#35F582] transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#35F582] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#A5ADA8] line-clamp-1 mt-0.5 font-medium">
                      {cat.tagline}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
