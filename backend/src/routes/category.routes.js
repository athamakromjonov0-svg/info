import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(optionalAuth, createCategory);

router.route('/:id')
  .put(optionalAuth, updateCategory)
  .delete(optionalAuth, deleteCategory);

export default router;
