import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, name, phone } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    const customer = storeDb.loginOrRegisterCustomer(email, name, phone);
    const profile = storeDb.getCustomerProfile(email);

    res.json({
      success: true,
      message: 'Client portal session initiated',
      data: profile || customer,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/auth/profile?email=...
authRouter.get('/profile', (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email query parameter is required' });
    }

    const profile = storeDb.getCustomerProfile(email);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/auth/profile (Update 1-click checkout and contact details)
authRouter.put('/profile', (req: Request, res: Response) => {
  try {
    const { email, name, phone, defaultAddress, savedPaymentMethod, savedPaymentAccount } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    const updated = storeDb.updateCustomerProfile(email, {
      name,
      phone,
      defaultAddress,
      savedPaymentMethod,
      savedPaymentAccount,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.json({
      success: true,
      message: '1-Click checkout preferences and account details saved successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

