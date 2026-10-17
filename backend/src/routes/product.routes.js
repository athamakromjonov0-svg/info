import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, adminOnly, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(optionalAuth, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(optionalAuth, updateProduct)
  .delete(optionalAuth, deleteProduct);

export default router;
