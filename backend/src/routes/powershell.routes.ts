import express from 'express';

import { getScript, getScriptLatest } from '../controllers/powershell.controller.js';
import { powershellAccess } from '../middlewares/powershell.middleware.js';

const router = express.Router();

router.get('/:action/:name', powershellAccess, getScriptLatest);
router.get('/:action/:name/:version', powershellAccess, getScript);

export default router;
