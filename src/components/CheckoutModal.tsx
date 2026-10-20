import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  ShieldCheck,
  Check,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR } from '../utils/format.ts';
import { validatePakistaniPhone, validateEmail } from '../utils/cartLogic.ts';
import type { CustomerAddress } from '../types/index.ts';

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Other / International',
];

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotals,
    placeOrder,
    customer,
  } = useStore();

  const [fullName, setFullName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address?.address || '');
  const [city, setCity] = useState(customer?.address?.city || 'Lahore');
  const [postalCode, setPostalCode] = useState(customer?.address?.postalCode || '54000');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery (COD)' | 'Credit / Debit Card' | 'JazzCash / EasyPaisa' | 'Direct Bank Transfer'
  >('Cash on Delivery (COD)');

  // Card details state (when card selected)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !validateEmail(email)) errs.email = 'Valid email address is required';
    if (!phone.trim() || !validatePakistaniPhone(phone)) {
      errs.phone = 'Valid Pakistani mobile number (e.g. 03001234567 or +923001234567) is required';
    }
    if (!address.trim()) errs.address = 'Complete delivery street address is required';
    if (!city.trim()) errs.city = 'City selection is required';

    if (paymentMethod === 'Credit / Debit Card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        errs.cardNumber = 'Valid 16-digit card number required';
      }
      if (!cardExpiry.includes('/')) {
        errs.cardExpiry = 'MM/YY required';
      }
      if (cardCvc.length < 3) {
        errs.cardCvc = '3-digit CVC required';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const customerDetails: CustomerAddress = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: 'Pakistan',
      notes: notes.trim(),
    };

    setTimeout(() => {
      placeOrder({
        items: cart,
        subtotal: cartTotals.subtotal,
        shippingFee: cartTotals.shippingFee,
        discount: cartTotals.discount,
        total: cartTotals.total,
        customer: customerDetails,
        paymentMethod,
        status: 'Confirmed',
      });
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#090d0a] border border-[#252D28] rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[94vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252D28] flex items-center justify-between bg-[#0e120f]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#35F582]" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Secure Checkout • Zevora Direct
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-[#A5ADA8] hover:text-white bg-[#101512] border border-[#252D28]"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT 7 COLS: Shipping Address & Payment Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Section */}
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#35F582] font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#35F582]"></span>
                  1. Delivery Details (Pakistan)
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#A5ADA8] mb-1 font-semibold">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Kamran Malik"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border text-white placeholder-[#A5ADA8]/60 focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-500' : 'border-[#252D28] focus:border-[#35F582]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#A5ADA8] mb-1 font-semibold">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="03001234567"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border text-white placeholder-[#A5ADA8]/60 focus:outline-none transition-colors font-mono ${
                          errors.phone ? 'border-red-500' : 'border-[#252D28] focus:border-[#35F582]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#A5ADA8] mb-1 font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border text-white placeholder-[#A5ADA8]/60 focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500' : 'border-[#252D28] focus:border-[#35F582]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A5ADA8] mb-1 font-semibold">
                      Complete Street Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="House / Apartment #, Street, Phase / Block, Sector"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border text-white placeholder-[#A5ADA8]/60 focus:outline-none transition-colors ${
                        errors.address ? 'border-red-500' : 'border-[#252D28] focus:border-[#35F582]'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#A5ADA8] mb-1 font-semibold">City *</label>
                      <select
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none cursor-pointer"
                      >
                        {PAKISTAN_CITIES.map(c => (
                          <option key={c} value={c} className="bg-[#101512] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#A5ADA8] mb-1 font-semibold">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        placeholder="54000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A5ADA8] mb-1 font-semibold">
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Call before delivery, leave with security gate"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white placeholder-[#A5ADA8]/50 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="pt-4 border-t border-[#252D28]">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#35F582] font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#35F582]"></span>
                  2. Payment Method
                </h3>

                <div className="space-y-2.5 text-xs">
                  
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-[#35F582] bg-[#161D19] shadow-[0_0_15px_rgba(53,245,130,0.15)]'
                        : 'border-[#252D28] bg-[#101512] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className="mt-0.5 accent-[#35F582]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-[#35F582]" />
                          Cash on Delivery (COD)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#35F582]/10 text-[#35F582] font-mono font-bold text-[10px]">
                          DEFAULT
                        </span>
                      </div>
                      <p className="text-[#A5ADA8] mt-1 text-[11px]">
                        Pay with cash when our courier delivers to your doorstep anywhere in Pakistan.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Credit / Debit Card */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Credit / Debit Card'
                        ? 'border-[#35F582] bg-[#161D19] shadow-[0_0_15px_rgba(53,245,130,0.15)]'
                        : 'border-[#252D28] bg-[#101512] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Credit / Debit Card'}
                      onChange={() => setPaymentMethod('Credit / Debit Card')}
                      className="mt-0.5 accent-[#35F582]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#35F582]" />
                          Credit / Debit Card (Visa, Mastercard, UnionPay)
                        </span>
                      </div>
                      <p className="text-[#A5ADA8] mt-1 text-[11px]">
                        Encrypted 256-bit secure gateway simulation.
                      </p>

                      {paymentMethod === 'Credit / Debit Card' && (
                        <div className="mt-3 pt-3 border-t border-[#252D28] space-y-2">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            maxLength={19}
                            className="w-full px-3 py-2 rounded-lg bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white font-mono text-xs focus:outline-none"
                          />
                          {errors.cardNumber && (
                            <p className="text-red-400 text-[10px]">{errors.cardNumber}</p>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="px-3 py-2 rounded-lg bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white font-mono text-xs focus:outline-none"
                            />
                            <input
                              type="password"
                              value={cardCvc}
                              onChange={e => setCardCvc(e.target.value)}
                              placeholder="CVC"
                              maxLength={4}
                              className="px-3 py-2 rounded-lg bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-white font-mono text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 3: JazzCash / EasyPaisa */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'JazzCash / EasyPaisa'
                        ? 'border-[#35F582] bg-[#161D19] shadow-[0_0_15px_rgba(53,245,130,0.15)]'
                        : 'border-[#252D28] bg-[#101512] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'JazzCash / EasyPaisa'}
                      onChange={() => setPaymentMethod('JazzCash / EasyPaisa')}
                      className="mt-0.5 accent-[#35F582]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#35F582]" />
                        JazzCash / EasyPaisa Mobile Wallet
                      </span>
                      <p className="text-[#A5ADA8] mt-1 text-[11px]">
                        Transfer to Merchant Account <strong>0300-8456123</strong> (Zevora Commerce).
                      </p>
                    </div>
                  </label>

                  {/* Option 4: Direct Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Direct Bank Transfer'
                        ? 'border-[#35F582] bg-[#161D19] shadow-[0_0_15px_rgba(53,245,130,0.15)]'
                        : 'border-[#252D28] bg-[#101512] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Direct Bank Transfer'}
                      onChange={() => setPaymentMethod('Direct Bank Transfer')}
                      className="mt-0.5 accent-[#35F582]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#35F582]" />
                        Direct Bank Wire (Meezan / HBL Pakistan)
                      </span>
                      <p className="text-[#A5ADA8] mt-1 text-[11px]">
                        Meezan Bank Ltd • Title: Zevora Luxury • IBAN: PK68MEZN0001092841029381.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* RIGHT 5 COLS: Order Summary */}
            <div className="lg:col-span-5 bg-[#101512] p-5 sm:p-6 rounded-2xl border border-[#252D28] flex flex-col justify-between space-y-6">
              
              <div>
                <h3 className="text-sm font-bold text-white mb-4">
                  Order Summary ({cart.length} items)
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.cartId} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-black"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#A5ADA8]">
                          {item.selectedSize} • Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-semibold text-white">
                        {formatPKR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div className="mt-6 pt-4 border-t border-[#252D28] space-y-2 text-xs">
                  <div className="flex justify-between text-[#A5ADA8]">
                    <span>Items Subtotal</span>
                    <span className="font-mono text-white">{formatPKR(cartTotals.subtotal)}</span>
                  </div>
                  {cartTotals.discount > 0 && (
                    <div className="flex justify-between text-[#35F582]">
                      <span>Voucher Discount</span>
                      <span className="font-mono">-{formatPKR(cartTotals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#A5ADA8]">
                    <span>Express Delivery</span>
                    <span className="font-mono text-white">
                      {cartTotals.shippingFee === 0 ? 'FREE' : formatPKR(cartTotals.shippingFee)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#252D28] flex justify-between text-base font-extrabold text-white">
                    <span>Payable in PKR</span>
                    <span className="font-mono text-[#35F582] text-xl">
                      {formatPKR(cartTotals.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(53,245,130,0.35)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#A5ADA8] font-mono">
                  By confirming, you agree to Zevora's verified customer terms and express dispatch policy.
                </p>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
