import express from 'express';
import {
  getDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
} from '../controllers/deliveryZoneController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDeliveryZones)
  .post(optionalAuth, createDeliveryZone);

router.route('/:id')
  .put(optionalAuth, updateDeliveryZone)
  .delete(optionalAuth, deleteDeliveryZone);

export default router;
