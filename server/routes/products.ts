import { Router, Request, Response } from 'express';
import { storeDb } from '../data/storeData.ts';

export const productsRouter = Router();

// GET /api/products
productsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, inStockOnly } = req.query;

    const filters = {
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      inStockOnly: inStockOnly === 'true',
    };

    const products = storeDb.getProducts(filters);
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:id
productsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const product = storeDb.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products (Admin create)
productsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Product name, price, and category are required',
      });
    }

    const created = storeDb.createProduct(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/products/:id (Admin update)
productsRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = storeDb.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/products/:id (Admin delete)
productsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = storeDb.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
