import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';
import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { getFallbackData, saveDb } from '../utils/fallbackStore.js';

const findProductQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { legacyId: id }] };
  }
  return { legacyId: id };
};

// @desc    Barcha mahsulotlarni olish (qidiruv, filter, saralash bilan)
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, search, discount, isNew, sort, limit, page } = req.query;

    if (!isDbConnected()) {
      // MongoDB hali ulanmagan bo'lsa db.json zaxirasidan tezkor taqdim etiladi
      let list = [...(getFallbackData().products || [])];

      if (category && category !== 'all') {
        list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
        );
      }
      if (discount === 'true') {
        list = list.filter(p => Number(p.discount) > 0);
      }
      if (isNew === 'true') {
        list = list.filter(p => Boolean(p.isNew));
      }

      if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sort === 'popular') list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));

      if (limit) {
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit);
        list = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);
      }

      res.setHeader('X-Database-Mode', 'fallback');
      return res.json(list);
    }

    let query = {};

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (discount === 'true') {
      query.discount = { $gt: 0 };
    }

    if (isNew === 'true') {
      query.isNew = true;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'popular') sortOptions = { reviewsCount: -1 };

    let productQuery = Product.find(query).sort(sortOptions);

    if (limit) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit);
      productQuery = productQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const products = await productQuery;

    if (req.query.format === 'object') {
      return res.json({ success: true, count: products.length, data: products });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bitta mahsulotni ID bo'yicha olish
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const list = getFallbackData().products || [];
      const item = list.find(p => String(p.id) === String(req.params.id));
      if (!item) return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
      return res.json(item);
    }

    const product = await Product.findOne(findProductQuery(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Yangi mahsulot qo'shish (Admin)
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { title, price, category, description, image, images, discount, stock, isNew, specs, featured } = req.body;

    if (!title || price === undefined || !category) {
      return res.status(400).json({ success: false, message: "Sarlavha, narx va kategoriya kiritilishi shart" });
    }

    if (!isDbConnected()) {
      const fallbackItem = {
        id: String(Date.now()),
        title,
        price: Number(price),
        category,
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
        images: images || [],
        discount: Number(discount) || 0,
        stock: Number(stock) || 0,
        isNew: Boolean(isNew),
        specs: specs || [],
        featured: Boolean(featured),
        rating: 5.0,
        reviewsCount: 0,
      };
      (getFallbackData().products || []).unshift(fallbackItem);
      saveDb();
      return res.status(201).json(fallbackItem);
    }

    const legacyId = String(Date.now());
    const product = await Product.create({
      legacyId,
      title,
      price: Number(price),
      category,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      images: images || [],
      discount: Number(discount) || 0,
      stock: Number(stock) || 0,
      isNew: Boolean(isNew),
      specs: specs || [],
      featured: Boolean(featured),
    });

    await ActivityLog.create({
      action: `Yangi mahsulot qo'shildi: ${product.title}`,
      user: req.user ? req.user.name : 'Admin',
      type: 'product',
      icon: 'Plus',
      time: 'Hozir',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mahsulotni yangilash (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const list = getFallbackData().products || [];
      const index = list.findIndex(p => String(p.id) === String(req.params.id));
      if (index === -1) return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
      list[index] = { ...list[index], ...req.body };
      saveDb();
      return res.json(list[index]);
    }

    const product = await Product.findOne(findProductQuery(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
    }

    Object.assign(product, req.body);
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.discount !== undefined) product.discount = Number(req.body.discount);
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);

    const updated = await product.save();

    await ActivityLog.create({
      action: `Mahsulot yangilandi: ${updated.title}`,
      user: req.user ? req.user.name : 'Admin',
      type: 'product',
      icon: 'Edit',
      time: 'Hozir',
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mahsulotni o'chirish (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const list = getFallbackData().products || [];
      const index = list.findIndex(p => String(p.id) === String(req.params.id));
      if (index !== -1) list.splice(index, 1);
      saveDb();
      return res.json({ success: true, message: "Mahsulot o'chirildi", id: req.params.id });
    }

    const product = await Product.findOneAndDelete(findProductQuery(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
    }

    await ActivityLog.create({
      action: `Mahsulot o'chirildi: ${product.title}`,
      user: req.user ? req.user.name : 'Admin',
      type: 'product',
      icon: 'Trash2',
      time: 'Hozir',
    });

    res.json({ success: true, message: "Mahsulot muvaffaqiyatli o'chirildi", id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
