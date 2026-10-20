import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';

export const adminRouter = Router();

// GET /api/admin/stats
adminRouter.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = storeDb.getAdminStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
