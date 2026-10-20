import React from 'react';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import heroLuxuryImage from '../assets/images/nexora_hero_portrait_1792135121443.jpg';

export const Hero: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useStore();

  const handleExplore = () => {
    setSelectedCategory('All');
    setActivePage('shop');
  };

  const handleCollections = () => {
    setSelectedCategory('All');
    setActivePage('collections');
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#050706]">
      {/* Cinematic Ambient Glow & Depth */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 right-1/4 w-[520px] h-[520px] bg-[#35F582]/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-[7000ms]" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 left-10 w-[380px] h-[380px] bg-[#101512] rounded-full blur-[120px] pointer-events-none -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[radial-gradient(#252D28_1px,transparent_1px)] [background-size:36px_36px] opacity-20 pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Meaningful, Professional Luxury Headline & Clear Value Proposition */}
          <div className="lg:col-span-6 text-left z-10 space-y-6 sm:space-y-8">
            
            {/* Subtle Limited Capsule Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#101512] border border-[#252D28] text-xs font-medium text-[#A5ADA8]">
              <span className="w-2 h-2 rounded-full bg-[#35F582] shadow-[0_0_8px_#35F582]" />
              <span className="text-white tracking-widest uppercase text-[11px] font-semibold">ZEVORA 2026</span>
              <span className="text-[#252D28]">|</span>
              <span className="text-[#35F582]">New Season Arrivals</span>
            </div>

            {/* Clear, High-Impact & Meaningful Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Curated Fashion <br />
                <span className="text-[#35F582] drop-shadow-[0_0_35px_rgba(53,245,130,0.4)]">
                  & Luxury Footwear.
                </span>
              </h1>
              
              {/* Meaningful, Purpose-Driven Subtitle */}
              <p className="text-base sm:text-lg text-[#A5ADA8] font-normal max-w-lg leading-relaxed pt-1">
                Discover hand-finished sneakers, tailored streetwear, precision timepieces, and leather essentials. Crafted with premium materials, guaranteed authenticity, and express nationwide delivery.
              </p>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={handleExplore}
                className="px-7 py-4 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(53,245,130,0.3)] hover:shadow-[0_0_35px_rgba(53,245,130,0.5)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleCollections}
                className="px-6 py-4 rounded-xl bg-[#101512] hover:bg-[#161D19] border border-[#252D28] hover:border-[#35F582]/40 text-white font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer"
              >
                View Catalog
              </button>
            </div>

            {/* Understated Trust Proof Line */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-[#252D28]/70 text-xs text-[#A5ADA8]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#35F582]" />
                <span>100% Certified Authentic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]" />
                <span>Express Worldwide & COD Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#35F582]" />
                <span>Limited Edition Releases</span>
              </div>
            </div>

          </div>

          {/* Right Column: Single High-End Professional Luxury Hero Image */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Ambient Radial Backlight Glow */}
            <div 
              aria-hidden="true" 
              className="absolute -inset-4 bg-gradient-to-tr from-[#35F582]/15 via-transparent to-transparent blur-3xl pointer-events-none rounded-3xl" 
            />

            {/* Luxury Editorial Showcase Card */}
            <div className="relative w-full max-w-[540px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#252D28] bg-[#101512] shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(53,245,130,0.12)] group">
              
              {/* The Hero Image */}
              <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={heroLuxuryImage}
                  alt="ZEVORA Luxury Editorial Showcase"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Subtle Cinematic Vignette Overlay */}
                <div 
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent opacity-60 pointer-events-none" 
                />

                {/* Subtle Metallic Specular Corner Glow */}
                <div 
                  aria-hidden="true" 
                  className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/40 pointer-events-none" 
                />

                {/* Floating Discreet Luxury Card Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3.5 rounded-xl bg-[#050706]/80 backdrop-blur-md border border-[#252D28]/80">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#35F582] uppercase block">
                      ZEVORA Atelier
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide">
                      Signature Collection // 01
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleExplore}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#35F582] hover:bg-[#2ed672] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(53,245,130,0.3)] cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
