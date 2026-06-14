import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/database.js';
import { ENV } from '../config/environment.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthService {
  static async register(userData: {
    username: string;
    full_name: string;
    email: string;
    phone: string;
    password: string;
    wallet_password: string;
    reference_code: string;
  }) {
    const {
      username,
      full_name,
      email,
      phone,
      password,
      wallet_password,
      reference_code,
    } = userData;

    // Validate reference code exists and belongs to an active user
    const { data: referrer, error: referrerError } = await supabaseAdmin
      .from('users')
      .select('id, username, user_status')
      .eq('reference_code', reference_code)
      .single();

    if (referrerError || !referrer) {
      throw new AppError(400, 'Invalid reference code. Please check your invitation link.');
    }

    if (referrer.user_status !== 'Active') {
      throw new AppError(400, 'Reference code belongs to an inactive account.');
    }

    // Check if username already exists
    const { data: existingUsername } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUsername) {
      throw new AppError(400, 'Username already exists');
    }

    // Check if email already exists
    const { data: existingEmail } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      throw new AppError(400, 'Email already registered');
    }

    // Hash passwords
    const password_hash = await bcrypt.hash(password, 10);
    const wallet_password_hash = await bcrypt.hash(wallet_password, 10);

    // Generate unique reference code for new user
    const newReferenceCode = this.generateReferenceCode();

    // Create user
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        username,
        full_name,
        email,
        phone,
        password_hash,
        wallet_password_hash,
        reference_code: newReferenceCode,
        referrer_id: referrer.id,
        tier_id: 1,
        user_status: 'Active',
        wallet_status: 'Deactivate',
        user_type: 'User',
      })
      .select('id, username, email, full_name, reference_code, user_type')
      .single();

    if (createError || !newUser) {
      throw new AppError(500, 'Failed to create user account');
    }

    // Generate JWT token
    const token = this.generateToken(newUser.id);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        reference_code: newUser.reference_code,
        user_type: newUser.user_type,
      },
      token,
    };
  }

  static async login(username: string, password: string) {
    // Find user by username
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      throw new AppError(401, 'Invalid username or password');
    }

    // Check if account is active
    if (user.user_status !== 'Active') {
      throw new AppError(403, 'Your account has been deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid username or password');
    }

    // Update last login timestamp
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Get wallet information
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('balance, total_earned, total_recharged, total_withdrawn')
      .eq('user_id', user.id)
      .single();

    // Get tier information
    const { data: tier } = await supabaseAdmin
      .from('membership_levels')
      .select('name, order_limit, commission_rate')
      .eq('id', user.tier_id)
      .single();

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        reference_code: user.reference_code,
        tier_id: user.tier_id,
        credibility: user.credibility,
        user_status: user.user_status,
        wallet_status: user.wallet_status,
        user_type: user.user_type,
        total_orders: user.total_orders,
      },
      wallet: wallet || {
        balance: 0,
        total_earned: 0,
        total_recharged: 0,
        total_withdrawn: 0,
      },
      tier: tier || {
        name: 'Silver',
        order_limit: 35,
        commission_rate: 0.5,
      },
      token,
    };
  }

  private static generateToken(userId: string): string {
    return jwt.sign({ userId }, ENV.JWT.SECRET, {
      expiresIn: ENV.JWT.EXPIRES_IN,
    });
  }

  private static generateReferenceCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'REF';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
