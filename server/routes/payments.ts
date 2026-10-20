import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';

export const paymentsRouter = Router();

// GET /api/payments (Admin list of transactions)
paymentsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const transactions = storeDb.getPaymentTransactions();
    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/payments (Record a payment transaction)
paymentsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { orderId, customerEmail, paymentMethod, amount, accountNumber, transactionReference, notes } = req.body;
    if (!orderId || !customerEmail || !paymentMethod || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Order ID, customer email, payment method, and amount are required',
      });
    }

    const transaction = storeDb.createPaymentTransaction({
      orderId,
      customerEmail,
      paymentMethod,
      amount: Number(amount),
      accountNumber,
      transactionReference,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Payment transaction logged successfully in secure records',
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});
