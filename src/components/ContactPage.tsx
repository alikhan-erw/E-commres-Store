import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { validateEmail } from '../utils/cartLogic.ts';
import { SOCIAL_LINKS } from './SocialIcons.tsx';
import { api } from '../services/api.ts';

export const ContactPage: React.FC = () => {
  const { addToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setSubmitted(true);
    addToast('Inquiry Transmitted', 'A private concierge will reach out within 4 business hours.', 'success');
    api.sendContactInquiry({ name, email, orderId, message }).catch(err => {
      console.warn('Backend inquiry sync:', err.message);
    });
  };

  return (
    <div className="pt-24 pb-20 bg-[#050706] text-white animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101512] border border-[#252D28] text-xs font-mono text-[#35F582]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35F582]"></span>
            Direct Client Services
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Zevora Concierge & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#A5ADA8]">
            Whether you require sizing assistance, tracking details for your consignment in Pakistan, or bespoke allocations, our team is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 5 COLS: Contact Channels & Locations */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#101512] border border-[#252D28] space-y-5">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Direct Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#050706] border border-[#252D28] flex items-center justify-center text-[#35F582] flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#A5ADA8] block">Electronic Inquiries</span>
                    <a href="mailto:concierge@zevora.pk" className="font-bold text-white hover:text-[#35F582] transition-colors">
                      concierge@zevora.pk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#050706] border border-[#252D28] flex items-center justify-center text-[#35F582] flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#A5ADA8] block">WhatsApp / Concierge Hotline</span>
                    <span className="font-mono font-bold text-white">+92 (300) 845-6123</span>
                    <span className="text-[10px] text-[#35F582] block">Mon–Sat • 9:00 AM – 9:00 PM PKT</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#050706] border border-[#252D28] flex items-center justify-center text-[#35F582] flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#A5ADA8] block">Flagship Fulfillment Hub</span>
                    <p className="text-white font-medium">
                      Sector Y, Phase 3, DHA, Lahore, Punjab, Pakistan
                    </p>
                  </div>
                </div>

                {/* Official Social Media Channels */}
                <div className="pt-4 border-t border-[#252D28]/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A5ADA8] block text-[11px] font-mono uppercase tracking-wider font-semibold">
                      Official Social Channels
                    </span>
                    <span className="text-[10px] text-[#35F582] font-mono">Verified Handles</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {SOCIAL_LINKS.map(s => {
                      const Icon = s.icon;
                      return (
                        <a
                          key={s.id}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ZEVORA on ${s.name}`}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-[#050706] border border-[#252D28] hover:border-[#35F582]/50 hover:bg-[#161D19] transition-all group"
                          title={`${s.name} • ${s.handle}`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#101512] border border-[#252D28] group-hover:border-[#35F582]/40 flex items-center justify-center text-[#35F582] flex-shrink-0 transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-bold text-white group-hover:text-[#35F582] transition-colors block truncate">
                              {s.name}
                            </span>
                            <span className="text-[9px] text-[#A5ADA8] font-mono block truncate">
                              {s.handle}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Nationwide Dispatch Guarantee */}
            <div className="p-5 rounded-2xl bg-[#101512] border border-[#252D28] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#35F582] font-bold">
                <Clock className="w-4 h-4" />
                <span>Nationwide Shipping Commitments</span>
              </div>
              <p className="text-[#A5ADA8]">
                Orders placed before 4:00 PM PKT dispatch same-day. TCS Overnight courier service covers all major urban centers across Pakistan.
              </p>
            </div>

          </div>

          {/* RIGHT 7 COLS: Interactive Form */}
          <div className="lg:col-span-7 bg-[#101512] p-6 sm:p-8 rounded-3xl border border-[#252D28]">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white mb-2">
                  Send a Confidential Transmission
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A5ADA8] mb-1 font-semibold">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ahad Raza"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5ADA8] mb-1 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ahad@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A5ADA8] mb-1 font-semibold">
                    Order Reference # (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                    placeholder="e.g. ZV-89210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A5ADA8] mb-1 font-semibold">Message / Inquiry *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, sizing questions, or order tracking request..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                  />
                </div>

                {error && <p className="text-red-400 text-[11px]">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(53,245,130,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-[#35F582]/10 border border-[#35F582]/30 flex items-center justify-center mx-auto text-[#35F582]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Transmission Received</h3>
                <p className="text-xs text-[#A5ADA8] max-w-sm mx-auto">
                  Thank you, {name}. Your inquiry has been routed to our Lahore fulfillment concierge. You will receive an update at {email}.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-[#101512] border border-[#252D28] text-xs text-white hover:border-[#35F582] transition-colors mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
