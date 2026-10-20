import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  LogOut,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR } from '../utils/format.ts';
import { validateEmail } from '../utils/cartLogic.ts';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    customer,
    loginCustomer,
    logoutCustomer,
    orders,
    addToast,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'orders' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !validateEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    loginCustomer(email.trim());
    setMode('profile');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError('Valid email address is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    loginCustomer(email.trim());
    addToast('Account Created', 'Welcome to the Zevora Client Portal', 'success');
    setMode('profile');
  };

  // Customer's orders
  const customerOrders = customer
    ? orders.filter(
        o =>
          customer.savedOrders.includes(o.id) ||
          o.customer.email.toLowerCase() === customer.email.toLowerCase()
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#090d0a] border border-[#252D28] rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252D28] flex items-center justify-between bg-[#0e120f]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#101512] border border-[#35F582]/40 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#35F582]" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {customer ? `Welcome, ${customer.name}` : 'Zevora Concierge Portal'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-[#A5ADA8] hover:text-white bg-[#101512] border border-[#252D28]"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (if logged in) */}
        {customer && (
          <div className="flex border-b border-[#252D28] bg-[#0e120f] px-5 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setMode('profile')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
                mode === 'profile'
                  ? 'border-[#35F582] text-white'
                  : 'border-transparent text-[#A5ADA8] hover:text-white'
              }`}
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={() => setMode('orders')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                mode === 'orders'
                  ? 'border-[#35F582] text-white'
                  : 'border-transparent text-[#A5ADA8] hover:text-white'
              }`}
            >
              <span>Past Orders</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#101512] border border-[#252D28] text-[10px] text-[#35F582]">
                {customerOrders.length}
              </span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-xs flex-1">
          
          {/* STATE 1: NOT LOGGED IN -> LOGIN */}
          {!customer && mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[#A5ADA8] mb-1 font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A5ADA8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="client@zevora.pk"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A5ADA8] mb-1 font-semibold">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A5ADA8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-[11px]">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(53,245,130,0.3)]"
              >
                Sign In to Account
              </button>

              <div className="pt-2 text-center text-[#A5ADA8]">
                <span>New patron? </span>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('register');
                  }}
                  className="text-[#35F582] font-semibold hover:underline"
                >
                  Create an account
                </button>
              </div>

              {/* Demo Hint */}
              <div className="p-3 rounded-xl bg-[#101512] border border-[#252D28] text-[11px] text-[#A5ADA8]">
                <span className="text-[#35F582] font-bold">Quick Patron Demo:</span> Sign in with{' '}
                <code className="text-white">kamran.shah@gmail.com</code> to see existing sample orders.
              </div>
            </form>
          )}

          {/* STATE 2: NOT LOGGED IN -> REGISTER */}
          {!customer && mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[#A5ADA8] mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Zainab Qasim"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A5ADA8] mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A5ADA8] mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101512] border border-[#252D28] focus:border-[#35F582] text-white focus:outline-none"
                />
              </div>

              {error && <p className="text-red-400 text-[11px]">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(53,245,130,0.3)]"
              >
                Register Patron Account
              </button>

              <div className="pt-2 text-center text-[#A5ADA8]">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('login');
                  }}
                  className="text-[#35F582] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* STATE 3: LOGGED IN -> PROFILE */}
          {customer && mode === 'profile' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#101512] border border-[#252D28] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#A5ADA8] font-mono">Patron Tier</span>
                    <h3 className="text-base font-bold text-white">{customer.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#35F582]/10 border border-[#35F582]/30 text-[#35F582] font-mono text-[11px] font-bold">
                    VERIFIED VIP
                  </span>
                </div>

                <div className="pt-2 border-t border-[#252D28]/60 space-y-1.5 text-xs text-[#A5ADA8]">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#35F582]" />
                    <span className="text-white">{customer.email}</span>
                  </p>
                  {customer.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#35F582]" />
                      <span className="text-white font-mono">{customer.phone}</span>
                    </p>
                  )}
                  {customer.address && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#35F582]" />
                      <span className="text-white">
                        {customer.address.address}, {customer.address.city}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('orders')}
                  className="flex-1 py-3 rounded-xl bg-[#101512] hover:bg-[#161D19] border border-[#252D28] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Package className="w-4 h-4 text-[#35F582]" />
                  <span>View Previous Orders ({customerOrders.length})</span>
                </button>

                <button
                  type="button"
                  onClick={logoutCustomer}
                  className="px-4 py-3 rounded-xl bg-[#101512] hover:bg-red-500/10 border border-[#252D28] hover:border-red-500/40 text-[#A5ADA8] hover:text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: LOGGED IN -> ORDER HISTORY */}
          {customer && mode === 'orders' && (
            <div className="space-y-4">
              {customerOrders.length > 0 ? (
                customerOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#101512] border border-[#252D28] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-white text-xs">
                          #{order.id}
                        </span>
                        <span className="text-[11px] text-[#A5ADA8] block">{order.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#35F582]/10 border border-[#35F582]/30 text-[#35F582] font-mono text-[10px] font-bold">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 border-t border-[#252D28]/60 pt-2">
                      {order.items.map(item => (
                        <div key={item.cartId} className="flex justify-between text-[11px]">
                          <span className="text-white truncate">
                            {item.quantity}x {item.product.name} ({item.selectedSize})
                          </span>
                          <span className="font-mono text-[#A5ADA8]">
                            {formatPKR(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#252D28]/60 text-xs">
                      <span className="font-mono text-[10px] text-[#A5ADA8]">
                        Tracking: {order.trackingNumber}
                      </span>
                      <span className="font-mono font-bold text-[#35F582]">
                        {formatPKR(order.total)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#A5ADA8]">
                  <Package className="w-8 h-8 mx-auto text-[#252D28] mb-2" />
                  <p>No orders recorded yet.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
