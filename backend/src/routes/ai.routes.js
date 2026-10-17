import express from 'express';
import {
  chatWithAi,
  analyzeProject,
  testApiKey,
  getAiStatus,
  generateImageController,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithAi);
router.post('/generate-image', generateImageController);
router.post('/analyze', analyzeProject);
router.post('/test-key', testApiKey);
router.get('/status', getAiStatus);

export default router;
