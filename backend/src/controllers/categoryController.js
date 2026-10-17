import Category from '../models/Category.js';
import ActivityLog from '../models/ActivityLog.js';
import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { getFallbackData, saveDb } from '../utils/fallbackStore.js';

const findCategoryQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { legacyId: id }, { slug: id }] };
  }
  return { $or: [{ legacyId: id }, { slug: id }] };
};

// @desc    Barcha kategoriyalarni olish
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const list = getFallbackData().categories || [];
      res.setHeader('X-Database-Mode', 'fallback');
      return res.json(list);
    }

    const categories = await Category.find().sort({ name: 1 });
    if (req.query.format === 'object') {
      return res.json({ success: true, count: categories.length, data: categories });
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Kategoriya yaratish (Admin)
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, slug, icon, image, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Kategoriya nomi kiritilishi shart" });
    }

    const finalSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const legacyId = String(Date.now());

    if (!isDbConnected()) {
      const fallbackCat = {
        id: legacyId,
        name: name.trim(),
        slug: finalSlug,
        icon: icon || '',
        image: image || '',
        description: description || '',
      };
      (getFallbackData().categories || []).push(fallbackCat);
      saveDb();
      return res.status(201).json(fallbackCat);
    }

    const category = await Category.create({
      legacyId,
      name: name.trim(),
      slug: finalSlug,
      icon: icon || '',
      image: image || '',
      description: description || '',
    });

    await ActivityLog.create({
      action: `Yangi kategoriya yaratildi: ${category.name}`,
      user: req.user ? req.user.name : 'Admin',
      type: 'category',
      icon: 'FolderPlus',
      time: 'Hozir',
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Kategoriyani yangilash (Admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const list = getFallbackData().categories || [];
      const index = list.findIndex(c => String(c.id) === String(req.params.id) || c.slug === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: "Kategoriya topilmadi" });
      list[index] = { ...list[index], ...req.body };
      saveDb();
      return res.json(list[index]);
    }

    const category = await Category.findOne(findCategoryQuery(req.params.id));
    if (!category) {
      return res.status(404).json({ success: false, message: "Kategoriya topilmadi" });
    }

    Object.assign(category, req.body);
    const updated = await category.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Kategoriyani o'chirish (Admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const list = getFallbackData().categories || [];
      const index = list.findIndex(c => String(c.id) === String(req.params.id) || c.slug === req.params.id);
      if (index !== -1) list.splice(index, 1);
      saveDb();
      return res.json({ success: true, message: "Kategoriya o'chirildi", id: req.params.id });
    }

    const category = await Category.findOneAndDelete(findCategoryQuery(req.params.id));
    if (!category) {
      return res.status(404).json({ success: false, message: "Kategoriya topilmadi" });
    }

    res.json({ success: true, message: "Kategoriya o'chirildi", id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
