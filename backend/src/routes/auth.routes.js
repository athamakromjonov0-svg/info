import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/users', protect, adminOnly, createUser);
router.put('/users/:id', protect, adminOnly, updateUser);
router.patch('/users/:id/status', protect, adminOnly, toggleUserStatus);
router.patch('/users/:id/role', protect, adminOnly, updateUserRole);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
