import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ResponseUtil } from '../utils/response.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AuthenticatedRequest } from '../middleware/verifyToken.js';

export class AdminController {
  /**
   * @route   GET /api/v1/admin/users
   * @desc    Get paginated list of all users
   * @access  Admin
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, user_status, wallet_status, tier_id, search } = req.query;

    const result = await AdminService.getAllUsers(
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10,
      {
        user_status,
        wallet_status,
        tier_id: tier_id ? parseInt(tier_id as string) : undefined,
        search,
      }
    );

    return ResponseUtil.success(res, result);
  });

  /**
   * @route   GET /api/v1/admin/users/:id
   * @desc    Get specific user details
   * @access  Admin
   */
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.getUserById(id);

    return ResponseUtil.success(res, result);
  });

  /**
   * @route   PUT /api/v1/admin/users/:id
   * @desc    Update user account settings (supports independent status controls)
   * @access  Admin
   */
  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const admin = (req as AuthenticatedRequest).user;

    if (!admin) {
      return ResponseUtil.unauthorized(res, 'Authentication required');
    }

    const result = await AdminService.updateUser(id, req.body, admin.id);

    return ResponseUtil.success(
      res,
      result,
      'User account updated successfully'
    );
  });

  /**
   * @route   POST /api/v1/admin/users/:id/debit
   * @desc    Apply manual debit to user wallet
   * @access  Admin
   */
  static applyDebit = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount, reason, notes } = req.body;
    const admin = (req as AuthenticatedRequest).user;

    if (!admin) {
      return ResponseUtil.unauthorized(res, 'Authentication required');
    }

    const result = await AdminService.applyDebit(
      id,
      amount,
      reason,
      admin.id,
      notes
    );

    return ResponseUtil.success(
      res,
      result,
      `Debit of VIEWS ${amount.toFixed(2)} applied successfully`
    );
  });

  /**
   * @route   POST /api/v1/admin/users/:id/orders/assign
   * @desc    Assign 3 properties to user for task execution
   * @access  Admin
   */
  static assignOrders = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { property_ids, sequence_after_order_no } = req.body;
    const admin = (req as AuthenticatedRequest).user;

    if (!admin) {
      return ResponseUtil.unauthorized(res, 'Authentication required');
    }

    const result = await AdminService.assignOrders(
      id,
      property_ids,
      sequence_after_order_no || 0,
      admin.id
    );

    return ResponseUtil.success(
      res,
      result,
      'Properties assigned successfully. User can now execute tasks.'
    );
  });
}
