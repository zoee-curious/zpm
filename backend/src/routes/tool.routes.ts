import express from 'express';

import {
  createTool,
  deleteTool,
  getAllTool,
  getAsset,
  getTool,
  updateTool,
} from '../controllers/tool.controller.js';
import { auth } from '../middlewares/tool.middleware.js';

const router = express.Router();

router.get('/:name/:version', getTool);
router.get('/', getAllTool);

router.post('/', auth, createTool);
router.patch('/', auth, updateTool);

router.delete('/:name/:version', auth, deleteTool);

router.get('/download/asset/:action/:name/:version', getAsset);

export default router;
