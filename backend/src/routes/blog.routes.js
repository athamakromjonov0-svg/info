import express from 'express';
import {
  getBlogPosts,
  getBlogPostById,
  likeBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogPosts)
  .post(optionalAuth, createBlogPost);

router.route('/:id')
  .get(getBlogPostById)
  .put(optionalAuth, updateBlogPost)
  .delete(optionalAuth, deleteBlogPost);

router.post('/:id/like', likeBlogPost);

export default router;
