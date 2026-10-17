import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { isDbConnected } from '../config/db.js';
import { getDb } from '../utils/fallbackStore.js';

// @desc    Admin dashboard umumiy statistikalari
// @route   GET /api/stats/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const data = getDb();
      const prods = data.products || [];
      const cats = data.categories || [];
      const orders = data.orders || [];
      const users = data.users || [];
      const activities = data.activityLogs || [];

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      // Oylik daromad grafigi
      const monthlyMap = {};
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        const key = (d.getMonth() + 1) + '/' + d.getFullYear();
        if (!monthlyMap[key]) monthlyMap[key] = { month: key, total: 0, count: 0 };
        monthlyMap[key].total += Number(o.total) || 0;
        monthlyMap[key].count += 1;
      });
      const monthlySales = Object.values(monthlyMap).sort((a, b) => new Date(a.month) - new Date(b.month));

      return res.json({
        success: true,
        stats: {
          totalProducts: prods.length,
          totalCategories: cats.length,
          totalOrders,
          totalRevenue,
          totalUsers: users.length,
          lowStockProducts: prods.filter(p => Number(p.stock) < 5).length,
          discountedProducts: prods.filter(p => Number(p.discount) > 0).length,
          newProducts: prods.filter(p => Boolean(p.isNew)).length,
        },
        recentOrders: [...orders].slice(0, 5),
        recentActivities: [...activities].slice(0, 10),
        monthlySales,
      });
    }

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 } });
    const discountedProducts = await Product.countDocuments({ discount: { $gt: 0 } });
    const newProducts = await Product.countDocuments({ isNew: true });

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const recentActivities = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);

    // Oylik daromad grafigi
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        totalUsers,
        lowStockProducts,
        discountedProducts,
        newProducts,
      },
      recentOrders,
      recentActivities,
      monthlySales,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Faoliyatlar tarixini olish
// @route   GET /api/stats/activities
export const getActivities = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json((getDb().activityLogs || []).slice(0, 50));
    }
    const activities = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};