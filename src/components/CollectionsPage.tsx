import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import type { ProductCategory } from '../types/index.ts';

const COLLECTIONS = [
  {
    id: 'col-1',
    title: 'The Obsidian Matrix',
    subtitle: 'High-density stealth outerwear & modular trousers',
    category: 'Clothing' as ProductCategory,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    itemsCount: 4,
    badge: 'Limited Drop',
  },
  {
    id: 'col-2',
    title: 'Aerospace Kinetics',
    subtitle: 'Ultralight carbon propulsion & lugged soles',
    category: 'Shoes' as ProductCategory,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
    itemsCount: 3,
    badge: 'Iconic Design',
  },
  {
    id: 'col-3',
    title: 'High Horology Lab',
    subtitle: 'Skeletonized tourbillons & Grade 5 titanium cases',
    category: 'Watches' as ProductCategory,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    itemsCount: 2,
    badge: 'Numbered Editions',
  },
  {
    id: 'col-4',
    title: 'Tuscan Leather & Tech Carry',
    subtitle: 'Architectural holdalls with aluminum hardware',
    category: 'Bags' as ProductCategory,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
    itemsCount: 3,
    badge: 'Handcrafted',
  },
];

export const CollectionsPage: React.FC = () => {
  const { setSelectedCategory, setActivePage } = useStore();

  const handleOpenCollection = (category: ProductCategory) => {
    setSelectedCategory(category);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-20 bg-[#050706] text-white animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101512] border border-[#252D28] text-xs font-mono text-[#35F582]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]"></span>
            Curated Lookbooks
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Thematic Editions
          </h1>
          <p className="text-xs sm:text-sm text-[#A5ADA8]">
            Explore each specialized design series crafted with singular vision and material continuity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COLLECTIONS.map(col => (
            <div
              key={col.id}
              onClick={() => handleOpenCollection(col.category)}
              className="group relative rounded-3xl overflow-hidden bg-[#101512] border border-[#252D28] hover:border-[#35F582]/60 cursor-pointer transition-all duration-500 h-96 flex flex-col justify-between p-7"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Top row */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-mono text-[#35F582] backdrop-blur-md">
                  {col.badge}
                </span>
                <span className="text-xs font-mono text-[#A5ADA8]">
                  {col.itemsCount} Archive Pieces
                </span>
              </div>

              {/* Bottom row */}
              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-extrabold text-white group-hover:text-[#35F582] transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-[#A5ADA8] max-w-sm">
                  {col.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#35F582]">
                  <span>Explore Series</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
