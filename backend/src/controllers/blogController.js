import BlogPost from '../models/BlogPost.js';
import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { getDb, saveDb } from '../utils/fallbackStore.js';

const findFallbackPost = (id) => {
  const posts = getDb().blogPosts || [];
  const key = String(id);
  return posts.find(p => String(p.id) === key || String(p.legacyId) === key || p.slug === key);
};

// @desc    Barcha maqolalarni olish
// @route   GET /api/blog
export const getBlogPosts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(getDb().blogPosts || []);
    }
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bitta maqolani olish (ID yoki slug)
// @route   GET /api/blog/:id
export const getBlogPostById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!isDbConnected()) {
      const post = findFallbackPost(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Maqola topilmadi" });
      }
      post.views = (post.views || 0) + 1;
      saveDb();
      return res.json(post);
    }

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { legacyId: Number(id) || -1 }, { slug: id }] };
    } else {
      query = { $or: [{ legacyId: Number(id) || -1 }, { slug: id }] };
    }

    const post = await BlogPost.findOne(query);
    if (!post) {
      return res.status(404).json({ success: false, message: "Maqola topilmadi" });
    }

    // Ko'rishlar sonini oshirish
    post.views = (post.views || 0) + 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Maqolaga like bosish
// @route   POST /api/blog/:id/like
export const likeBlogPost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!isDbConnected()) {
      const post = findFallbackPost(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Maqola topilmadi" });
      }
      post.likes = (post.likes || 0) + 1;
      saveDb();
      return res.json({ success: true, likes: post.likes });
    }

    const post = await BlogPost.findOne({
      $or: [
        mongoose.Types.ObjectId.isValid(id) ? { _id: id } : null,
        { legacyId: Number(id) || -1 },
        { slug: id }
      ].filter(Boolean)
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Maqola topilmadi" });
    }

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.json({ success: true, likes: post.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Maqola yaratish (Admin)
// @route   POST /api/blog
export const createBlogPost = async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, image, author, tags } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Sarlavha kiritilishi shart" });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9\u0400-\u04FF]+/g, '-').replace(/(^-|-$)/g, '');
    const legacyId = Date.now();

    if (!isDbConnected()) {
      const post = {
        id: legacyId,
        legacyId,
        title: title.trim(),
        slug,
        excerpt: excerpt || '',
        content: Array.isArray(content) ? content : (content ? [content] : []),
        category: category || 'Yangiliklar',
        readTime: Number(readTime) || 5,
        image: image || '/banner/banner1.png',
        author: author || 'Admin',
        tags: tags || [],
        views: 0,
        likes: 0,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      };
      const dbData = getDb();
      dbData.blogPosts = dbData.blogPosts || [];
      dbData.blogPosts.unshift(post);
      saveDb();
      return res.status(201).json(post);
    }

    const post = await BlogPost.create({
      legacyId,
      title: title.trim(),
      slug,
      excerpt: excerpt || '',
      content: Array.isArray(content) ? content : (content ? [content] : []),
      category: category || 'Yangiliklar',
      readTime: Number(readTime) || 5,
      image: image || '/banner/banner1.png',
      author: author || 'Admin',
      tags: tags || [],
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Maqolani yangilash (Admin)
// @route   PUT /api/blog/:id
export const updateBlogPost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!isDbConnected()) {
      const post = findFallbackPost(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Maqola topilmadi" });
      }
      Object.assign(post, req.body);
      saveDb();
      return res.json(post);
    }

    const post = await BlogPost.findOne({
      $or: [
        mongoose.Types.ObjectId.isValid(id) ? { _id: id } : null,
        { legacyId: Number(id) || -1 },
        { slug: id }
      ].filter(Boolean)
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Maqola topilmadi" });
    }

    Object.assign(post, req.body);
    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Maqolani o'chirish (Admin)
// @route   DELETE /api/blog/:id
export const deleteBlogPost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!isDbConnected()) {
      const posts = getDb().blogPosts || [];
      const index = posts.findIndex(p => String(p.id) === String(id) || String(p.legacyId) === String(id) || p.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Maqola topilmadi" });
      }
      posts.splice(index, 1);
      saveDb();
      return res.json({ success: true, message: "Maqola o'chirildi" });
    }

    const post = await BlogPost.findOneAndDelete({
      $or: [
        mongoose.Types.ObjectId.isValid(id) ? { _id: id } : null,
        { legacyId: Number(id) || -1 },
        { slug: id }
      ].filter(Boolean)
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Maqola topilmadi" });
    }

    res.json({ success: true, message: "Maqola o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};