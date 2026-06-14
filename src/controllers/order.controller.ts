import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { ResponseUtil } from '../utils/response.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AuthenticatedRequest } from '../middleware/verifyToken.js';

export class OrderController {
  /**
   * @route   POST /api/v1/users/orders/generate
   * @desc    Generate/Execute next available task (Generate Lots)
   * @access  Private
   */
  static generateLot = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return ResponseUtil.unauthorized(res, 'Authentication required');
    }

    const result = await OrderService.generateLot(user.id);

    return ResponseUtil.success(
      res,
      result,
      `Task completed successfully! You earned VIEWS ${result.order.commission.toFixed(2)}`
    );
  });

  /**
   * @route   GET /api/v1/users/orders
   * @desc    Get user's order/task history
   * @access  Private
   */
  static getOrderHistory = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return ResponseUtil.unauthorized(res, 'Authentication required');
    }

    const { status, page, limit } = req.query;

    const result = await OrderService.getOrderHistory(
      user.id,
      status as any,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10
    );

    return ResponseUtil.success(res, result);
  });

  /**
   * @route   GET /api/v1/users/orders/stats
   * @desc    Get user's daily task statistics
   * @access  Private
   */
  static getDailyStats = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return ResponseUtil.unauthorized(res, 'Authentication required');
    }

    const result = await OrderService.getDailyStats(user.id);

    return ResponseUtil.success(res, result);
  });
}
