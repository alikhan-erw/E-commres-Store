import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR } from '../utils/format.ts';

export const PromoBanner: React.FC = () => {
  const { setActiveProductModal, products } = useStore();

  // Target time: 48 hours countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 42, seconds: 54 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tourbillonWatch = products.find(p => p.id === 'nx-wat-01') || products[0];

  return (
    <section className="py-16 bg-[#050706]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#101512] via-[#0d120f] to-[#101512] border border-[#252D28] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          {/* Subtle green ambient light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#35F582]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14 relative z-10">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35F582]/10 border border-[#35F582]/30 text-[#35F582] text-xs font-mono font-bold tracking-wider uppercase">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Limited Production Drop • Batch 04
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Chronos Obsidian <br />
                  <span className="text-[#35F582]">Tourbillon Edition.</span>
                </h2>
                <p className="text-sm sm:text-base text-[#A5ADA8] max-w-xl">
                  Forged Grade 5 titanium, double anti-reflective sapphire crystal, and caliber NX-01 28,800 vph skeletonized movement. Limited to 50 numbered pieces worldwide.
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-[#A5ADA8] mr-2">
                  <Clock className="w-4 h-4 text-[#35F582]" />
                  <span className="font-mono">Window closes in:</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-center">
                  <div className="px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] min-w-[50px]">
                    <span className="text-lg font-bold text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-[#A5ADA8] uppercase">HRS</span>
                  </div>
                  <span className="text-[#35F582] font-bold">:</span>
                  <div className="px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] min-w-[50px]">
                    <span className="text-lg font-bold text-white block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-[#A5ADA8] uppercase">MIN</span>
                  </div>
                  <span className="text-[#35F582] font-bold">:</span>
                  <div className="px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] min-w-[50px]">
                    <span className="text-lg font-bold text-[#35F582] block">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-[#A5ADA8] uppercase">SEC</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <div>
                  <span className="text-xs text-[#A5ADA8] block font-mono">Special Allocation</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">
                      {formatPKR(tourbillonWatch.price)}
                    </span>
                    {tourbillonWatch.originalPrice && (
                      <span className="text-sm text-[#A5ADA8] line-through font-mono">
                        {formatPKR(tourbillonWatch.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveProductModal(tourbillonWatch)}
                  className="px-6 py-3.5 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(53,245,130,0.3)] hover:shadow-[0_0_30px_rgba(53,245,130,0.5)]"
                >
                  <span>Inspect Horology Piece</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

            </div>

            {/* Right Column / Image Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div 
                onClick={() => setActiveProductModal(tourbillonWatch)}
                className="group relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black/60 border border-[#252D28] hover:border-[#35F582]/60 cursor-pointer transition-all duration-300 shadow-2xl"
              >
                <img
                  src={tourbillonWatch.images[0]}
                  alt="Chronos Obsidian Tourbillon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="text-white font-bold">{tourbillonWatch.name}</span>
                  <span className="text-[#35F582] font-mono font-bold">Only 3 in stock</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
