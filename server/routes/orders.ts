import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';
import type { OrderStatus } from '../../src/types/index.ts';

export const ordersRouter = Router();

// GET /api/orders
ordersRouter.get('/', (req: Request, res: Response) => {
  try {
    const orders = storeDb.getOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/:id
ordersRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const order = storeDb.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders
ordersRouter.post('/', (req: Request, res: Response) => {
  try {
    const { items, customer, paymentMethod, promoCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least 1 item' });
    }
    if (!customer) {
      return res.status(400).json({ success: false, error: 'Customer details are required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ success: false, error: 'Payment method is required' });
    }

    const order = storeDb.createOrder({
      items,
      customer,
      paymentMethod,
      promoCode,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to place order',
    });
  }
});

// PATCH /api/orders/:id/status
ordersRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const allowedStatuses: OrderStatus[] = [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const updated = storeDb.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});
