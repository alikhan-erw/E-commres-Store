import { Router, Request, Response } from 'express';
import { evaluatePromoCode, calculateCartTotals } from '../../src/utils/cartLogic.ts';

export const promoRouter = Router();

// POST /api/promo/validate
promoRouter.post('/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal, items } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'Promo code is required' });
    }

    const numericSubtotal = Number(subtotal) || 0;
    const result = evaluatePromoCode(code, numericSubtotal);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: result.message || 'Invalid or expired promotional code',
        suggested: 'Try ZEVORA10 for 10% off',
      });
    }

    let cartTotals = null;
    if (items && Array.isArray(items)) {
      cartTotals = calculateCartTotals(items, code);
    }

    res.json({
      success: true,
      valid: true,
      data: {
        code: result.code,
        discountAmount: result.discountAmount,
        discountPercent: result.discountPercent,
        message: result.message,
        cartTotals,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
