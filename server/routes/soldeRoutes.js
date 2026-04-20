import express from 'express';
import { getSolde } from '../controllers/soldeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getSolde);

export default router;
