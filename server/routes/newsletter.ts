import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';

export const newsletterRouter = Router();

// POST /api/newsletter
newsletterRouter.post('/', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    const result = storeDb.subscribeNewsletter(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});
