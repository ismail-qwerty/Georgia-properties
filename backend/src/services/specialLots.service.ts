import { supabaseAdmin } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export class SpecialLotsService {
  // Get all special lots
  static async getAllSpecialLots(filters: { status?: string; limit?: number } = {}) {
    const { status = 'Active', limit = 1000 } = filters;

    let query = supabaseAdmin
      .from('properties')
      .select('*')
      .eq('lot_type', 'special')
      .order('value', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(500, 'Failed to fetch special lots');
    }

    return data;
  }

  // Get special lot by ID
  static async getSpecialLotById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('special_lots')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError(404, 'Special lot not found');
    }

    return data;
  }

  // Create special lot
  static async createSpecialLot(lotData: any) {
    const { data, error } = await supabaseAdmin
      .from('special_lots')
      .insert(lotData)
      .select()
      .single();

    if (error) {
      throw new AppError(500, 'Failed to create special lot');
    }

    return data;
  }

  // Update special lot
  static async updateSpecialLot(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('special_lots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(500, 'Failed to update special lot');
    }

    return data;
  }

  // Delete special lot
  static async deleteSpecialLot(id: string) {
    const { error } = await supabaseAdmin
      .from('special_lots')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(500, 'Failed to delete special lot');
    }

    return { success: true };
  }
}
