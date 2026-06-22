import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody, sanitizeInputs } from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../middleware/validation.schemas.js';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user with reference code validation
 * @access  Public
 * @body    {username, full_name, email, phone, password, confirm_password, wallet_password, reference_code}
 */
router.post(
  '/register',
  sanitizeInputs,
  validateBody(registerSchema),
  AuthController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 * @body    {username, password}
 */
router.post(
  '/login',
  sanitizeInputs,
  validateBody(loginSchema),
  AuthController.login
);

export default router;
