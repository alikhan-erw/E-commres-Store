import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Copy } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { validateEmail } from '../utils/cartLogic.ts';
import { api } from '../services/api.ts';

export const Newsletter: React.FC = () => {
  const { addToast, applyPromoCode, setIsCartOpen } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }

    setSubscribed(true);
    addToast('Subscribed to Zevora', 'Use voucher ZEVORA10 for 10% off your purchase.', 'success');
    api.subscribeNewsletter(email).catch(err => {
      console.warn('Backend newsletter sync:', err.message);
    });
  };

  const copyCode = () => {
    navigator.clipboard?.writeText('ZEVORA10');
    setCopied(true);
    applyPromoCode('ZEVORA10');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-[#050706] border-t border-[#252D28]/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="bg-[#101512] rounded-3xl p-8 sm:p-12 border border-[#252D28] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Subtle neon ambient lighting */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#35F582]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35F582]/10 border border-[#35F582]/30 text-[#35F582] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privileged Access</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Join the Zevora Circle
            </h2>

            <p className="text-xs sm:text-sm text-[#A5ADA8] leading-relaxed">
              Subscribe to receive private allocations, confidential lookbooks, and an instant 10% privilege voucher for your inaugural order.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white text-xs sm:text-sm placeholder-[#A5ADA8]/60 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-[0_0_15px_rgba(53,245,130,0.3)]"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && (
                  <p className="text-red-400 text-xs text-left max-w-md mx-auto">{error}</p>
                )}
                <p className="text-[11px] text-[#A5ADA8]/60 pt-2 font-mono">
                  Zero spam. Unsubscribe at any time with one click.
                </p>
              </form>
            ) : (
              <div className="mt-6 p-4 rounded-2xl bg-[#050706] border border-[#35F582]/40 max-w-md mx-auto animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-[#35F582] text-sm font-bold mb-2">
                  <Check className="w-4 h-4" />
                  <span>Welcome to the Circle!</span>
                </div>
                <p className="text-xs text-[#A5ADA8] mb-3">
                  Your 10% welcome coupon is ready to apply:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-extrabold text-white bg-[#101512] px-3.5 py-1.5 rounded-lg border border-[#252D28]">
                    ZEVORA10
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="px-3 py-1.5 rounded-lg bg-[#35F582] text-black text-xs font-bold flex items-center gap-1 hover:bg-[#2ed672] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Applied!' : 'Apply Code'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
