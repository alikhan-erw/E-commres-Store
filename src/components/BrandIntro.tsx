import React from 'react';
import { Shield, Zap, Truck, Sparkles } from 'lucide-react';

const BRAND_PILLARS = [
  {
    icon: Sparkles,
    title: 'Aerospace & Italian Sourcing',
    description: 'Forged Grade 5 titanium, Tuscan vegetable-tanned calfskin, and 3-layer weatherproof Japanese technical membranes.',
  },
  {
    icon: Zap,
    title: '0.8s Precision Commerce',
    description: 'Instant checkout architecture engineered with zero friction. Instant payment confirmation and real-time tracking.',
  },
  {
    icon: Truck,
    title: 'Nationwide 48-Hour Dispatch',
    description: 'Complimentary express delivery across Lahore, Karachi, Islamabad, and nationwide on all orders over ₨10,000.',
  },
  {
    icon: Shield,
    title: 'Lifetime Authenticity Guarantee',
    description: 'Every timepiece, garment, and leather piece is backed by our verified provenance certificate and dedicated concierge.',
  },
];

export const BrandIntro: React.FC = () => {
  return (
    <section className="py-24 bg-[#050706] border-t border-[#252D28]/60 relative overflow-hidden">
      
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#35F582]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101512] border border-[#252D28] text-xs font-mono text-[#35F582]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]"></span>
            The Zevora Standard
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Crafted for the Discerning. <br />
            <span className="text-[#35F582]">Engineered for Performance.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A5ADA8] leading-relaxed">
            Zevora was founded to eliminate the compromise between uncompromising brutalist luxury and technical utility. We produce limited quantities with zero excess inventory.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-[#101512] rounded-2xl p-6 sm:p-7 border border-[#252D28] hover:border-[#35F582]/50 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#161D19] border border-[#252D28] group-hover:border-[#35F582]/40 flex items-center justify-center text-[#35F582] mb-5 transition-colors group-hover:shadow-[0_0_15px_rgba(53,245,130,0.2)]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-[#A5ADA8] uppercase mb-1">
                  Pillar 0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#35F582] transition-colors mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#A5ADA8] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
