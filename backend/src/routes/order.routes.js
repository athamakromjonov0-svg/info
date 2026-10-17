import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, adminOnly, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalAuth, createOrder)
  .get(optionalAuth, getAllOrders);

router.get('/my', protect, getMyOrders);

router.route('/:id/status')
  .patch(optionalAuth, updateOrderStatus);

router.route('/:id')
  .delete(optionalAuth, deleteOrder);

export default router;
