import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials.ts';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-[#050706] border-t border-[#252D28]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#35F582] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]"></span>
              Client Testimonials & Feedback
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Verified Patron Reviews
            </h2>
          </div>
          
          <div className="text-xs text-[#A5ADA8] font-mono px-3 py-1.5 rounded-lg bg-[#101512] border border-[#252D28] self-start md:self-auto">
            Sample Early-Access Testimonials (4.9/5 Average)
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="bg-[#101512] rounded-2xl p-6 border border-[#252D28] hover:border-[#35F582]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#35F582]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-[#252D28]" />
                </div>

                {/* Comment body */}
                <p className="text-xs sm:text-sm text-[#A5ADA8] leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-4 border-t border-[#252D28]/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.author}</span>
                    {t.verified && (
                      <CheckCircle className="w-3 h-3 text-[#35F582]" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#A5ADA8]">{t.location}</span>
                </div>
                <span className="text-[10px] font-mono text-[#A5ADA8]/60">{t.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
