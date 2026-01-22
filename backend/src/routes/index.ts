/**
 * Main Routes Configuration
 * 
 * Central routing file that imports and configures all route modules
 * 
 * @module routes
 */

import { Router } from 'express';
import chatRoutes from './chatRoutes';

const router = Router();

// API Routes
router.use('/api', chatRoutes);

export default router;
