import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  evaluatePromoCode,
  addOrUpdateCartItem,
  updateItemQuantity,
  validatePakistaniPhone,
  validateEmail,
  FREE_SHIPPING_THRESHOLD_PKR,
  STANDARD_SHIPPING_FEE_PKR,
} from './cartLogic.ts';
import type { CartItem, Product } from '../types/index.ts';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Nexora Cyber Runner 01',
  subtitle: 'Ultralight Kinetic Footwear',
  category: 'Shoes',
  price: 18500,
  originalPrice: 22000,
  images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'],
  description: 'Precision engineered sneaker.',
  details: ['Carbon fiber shank', 'Breathable mesh'],
  sizes: ['EU 41', 'EU 42', 'EU 43'],
  colors: [{ name: 'Obsidian Black', hex: '#0a0a0a' }],
  stock: 5,
  rating: 4.9,
  reviewCount: 38,
  sku: 'NX-SH-01',
};

const mockItem: CartItem = {
  cartId: 'prod-1-EU 42-Obsidian Black',
  product: mockProduct,
  selectedSize: 'EU 42',
  selectedColor: { name: 'Obsidian Black', hex: '#0a0a0a' },
  quantity: 1,
};

test('empty cart returns 0 totals and requires full free shipping threshold', () => {
  const totals = calculateCartTotals([]);
  assert.equal(totals.itemCount, 0);
  assert.equal(totals.subtotal, 0);
  assert.equal(totals.shippingFee, 0);
  assert.equal(totals.total, 0);
  assert.equal(totals.qualifiesForFreeShipping, false);
  assert.equal(totals.amountNeededForFreeShipping, FREE_SHIPPING_THRESHOLD_PKR);
});

test('cart over threshold qualifies for free shipping', () => {
  // 18,500 PKR >= 10,000 threshold
  const totals = calculateCartTotals([mockItem]);
  assert.equal(totals.itemCount, 1);
  assert.equal(totals.subtotal, 18500);
  assert.equal(totals.qualifiesForFreeShipping, true);
  assert.equal(totals.shippingFee, 0);
  assert.equal(totals.total, 18500);
  assert.equal(totals.amountNeededForFreeShipping, 0);
});

test('cart under threshold adds standard shipping fee', () => {
  const cheapProduct: Product = {
    ...mockProduct,
    id: 'prod-cheap',
    price: 3500,
    stock: 10,
  };
  const cheapItem: CartItem = {
    ...mockItem,
    product: cheapProduct,
    cartId: 'prod-cheap-one-size',
    quantity: 1,
  };

  const totals = calculateCartTotals([cheapItem]);
  assert.equal(totals.subtotal, 3500);
  assert.equal(totals.qualifiesForFreeShipping, false);
  assert.equal(totals.shippingFee, STANDARD_SHIPPING_FEE_PKR);
  assert.equal(totals.total, 3500 + STANDARD_SHIPPING_FEE_PKR);
  assert.equal(totals.amountNeededForFreeShipping, FREE_SHIPPING_THRESHOLD_PKR - 3500);
});

test('ZEVORA10 and NEXORA10 promo codes deduct 10% from subtotal', () => {
  const promo = evaluatePromoCode('ZEVORA10', 20000);
  assert.equal(promo.valid, true);
  assert.equal(promo.discountAmount, 2000);
  assert.equal(promo.discountPercent, 10);

  const promoLegacy = evaluatePromoCode('NEXORA10', 20000);
  assert.equal(promoLegacy.valid, true);
  assert.equal(promoLegacy.discountAmount, 2000);

  const totals = calculateCartTotals([{ ...mockItem, quantity: 2 }], 'ZEVORA10');
  // subtotal = 37,000; 10% discount = 3,700; total = 33,300
  assert.equal(totals.subtotal, 37000);
  assert.equal(totals.discount, 3700);
  assert.equal(totals.total, 33300);
});

test('VIP20 promo code deducts 20% from subtotal', () => {
  const promo = evaluatePromoCode('vip20', 50000);
  assert.equal(promo.valid, true);
  assert.equal(promo.discountAmount, 10000);
  assert.equal(promo.discountPercent, 20);
});

test('addOrUpdateCartItem caps quantity at available product stock', () => {
  // Stock is 5
  const step1 = addOrUpdateCartItem([], { ...mockItem, quantity: 3 });
  assert.equal(step1.items[0].quantity, 3);
  assert.equal(step1.wasCapped, false);

  // Adding 4 more when 3 already in cart exceeds 5 -> capped at 5
  const step2 = addOrUpdateCartItem(step1.items, { ...mockItem, quantity: 4 });
  assert.equal(step2.items[0].quantity, 5);
  assert.equal(step2.wasCapped, true);
  assert.equal(step2.addedQuantity, 2);
});

test('updateItemQuantity removes item when 0 or negative', () => {
  const items = [mockItem];
  const updated = updateItemQuantity(items, mockItem.cartId, 0);
  assert.equal(updated.length, 0);
});

test('validatePakistaniPhone correctly validates standard Pakistani mobile numbers', () => {
  assert.equal(validatePakistaniPhone('03001234567'), true);
  assert.equal(validatePakistaniPhone('+923001234567'), true);
  assert.equal(validatePakistaniPhone('923219876543'), true);
  assert.equal(validatePakistaniPhone('0345-9876543'), true);
  assert.equal(validatePakistaniPhone('0312 3456789'), true);
  assert.equal(validatePakistaniPhone('12345'), false);
  assert.equal(validatePakistaniPhone('04235890000'), false); // Landline
});

test('validateEmail validates proper email addresses', () => {
  assert.equal(validateEmail('client@nexora.pk'), true);
  assert.equal(validateEmail('user.name+tag@domain.co'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);
});
