import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { isDbConnected } from '../config/db.js';
import { getDb, saveDb } from '../utils/fallbackStore.js';

// Mahsulotning o'rtacha reytingini yangilash (fallback rejim)
const updateFallbackProductRating = (productId) => {
  const dbData = getDb();
  const reviews = (dbData.reviews || []).filter(r => String(r.productId) === String(productId));
  const product = (dbData.products || []).find(p =>
    String(p.id) === String(productId) || String(p.legacyId) === String(productId) || String(p._id) === String(productId)
  );
  if (!product) return;
  if (reviews.length === 0) return;
  const avg = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
  product.rating = Math.round(avg * 10) / 10;
  product.reviewsCount = reviews.length;
};

// @desc    Mahsulot sharhlarini olish
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const reviews = (getDb().reviews || [])
        .filter(r => String(r.productId) === String(req.params.productId))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return res.json(reviews);
    }
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sharh qoldirish
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring" });
    }

    if (!isDbConnected()) {
      const review = {
        id: `REV-${Date.now()}`,
        productId: String(productId),
        userId: req.user ? req.user.id : null,
        userName: userName || (req.user ? req.user.name : "Foydalanuvchi"),
        rating: Number(rating),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      const dbData = getDb();
      dbData.reviews = dbData.reviews || [];
      dbData.reviews.push(review);
      updateFallbackProductRating(productId);
      saveDb();
      return res.status(201).json(review);
    }

    const review = await Review.create({
      productId: String(productId),
      userId: req.user ? req.user._id : null,
      userName: userName || (req.user ? req.user.name : "Foydalanuvchi"),
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Mahsulotning o'rtacha reytingini qayta hisoblash
    const allReviews = await Review.find({ productId: String(productId) });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findOneAndUpdate(
      { $or: [{ _id: productId }, { legacyId: String(productId) }] },
      {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: allReviews.length,
      }
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sharhni o'chirish (Admin)
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const reviews = getDb().reviews || [];
      const index = reviews.findIndex(r => String(r.id) === String(req.params.id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Sharh topilmadi" });
      }
      const removed = reviews.splice(index, 1)[0];
      if (removed) updateFallbackProductRating(removed.productId);
      saveDb();
      return res.json({ success: true, message: "Sharh o'chirildi" });
    }

    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Sharh topilmadi" });
    }
    res.json({ success: true, message: "Sharh o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};