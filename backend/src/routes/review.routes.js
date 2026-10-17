import express from 'express';
import {
  getProductReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalAuth, createReview);

router.get('/:productId', getProductReviews);
router.delete('/:id', optionalAuth, deleteReview);

export default router;
