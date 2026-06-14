import { supabaseAdmin } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Logger } from '../utils/logger.js';

export class PropertyService {
  /**
   * Get all properties with pagination and filters
   */
  static async getAllProperties(page: number = 1, limit: number = 10, filters?: any) {
    try {
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('properties')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply status filter
      if (filters?.status) {
        // Capitalize status for consistency
        const capitalizedStatus = this.capitalizeStatus(filters.status);
        query = query.eq('status', capitalizedStatus);
      }

      // Apply price range filters
      if (filters?.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters?.max_price) {
        query = query.lte('price', filters.max_price);
      }

      // Apply search filter
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      const { data: properties, count, error } = await query;

      if (error) {
        Logger.error('Failed to fetch properties', { error });
        throw new AppError(500, 'Failed to fetch properties');
      }

      return {
        properties: properties || [],
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
      Logger.error('Unexpected error in getAllProperties', { error });
      throw new AppError(500, 'Failed to fetch properties');
    }
  }

  /**
   * Get single property by ID
   */
  static async getPropertyById(propertyId: number) {
    try {
      const { data: property, error } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error || !property) {
        throw new AppError(404, 'Property not found');
      }

      // Count how many times this property is assigned to users
      const { count: assignmentCount } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', propertyId);

      // Count completed tasks for this property
      const { count: completedCount } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('status', 'Completed');

      return {
        ...property,
        usage_stats: {
          total_assignments: assignmentCount || 0,
          completed_tasks: completedCount || 0,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in getPropertyById', { propertyId, error });
      throw new AppError(500, 'Failed to fetch property details');
    }
  }

  /**
   * Create new property
   */
  static async createProperty(propertyData: {
    title: string;
    description: string;
    image_url: string;
    price: number;
    status?: string;
  }) {
    try {
      Logger.info('Creating new property', { title: propertyData.title });

      // Capitalize status field for consistency
      const status = propertyData.status 
        ? this.capitalizeStatus(propertyData.status)
        : 'Active';

      const { data: newProperty, error } = await supabaseAdmin
        .from('properties')
        .insert({
          title: propertyData.title.trim(),
          description: propertyData.description.trim(),
          image_url: propertyData.image_url.trim(),
          price: propertyData.price,
          status,
        })
        .select('*')
        .single();

      if (error) {
        Logger.error('Failed to create property', { error });
        throw new AppError(500, 'Failed to create property');
      }

      Logger.info('Property created successfully', {
        propertyId: newProperty.id,
        title: newProperty.title,
        price: newProperty.price,
      });

      return newProperty;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in createProperty', { error });
      throw new AppError(500, 'Failed to create property');
    }
  }

  /**
   * Update property
   */
  static async updateProperty(
    propertyId: number,
    updates: {
      title?: string;
      description?: string;
      image_url?: string;
      price?: number;
      status?: string;
    }
  ) {
    try {
      Logger.info('Updating property', { propertyId, updates });

      // Fetch current property
      const { data: currentProperty, error: fetchError } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (fetchError || !currentProperty) {
        throw new AppError(404, 'Property not found');
      }

      // Build update object
      const updateData: any = {};

      if (updates.title !== undefined) {
        updateData.title = updates.title.trim();
      }

      if (updates.description !== undefined) {
        updateData.description = updates.description.trim();
      }

      if (updates.image_url !== undefined) {
        updateData.image_url = updates.image_url.trim();
      }

      if (updates.price !== undefined) {
        updateData.price = updates.price;
      }

      if (updates.status !== undefined) {
        // Capitalize status for consistency
        updateData.status = this.capitalizeStatus(updates.status);

        Logger.info('Property status change', {
          propertyId,
          from: currentProperty.status,
          to: updateData.status,
        });
      }

      // Check if any updates were provided
      if (Object.keys(updateData).length === 0) {
        throw new AppError(400, 'No valid fields provided for update');
      }

      // Execute update
      const { data: updatedProperty, error: updateError } = await supabaseAdmin
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .select('*')
        .single();

      if (updateError) {
        Logger.error('Failed to update property', { propertyId, error: updateError });
        throw new AppError(500, 'Failed to update property');
      }

      Logger.info('Property updated successfully', {
        propertyId,
        updatedFields: Object.keys(updateData),
      });

      return {
        property: updatedProperty,
        changes: updateData,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in updateProperty', { propertyId, error });
      throw new AppError(500, 'Failed to update property');
    }
  }

  /**
   * Delete property (soft delete by setting status to Inactive)
   */
  static async deleteProperty(propertyId: number, hardDelete: boolean = false) {
    try {
      Logger.info('Deleting property', { propertyId, hardDelete });

      // Check if property exists
      const { data: property, error: fetchError } = await supabaseAdmin
        .from('properties')
        .select('id, title, status')
        .eq('id', propertyId)
        .single();

      if (fetchError || !property) {
        throw new AppError(404, 'Property not found');
      }

      // Check if property is assigned to any pending orders
      const { count: pendingOrders } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('status', 'Pending');

      if (pendingOrders && pendingOrders > 0) {
        throw new AppError(
          400,
          `Cannot delete property. It is assigned to ${pendingOrders} pending order(s). Please reassign or complete these orders first.`
        );
      }

      if (hardDelete) {
        // Hard delete - permanently remove from database
        const { error: deleteError } = await supabaseAdmin
          .from('properties')
          .delete()
          .eq('id', propertyId);

        if (deleteError) {
          Logger.error('Failed to delete property', { propertyId, error: deleteError });
          throw new AppError(500, 'Failed to delete property');
        }

        Logger.info('Property hard deleted', { propertyId, title: property.title });

        return {
          deleted: true,
          hard_delete: true,
          property_id: propertyId,
        };
      } else {
        // Soft delete - set status to Inactive
        const { data: updatedProperty, error: updateError } = await supabaseAdmin
          .from('properties')
          .update({ status: 'Inactive' })
          .eq('id', propertyId)
          .select('*')
          .single();

        if (updateError) {
          Logger.error('Failed to soft delete property', { propertyId, error: updateError });
          throw new AppError(500, 'Failed to deactivate property');
        }

        Logger.info('Property soft deleted (set to Inactive)', {
          propertyId,
          title: property.title,
        });

        return {
          deleted: true,
          hard_delete: false,
          property: updatedProperty,
        };
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      Logger.error('Unexpected error in deleteProperty', { propertyId, error });
      throw new AppError(500, 'Failed to delete property');
    }
  }

  /**
   * Get property statistics
   */
  static async getPropertyStats() {
    try {
      // Count total properties
      const { count: totalCount } = await supabaseAdmin
        .from('properties')
        .select('id', { count: 'exact', head: true });

      // Count active properties
      const { count: activeCount } = await supabaseAdmin
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Active');

      // Count inactive properties
      const { count: inactiveCount } = await supabaseAdmin
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Inactive');

      // Get price statistics
      const { data: priceStats } = await supabaseAdmin
        .from('properties')
        .select('price')
        .eq('status', 'Active');

      const prices = priceStats?.map((p) => Number(p.price)) || [];
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const avgPrice = prices.length > 0 
        ? prices.reduce((sum, p) => sum + p, 0) / prices.length 
        : 0;

      // Count total assignments
      const { count: assignmentCount } = await supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true });

      return {
        total_properties: totalCount || 0,
        active_properties: activeCount || 0,
        inactive_properties: inactiveCount || 0,
        price_stats: {
          min: minPrice,
          max: maxPrice,
          average: avgPrice.toFixed(2),
        },
        total_assignments: assignmentCount || 0,
      };
    } catch (error) {
      Logger.error('Unexpected error in getPropertyStats', { error });
      throw new AppError(500, 'Failed to fetch property statistics');
    }
  }

  /**
   * Helper: Capitalize status field for consistency
   * Converts: active -> Active, INACTIVE -> Inactive, etc.
   */
  private static capitalizeStatus(status: string): string {
    const normalized = status.toLowerCase().trim();
    
    if (normalized === 'active') {
      return 'Active';
    } else if (normalized === 'inactive') {
      return 'Inactive';
    }
    
    // Fallback: capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
}
