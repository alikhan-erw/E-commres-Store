import test from 'node:test';
import assert from 'node:assert/strict';
import { storeDb } from './storeData.ts';

test('storeDb.getProducts returns seeded products', () => {
  const allProducts = storeDb.getProducts();
  assert.ok(allProducts.length > 0, 'Should return products');
});

test('storeDb.getProducts filters by category', () => {
  const shoes = storeDb.getProducts({ category: 'Shoes' });
  assert.ok(shoes.length > 0);
  assert.ok(shoes.every(p => p.category === 'Shoes'));
});

test('storeDb.createProduct adds a new item and retrieves it', () => {
  const created = storeDb.createProduct({
    name: 'ZEVORA Test Runner Pro',
    category: 'Shoes',
    price: 35000,
    stock: 5,
  });

  assert.equal(created.name, 'ZEVORA Test Runner Pro');
  assert.equal(created.price, 35000);

  const found = storeDb.getProductById(created.id);
  assert.ok(found);
  assert.equal(found?.id, created.id);
});

test('storeDb.createOrder rejects order with invalid phone', () => {
  assert.throws(
    () => {
      storeDb.createOrder({
        items: [
          {
            cartId: 'test-1',
            product: storeDb.getProducts()[0],
            selectedSize: 'M',
            selectedColor: { name: 'Black', hex: '#000000' },
            quantity: 1,
          },
        ],
        customer: {
          fullName: 'Ali Ahmad',
          email: 'ali@domain.com',
          phone: '12345', // Invalid phone
          address: 'Main Boulevard',
          city: 'Lahore',
          postalCode: '54000',
          country: 'Pakistan',
        },
        paymentMethod: 'Cash on Delivery (COD)',
      });
    },
    /Pakistani mobile number/
  );
});

test('storeDb.createOrder creates order and deducts stock', () => {
  const product = storeDb.getProducts()[0];
  const initialStock = product.stock;

  const order = storeDb.createOrder({
    items: [
      {
        cartId: 'test-item',
        product,
        selectedSize: 'Standard',
        selectedColor: { name: 'Black', hex: '#000000' },
        quantity: 1,
      },
    ],
    customer: {
      fullName: 'Babar Azam',
      email: 'babar@cricket.pk',
      phone: '03009876543',
      address: 'Gaddafi Stadium Road',
      city: 'Lahore',
      postalCode: '54000',
      country: 'Pakistan',
    },
    paymentMethod: 'Cash on Delivery (COD)',
    promoCode: 'ZEVORA10',
  });

  assert.ok(order.id.startsWith('ZV-'));
  assert.ok(order.trackingNumber);
  assert.equal(order.status, 'Confirmed');
  assert.equal(product.stock, initialStock - 1);
});

test('storeDb.updateOrderStatus updates order status correctly', () => {
  const orders = storeDb.getOrders();
  const firstOrder = orders[0];
  const updated = storeDb.updateOrderStatus(firstOrder.id, 'Delivered');

  assert.ok(updated);
  assert.equal(updated?.status, 'Delivered');
});

test('storeDb.subscribeNewsletter registers email and returns voucher', () => {
  const res = storeDb.subscribeNewsletter('vip.client@zevora.pk');
  assert.equal(res.success, true);
  assert.equal(res.promoCode, 'ZEVORA10');
  assert.equal(res.discountPercent, 10);
});

test('storeDb.saveContactMessage logs inquiry with ticket ID', () => {
  const inq = storeDb.saveContactMessage({
    name: 'Sara Khan',
    email: 'sara@domain.pk',
    message: 'Inquiring about bespoke sizing options for coats.',
  });

  assert.ok(inq.id.startsWith('inq-'));
  assert.equal(inq.name, 'Sara Khan');
  assert.equal(inq.status, 'New');
});

test('storeDb.getAdminStats calculates metrics', () => {
  const stats = storeDb.getAdminStats();
  assert.ok(stats.totalOrders >= 2);
  assert.ok(stats.totalRevenue > 0);
  assert.ok(stats.totalProducts > 0);
});
