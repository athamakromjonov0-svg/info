import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { getDb } from '../utils/fallbackStore.js';

// Lokal (offline) rejim: MongoDB ulanmagan paytda barcha so'rovlar
// lokal ma'lumotlar bazasiga (db.json) ishlaydi. Shunda admin panel
// hech qanday token talab qilmay to'liq ishlaydi.
const localAdminUser = {
  id: 'local-admin',
  _id: 'local-admin',
  name: 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@premium.com',
  role: 'admin',
  status: 'active',
};

export const protect = async (req, res, next) => {
  if (!isDbConnected()) {
    req.user = { ...localAdminUser };
    return next();
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_2026_premium_ecommerce_platform');
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }

      if (req.user.status === 'blocked') {
        return res.status(403).json({ success: false, message: "Ushbu hisob bloklangan" });
      }

      return next();
    } catch (error) {
      console.error('Auth verify xato:', error.message);
      return res.status(401).json({ success: false, message: "Avtorizatsiya yaroqsiz yoki muddati o'tgan" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Token topilmadi, iltimos tizimga kiring" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Faqat administratorlar uchun ruxsat berilgan" });
  }
};

export const optionalAuth = async (req, res, next) => {
  if (!isDbConnected()) {
    req.user = { ...localAdminUser };
    return next();
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_2026_premium_ecommerce_platform');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // optional, continue as guest
    }
  }
  next();
};