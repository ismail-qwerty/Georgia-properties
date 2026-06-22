import { Router } from 'express';
import { SpecialLotsController } from '../controllers/specialLots.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication and admin access
router.use(authenticate);
router.use(requireAdmin);

// Get all special lots
router.get('/', SpecialLotsController.getAllSpecialLots);

// Get special lot by ID
router.get('/:id', SpecialLotsController.getSpecialLotById);

// Create special lot
router.post('/', SpecialLotsController.createSpecialLot);

// Update special lot
router.put('/:id', SpecialLotsController.updateSpecialLot);

// Delete special lot
router.delete('/:id', SpecialLotsController.deleteSpecialLot);

export default router;
