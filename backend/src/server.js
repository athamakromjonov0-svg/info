import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB, { isDbConnected } from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Marshrutlar (Routes)
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import orderRoutes from './routes/order.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import deliveryZoneRoutes from './routes/deliveryZone.routes.js';
import blogRoutes from './routes/blog.routes.js';
import reviewRoutes from './routes/review.routes.js';
import statsRoutes from './routes/stats.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ma'lumotlar bazasiga ulanish
connectDB();

const app = express();

// Global middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Statik fayllar (yuklangan rasmlar)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check va API holati
app.get(['/', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    message: 'Premium E-Commerce Real Backend API ishlamoqda',
    database: isDbConnected() ? 'connected' : 'disconnected (lokal xotira yoki Atlas URI kutilmoqda)',
    timestamp: new Date().toISOString(),
  });
});

// Asosiy API yo'nalishlari
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Json-server bilan to'liq orqaga moslashuvchanlik (Legacy routes)
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);

// Xatoliklarni ushlash
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[35m====================================================\x1b[0m`);
  console.log(`\x1b[32m🚀 Real Backend Server ishga tushdi: http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[34m📋 API Docs / Health: http://localhost:${PORT}/api/health\x1b[0m`);
  console.log(`\x1b[35m====================================================\x1b[0m`);
});

export default app;
