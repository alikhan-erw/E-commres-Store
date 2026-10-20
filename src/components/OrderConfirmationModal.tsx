import React from 'react';
import {
  CheckCircle,
  Truck,
  Printer,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR } from '../utils/format.ts';

export const OrderConfirmationModal: React.FC = () => {
  const { lastCompletedOrder, setLastCompletedOrder, setActivePage } = useStore();

  if (!lastCompletedOrder) return null;

  const order = lastCompletedOrder;

  const handlePrint = () => {
    window.print();
  };

  const handleContinue = () => {
    setLastCompletedOrder(null);
    setActivePage('shop');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#090d0a] border border-[#252D28] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Success Banner */}
        <div className="p-8 text-center bg-gradient-to-b from-[#101512] to-[#090d0a] border-b border-[#252D28]">
          <div className="w-16 h-16 rounded-2xl bg-[#35F582]/10 border border-[#35F582]/40 flex items-center justify-center mx-auto mb-4 text-[#35F582] shadow-[0_0_25px_rgba(53,245,130,0.3)]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#101512] border border-[#252D28] text-xs font-mono text-[#35F582] mb-2">
            Order Status: {order.status}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Order Confirmed #{order.id}
          </h2>
          <p className="text-xs sm:text-sm text-[#A5ADA8] mt-1 max-w-md mx-auto">
            Thank you, {order.customer.fullName}. Your luxury consignment has been registered in our logistics center and is being prepared for dispatch.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs">
          
          {/* Tracking & Timeline Card */}
          <div className="p-4 rounded-2xl bg-[#101512] border border-[#252D28] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[#A5ADA8] block font-mono text-[11px]">Courier Tracking Code</span>
              <span className="text-base font-mono font-extrabold text-[#35F582]">
                {order.trackingNumber}
              </span>
              <span className="text-[11px] text-[#A5ADA8] block mt-0.5">
                (TCS / Leopards Express Overnight)
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#050706] border border-[#252D28]">
              <Calendar className="w-4 h-4 text-[#35F582]" />
              <div>
                <span className="text-[10px] text-[#A5ADA8] block">Estimated Delivery</span>
                <span className="text-xs font-bold text-white">Within 48 Hours</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#101512] border border-[#252D28] space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#35F582] font-semibold block mb-1">
                Delivery Address
              </span>
              <p className="font-bold text-white">{order.customer.fullName}</p>
              <p className="text-[#A5ADA8]">{order.customer.phone}</p>
              <p className="text-[#A5ADA8]">{order.customer.address}</p>
              <p className="text-[#A5ADA8]">{order.customer.city}, {order.customer.postalCode}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101512] border border-[#252D28] space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#35F582] font-semibold block mb-1">
                Payment Details
              </span>
              <p className="font-bold text-white">{order.paymentMethod}</p>
              <p className="text-[#A5ADA8]">Status: Authorized on Delivery</p>
              <p className="text-[#A5ADA8]">Currency: Pakistani Rupee (PKR)</p>
              <p className="text-[#35F582] font-mono font-bold mt-2">
                Total Payable: {formatPKR(order.total)}
              </p>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="p-4 rounded-2xl bg-[#101512] border border-[#252D28] space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#A5ADA8] font-semibold block">
              Items Ordered ({order.items.length})
            </span>

            <div className="space-y-2.5 divide-y divide-[#252D28]/60">
              {order.items.map(item => (
                <div key={item.cartId} className="pt-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-black"
                    />
                    <div>
                      <p className="font-bold text-white">{item.product.name}</p>
                      <p className="text-[11px] text-[#A5ADA8]">
                        Size: {item.selectedSize} • Color: {item.selectedColor.name} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">
                    {formatPKR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-[#0e120f] border-t border-[#252D28] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#101512] hover:bg-[#161D19] border border-[#252D28] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-[#35F582]" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(53,245,130,0.3)]"
          >
            <span>Continue Shopping</span>
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
