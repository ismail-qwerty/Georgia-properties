import { supabaseAdmin } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Logger } from '../utils/logger.js';

export class OrderService {
  /**
   * Generate/Execute next available task (Generate Lots)
   * Core business logic for task execution cycle
   */
  static async generateLot(userId: string) {
    try {
      Logger.info('Starting lot generation', { userId });

      // Step 1: Lock user record and fetch user data with tier info
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          username,
          user_status,
          tier_id,
          total_orders,
          membership_levels (
            name,
            order_limit,
            commission_rate
          )
        `)
        .eq('id', userId)
        .single();

      if (userError || !user) {
        throw new AppError(404, 'User not found');
      }

      // Step 2: Validate user account is active
      if (user.user_status !== 'Active') {
        throw new AppError(403, 'Your account is deactivated. Please contact support.');
      }

      const tier = user.membership_levels as any;
      if (!tier) {
        throw new AppError(500, 'User membership tier not found');
      }

      Logger.debug('User and tier data loaded', {
        userId,
        username: user.username,
        tierName: tier.name,
        orderLimit: tier.order_limit,
        totalOrders: user.total_orders,
      });

      // Step 3: Check daily order limit
      // Count today's completed orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { count: todayCount, error: countError } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'Completed')
        .gte('completed_at', todayISO);

      if (countError) {
        Logger.error('Failed to count daily orders', { userId, error: countError });
        throw new AppError(500, 'Failed to check daily order limit');
      }

      const ordersToday = todayCount || 0;

      Logger.debug('Daily order check', {
        userId,
        ordersToday,
        orderLimit: tier.order_limit,
      });

      if (ordersToday >= tier.order_limit) {
        throw new AppError(
          429,
          `Daily order limit reached. You have completed ${ordersToday}/${tier.order_limit} orders today. Please try again tomorrow.`
        );
      }

      // Step 4: Query user's assigned pending orders that meet sequence requirements
      const { data: pendingOrders, error: ordersError } = await supabaseAdmin
        .from('orders')
        .select(`
          id,
          property_id,
          task_value,
          commission,
          sequence_after_order_no,
          properties (
            id,
            title,
            price,
            status
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'Pending')
        .lte('sequence_after_order_no', user.total_orders)
        .order('sequence_after_order_no', { ascending: true })
        .order('id', { ascending: true });

      if (ordersError) {
        Logger.error('Failed to fetch pending orders', { userId, error: ordersError });
        throw new AppError(500, 'Failed to fetch assigned orders');
      }

      if (!pendingOrders || pendingOrders.length === 0) {
        throw new AppError(
          400,
          'No available tasks. Please contact admin to assign properties to your account.'
        );
      }

      // Step 5: Select the first available order
      const selectedOrder = pendingOrders[0];
      const property = selectedOrder.properties as any;

      if (!property) {
        throw new AppError(500, 'Property data not found for assigned order');
      }

      if (property.status !== 'Active') {
        throw new AppError(400, 'Assigned property is no longer active. Please contact admin.');
      }

      Logger.info('Order selected for execution', {
        userId,
        orderId: selectedOrder.id,
        propertyId: property.id,
        propertyTitle: property.title,
        taskValue: selectedOrder.task_value,
        commission: selectedOrder.commission,
      });

      // Step 6: Execute atomic transaction
      // Update order status, wallet balance, and user total_orders
      const { error: updateOrderError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'Completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', selectedOrder.id)
        .eq('status', 'Pending'); // Prevent race condition

      if (updateOrderError) {
        Logger.error('Failed to update order status', {
          orderId: selectedOrder.id,
          error: updateOrderError,
        });
        throw new AppError(500, 'Failed to complete order');
      }

      // Step 7: Update wallet balance and earnings
      const { data: wallet, error: walletError } = await supabaseAdmin
        .from('wallets')
        .select('balance, total_earned')
        .eq('user_id', userId)
        .single();

      if (walletError || !wallet) {
        Logger.error('Failed to fetch wallet', { userId, error: walletError });
        throw new AppError(500, 'Failed to access wallet');
      }

      const newBalance = Number(wallet.balance) + Number(selectedOrder.commission);
      const newTotalEarned = Number(wallet.total_earned) + Number(selectedOrder.commission);

      const { error: updateWalletError } = await supabaseAdmin
        .from('wallets')
        .update({
          balance: newBalance,
          total_earned: newTotalEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateWalletError) {
        Logger.error('Failed to update wallet', { userId, error: updateWalletError });
        // Rollback order status
        await supabaseAdmin
          .from('orders')
          .update({ status: 'Pending', completed_at: null })
          .eq('id', selectedOrder.id);
        throw new AppError(500, 'Failed to credit wallet. Transaction rolled back.');
      }

      // Step 8: Increment user's total_orders counter
      const { error: updateUserError } = await supabaseAdmin
        .from('users')
        .update({
          total_orders: user.total_orders + 1,
        })
        .eq('id', userId);

      if (updateUserError) {
        Logger.error('Failed to update user total_orders', { userId, error: updateUserError });
        // Continue anyway - this is non-critical
      }

      // Step 9: Fetch updated wallet data
      const { data: updatedWallet } = await supabaseAdmin
        .from('wallets')
        .select('balance, total_earned')
        .eq('user_id', userId)
        .single();

      Logger.info('Lot generation completed successfully', {
        userId,
        username: user.username,
        orderId: selectedOrder.id,
        commission: selectedOrder.commission,
        newBalance: newBalance,
        ordersToday: ordersToday + 1,
        totalOrders: user.total_orders + 1,
      });

      return {
        success: true,
        order: {
          id: selectedOrder.id,
          property: {
            id: property.id,
            title: property.title,
            price: property.price,
          },
          task_value: selectedOrder.task_value,
          commission: selectedOrder.commission,
          completed_at: new Date().toISOString(),
        },
        wallet: {
          balance: updatedWallet?.balance || newBalance,
          total_earned: updatedWallet?.total_earned || newTotalEarned,
        },
        daily_stats: {
          orders_completed_today: ordersToday + 1,
          orders_remaining_today: tier.order_limit - (ordersToday + 1),
          daily_limit: tier.order_limit,
        },
        lifetime_stats: {
          total_orders: user.total_orders + 1,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in generateLot', { userId, error });
      throw new AppError(500, 'An unexpected error occurred while generating lot');
    }
  }

  /**
   * Get user's order history with filters
   */
  static async getOrderHistory(
    userId: string,
    status?: 'Pending' | 'Completed' | 'Undone',
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('orders')
        .select(
          `
          id,
          task_value,
          commission,
          status,
          created_at,
          completed_at,
          properties (
            id,
            title,
            description,
            image_url,
            price
          )
        `,
          { count: 'exact' }
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: orders, count, error } = await query;

      if (error) {
        Logger.error('Failed to fetch order history', { userId, error });
        throw new AppError(500, 'Failed to fetch order history');
      }

      return {
        orders: orders || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in getOrderHistory', { userId, error });
      throw new AppError(500, 'Failed to fetch order history');
    }
  }

  /**
   * Get user's daily task statistics
   */
  static async getDailyStats(userId: string) {
    try {
      // Get user tier info
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select(
          `
          id,
          total_orders,
          membership_levels (
            name,
            order_limit,
            commission_rate
          )
        `
        )
        .eq('id', userId)
        .single();

      if (userError || !user) {
        throw new AppError(404, 'User not found');
      }

      const tier = user.membership_levels as any;

      // Count today's completed orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { count: todayCount, error: countError } = await supabaseAdmin
        .from('orders')
        .select('id, commission', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'Completed')
        .gte('completed_at', todayISO);

      // Calculate today's earnings
      const { data: todayOrders } = await supabaseAdmin
        .from('orders')
        .select('commission')
        .eq('user_id', userId)
        .eq('status', 'Completed')
        .gte('completed_at', todayISO);

      const todayEarnings = todayOrders?.reduce(
        (sum, order) => sum + Number(order.commission),
        0
      ) || 0;

      // Count pending orders
      const { count: pendingCount } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'Pending')
        .lte('sequence_after_order_no', user.total_orders);

      return {
        daily: {
          completed: todayCount || 0,
          remaining: tier.order_limit - (todayCount || 0),
          limit: tier.order_limit,
          earnings: todayEarnings,
        },
        pending_tasks: pendingCount || 0,
        total_lifetime_orders: user.total_orders,
        tier: {
          name: tier.name,
          commission_rate: tier.commission_rate,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in getDailyStats', { userId, error });
      throw new AppError(500, 'Failed to fetch daily statistics');
    }
  }
}
