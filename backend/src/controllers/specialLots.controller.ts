import { Request, Response, NextFunction } from 'express';
import { SpecialLotsService } from '../services/specialLots.service.js';
import { ResponseUtil } from '../utils/response.js';

export class SpecialLotsController {
  // Get all special lots
  static async getAllSpecialLots(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, limit } = req.query;
      const specialLots = await SpecialLotsService.getAllSpecialLots({
        status: status as string,
        limit: limit ? parseInt(limit as string) : 1000,
      });
      ResponseUtil.success(res, specialLots, 'Special lots retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Get special lot by ID
  static async getSpecialLotById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const specialLot = await SpecialLotsService.getSpecialLotById(id);
      ResponseUtil.success(res, specialLot, 'Special lot retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Create special lot
  static async createSpecialLot(req: Request, res: Response, next: NextFunction) {
    try {
      const specialLot = await SpecialLotsService.createSpecialLot(req.body);
      ResponseUtil.created(res, specialLot, 'Special lot created');
    } catch (error) {
      next(error);
    }
  }

  // Update special lot
  static async updateSpecialLot(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const specialLot = await SpecialLotsService.updateSpecialLot(id, req.body);
      ResponseUtil.success(res, specialLot, 'Special lot updated');
    } catch (error) {
      next(error);
    }
  }

  // Delete special lot
  static async deleteSpecialLot(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await SpecialLotsService.deleteSpecialLot(id);
      ResponseUtil.success(res, null, 'Special lot deleted');
    } catch (error) {
      next(error);
    }
  }
}
