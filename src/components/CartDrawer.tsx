import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR } from '../utils/format.ts';
import { FREE_SHIPPING_THRESHOLD_PKR } from '../utils/cartLogic.ts';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotals,
    promoCode,
    applyPromoCode,
    setIsCheckoutOpen,
    setActivePage,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = applyPromoCode(inputCoupon.trim());
    if (ok) {
      setCouponApplied(true);
      setInputCoupon('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((cartTotals.subtotal / FREE_SHIPPING_THRESHOLD_PKR) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#090d0a] border-l border-[#252D28] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#252D28] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#35F582]" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Your Shopping Bag ({cartTotals.itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-[#A5ADA8] hover:text-white bg-[#101512] border border-[#252D28]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-[#101512] border-b border-[#252D28] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[#A5ADA8]">
                {cartTotals.qualifiesForFreeShipping ? (
                  <span className="text-[#35F582] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Free Nationwide Express Shipping Unlocked!
                  </span>
                ) : (
                  <>
                    Add <strong className="text-white font-mono">{formatPKR(cartTotals.amountNeededForFreeShipping)}</strong> more for Free Shipping
                  </>
                )}
              </span>
              <span className="font-mono text-[11px] text-[#A5ADA8]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#050706] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#35F582] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map(item => (
                <div
                  key={item.cartId}
                  className="p-3.5 rounded-2xl bg-[#101512] border border-[#252D28] flex gap-3.5 items-center justify-between"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-black border border-white/5"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#A5ADA8]">
                      <span className="px-2 py-0.5 rounded bg-[#050706] border border-[#252D28] font-mono">
                        {item.selectedSize}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="truncate">{item.selectedColor.name}</span>
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-mono font-bold text-white">
                      {formatPKR(item.product.price * item.quantity)}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end justify-between h-full space-y-3">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-[#A5ADA8] hover:text-red-400 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center bg-[#050706] border border-[#252D28] rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                        className="px-2 py-1 text-xs text-white hover:bg-[#161D19]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-mono text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-1 text-xs text-white hover:bg-[#161D19] disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#101512] border border-[#252D28] flex items-center justify-center text-[#35F582]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your bag is empty</h3>
                  <p className="text-xs text-[#A5ADA8] mt-1 max-w-xs">
                    Explore our curated collection of luxury footwear, garments, bags, and horology.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#35F582] text-black text-xs font-bold hover:bg-[#2ed672] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#0e120f] border-t border-[#252D28] space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#A5ADA8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={e => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. ZEVORA10)"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#050706] border border-[#252D28] focus:border-[#35F582] text-xs text-white placeholder-[#A5ADA8]/60 focus:outline-none uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#161D19] hover:bg-[#35F582] text-white hover:text-black border border-[#252D28] text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </form>

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#A5ADA8]">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatPKR(cartTotals.subtotal)}</span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-[#35F582]">
                    <span>Discount ({cartTotals.discountPercent}%)</span>
                    <span className="font-mono">-{formatPKR(cartTotals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#A5ADA8]">
                  <span>Shipping (Express Pakistan)</span>
                  <span className="font-mono text-white">
                    {cartTotals.shippingFee === 0 ? (
                      <span className="text-[#35F582] font-bold">FREE</span>
                    ) : (
                      formatPKR(cartTotals.shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#252D28] flex justify-between text-base font-extrabold text-white">
                  <span>Grand Total</span>
                  <span className="font-mono text-[#35F582] text-lg">
                    {formatPKR(cartTotals.total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(53,245,130,0.35)]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#A5ADA8] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#35F582]" />
                <span>Cash on Delivery & Secure 256-Bit SSL Encryption</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
