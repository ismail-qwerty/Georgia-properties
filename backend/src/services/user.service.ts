import { supabaseAdmin } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Logger } from '../utils/logger.js';

export class UserService {
  /**
   * Get authenticated user profile with wallet and membership info
   */
  static async getProfile(userId: string) {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(
          `
          id,
          username,
          full_name,
          email,
          phone,
          reference_code,
          referrer_id,
          tier_id,
          credibility,
          min_withdrawal,
          max_withdrawal,
          user_status,
          wallet_status,
          user_type,
          total_orders,
          created_at,
          last_login_at,
          membership_levels (
            id,
            name,
            order_limit,
            commission_rate
          ),
          wallets (
            balance,
            total_recharged,
            total_earned,
            total_withdrawn
          )
        `
        )
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new AppError(404, 'User profile not found');
      }

      // Get today's earnings
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayOrders } = await supabaseAdmin
        .from('orders')
        .select('commission')
        .eq('user_id', userId)
        .eq('status', 'Completed')
        .gte('created_at', today.toISOString());

      const todayEarnings = (todayOrders || []).reduce(
        (sum, order) => sum + Number(order.commission),
        0
      );

      // Get orders completed today count
      const { count: ordersToday } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'Completed')
        .gte('created_at', today.toISOString());

      // Extract first element from arrays (Supabase returns relationships as arrays)
      const wallet = Array.isArray(user.wallets) ? user.wallets[0] : user.wallets;
      const membership = Array.isArray(user.membership_levels) ? user.membership_levels[0] : user.membership_levels;

      return {
        ...user,
        membership: membership || null,
        wallet: wallet || null,
        today_earnings: todayEarnings,
        orders_today: ordersToday || 0,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in getProfile', { userId, error });
      throw new AppError(500, 'Failed to fetch user profile');
    }
  }
}
