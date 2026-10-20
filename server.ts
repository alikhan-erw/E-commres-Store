import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { productsRouter } from './server/routes/products.ts';
import { ordersRouter } from './server/routes/orders.ts';
import { promoRouter } from './server/routes/promo.ts';
import { authRouter } from './server/routes/auth.ts';
import { contactRouter } from './server/routes/contact.ts';
import { newsletterRouter } from './server/routes/newsletter.ts';
import { adminRouter } from './server/routes/admin.ts';
import { reviewsRouter } from './server/routes/reviews.ts';
import { paymentsRouter } from './server/routes/payments.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Status & Health
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      store: 'ZEVORA Luxury E-Commerce API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount modular REST API routers
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/promo', promoRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/payments', paymentsRouter);

  // Vite dev middleware or production static serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZEVORA] Full-Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
