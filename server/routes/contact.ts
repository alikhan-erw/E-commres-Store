import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';

export const contactRouter = Router();

// POST /api/contact
contactRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, orderId, message } = req.body;
    const entry = storeDb.saveContactMessage({ name, email, orderId, message });

    res.status(201).json({
      success: true,
      message: 'Transmission successfully received by ZEVORA Concierge',
      ticketId: entry.id,
      data: entry,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/contact (Admin list)
contactRouter.get('/', (_req: Request, res: Response) => {
  try {
    const messages = storeDb.getContactMessages();
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
