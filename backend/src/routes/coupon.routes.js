import express from 'express';
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCoupons)
  .post(optionalAuth, createCoupon);

router.post('/validate', validateCoupon);

router.route('/:id')
  .put(optionalAuth, updateCoupon)
  .delete(optionalAuth, deleteCoupon);

export default router;
