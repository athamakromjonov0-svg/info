import express from 'express';
import { getDashboardStats, getActivities } from '../controllers/statsController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', optionalAuth, getDashboardStats);
router.get('/activities', optionalAuth, getActivities);

export default router;
