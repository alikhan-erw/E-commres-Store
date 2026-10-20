import type { CartItem } from '../types/index.ts';

export const FREE_SHIPPING_THRESHOLD_PKR = 10000;
export const STANDARD_SHIPPING_FEE_PKR = 350;

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  discountPercent: number;
  shippingFee: number;
  total: number;
  qualifiesForFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

export interface PromoCodeResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  discountPercent: number;
  message: string;
}

/**
 * Validates promo codes and calculates discount amount.
 */
export function evaluatePromoCode(code: string, subtotal: number): PromoCodeResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, code: '', discountAmount: 0, discountPercent: 0, message: '' };
  }

  if (normalized === 'ZEVORA10' || normalized === 'NEXORA10') {
    const discountAmount = Math.round(subtotal * 0.10);
    return {
      valid: true,
      code: normalized,
      discountAmount,
      discountPercent: 10,
      message: '10% Launch Discount Applied',
    };
  }

  if (normalized === 'VIP20') {
    const discountAmount = Math.round(subtotal * 0.20);
    return {
      valid: true,
      code: 'VIP20',
      discountAmount,
      discountPercent: 20,
      message: '20% VIP Patron Discount Applied',
    };
  }

  if (normalized === 'LAUNCH1500') {
    const discountAmount = Math.min(subtotal, 1500);
    return {
      valid: true,
      code: 'LAUNCH1500',
      discountAmount,
      discountPercent: 0,
      message: '₨ 1,500 Welcome Voucher Applied',
    };
  }

  return {
    valid: false,
    code: normalized,
    discountAmount: 0,
    discountPercent: 0,
    message: 'Invalid or expired promotional code',
  };
}

/**
 * Calculates cart totals including item count, subtotal, discount, shipping, and grand total.
 */
export function calculateCartTotals(items: CartItem[], promoCode = ''): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      discount: 0,
      discountPercent: 0,
      shippingFee: 0,
      total: 0,
      qualifiesForFreeShipping: false,
      amountNeededForFreeShipping: FREE_SHIPPING_THRESHOLD_PKR,
    };
  }

  const promo = evaluatePromoCode(promoCode, subtotal);
  const discount = promo.valid ? promo.discountAmount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_PKR;
  const shippingFee = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE_PKR;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_PKR - subtotal);

  const total = discountedSubtotal + shippingFee;

  return {
    itemCount,
    subtotal,
    discount,
    discountPercent: promo.discountPercent,
    shippingFee,
    total,
    qualifiesForFreeShipping,
    amountNeededForFreeShipping,
  };
}

/**
 * Adds an item to the cart or increments existing quantity up to available stock.
 */
export function addOrUpdateCartItem(
  currentItems: CartItem[],
  newItem: CartItem
): { items: CartItem[]; addedQuantity: number; wasCapped: boolean } {
  const existingIndex = currentItems.findIndex(i => i.cartId === newItem.cartId);
  const availableStock = newItem.product.stock;

  if (existingIndex > -1) {
    const existing = currentItems[existingIndex];
    const desiredTotal = existing.quantity + newItem.quantity;
    const finalQuantity = Math.min(desiredTotal, availableStock);
    const addedQuantity = finalQuantity - existing.quantity;
    const wasCapped = desiredTotal > availableStock;

    const updated = [...currentItems];
    updated[existingIndex] = {
      ...existing,
      quantity: finalQuantity,
    };

    return { items: updated, addedQuantity, wasCapped };
  }

  const finalQuantity = Math.min(newItem.quantity, availableStock);
  const wasCapped = newItem.quantity > availableStock;
  const itemToAdd = { ...newItem, quantity: finalQuantity };

  return {
    items: [...currentItems, itemToAdd],
    addedQuantity: finalQuantity,
    wasCapped,
  };
}

/**
 * Updates item quantity in cart, capping at stock or removing if <= 0.
 */
export function updateItemQuantity(
  currentItems: CartItem[],
  cartId: string,
  newQuantity: number
): CartItem[] {
  if (newQuantity <= 0) {
    return currentItems.filter(i => i.cartId !== cartId);
  }

  return currentItems.map(item => {
    if (item.cartId === cartId) {
      const capped = Math.min(newQuantity, item.product.stock);
      return { ...item, quantity: capped };
    }
    return item;
  });
}

/**
 * Validates a Pakistani phone number (e.g., 03001234567 or +923001234567 or 03xx-xxxxxxx).
 */
export function validatePakistaniPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s()-]/g, '');
  // Matches 03XXXXXXXXX (11 digits) or +923XXXXXXXXX (13 chars) or 923XXXXXXXXX (12 digits) or 3XXXXXXXXX (10 digits)
  return /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(cleaned);
}

/**
 * Validates standard email address format.
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
