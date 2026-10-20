import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';

export const reviewsRouter = Router();

// GET /api/reviews (all or by productId)
reviewsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const reviews = storeDb.getReviews(productId ? String(productId) : undefined);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/reviews (submit new review)
reviewsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { author, location, rating, comment, productId } = req.body;
    if (!author?.trim() || !comment?.trim()) {
      return res.status(400).json({ success: false, error: 'Author name and review comment are required' });
    }
    const numRating = Number(rating) || 5;
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5 stars' });
    }

    const review = storeDb.addReview({
      author: author.trim(),
      location: location?.trim() || 'Pakistan',
      rating: numRating,
      comment: comment.trim(),
      productId: productId ? String(productId) : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Review published successfully to ZEVORA verified records',
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});
