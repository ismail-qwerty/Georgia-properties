-- ================================================================
-- SEED DATA: Create Initial Admin User
-- ================================================================
-- This script creates the first admin user that can be used to:
-- 1. Get a reference code for registering new users
-- 2. Access the admin panel
-- 3. Manage the platform
-- ================================================================

-- Step 1: Create membership tier (if not exists)
INSERT INTO membership_levels (name, order_limit, commission_rate)
VALUES ('Silver', 35, 0.50)
ON CONFLICT DO NOTHING;

-- Step 2: Create admin user
-- Username: admin
-- Password: admin123
-- Wallet Password: wallet123
-- Reference Code: BXD17
INSERT INTO users (
  username,
  full_name,
  email,
  phone,
  password_hash,
  wallet_password_hash,
  reference_code,
  referrer_id,
  tier_id,
  credibility,
  min_withdrawal,
  max_withdrawal,
  user_status,
  wallet_status,
  user_type
) VALUES (
  'admin',
  'System Administrator',
  'admin@brookfieldproperties.com',
  '+1234567890',
  '$2a$10$YourHashedPasswordHere',  -- Password: admin123
  '$2a$10$YourHashedWalletPasswordHere',  -- Wallet Password: wallet123
  'BXD17',
  NULL,
  1,
  100,
  50.00,
  10000.00,
  'Active',
  'Active',
  'Admin'
) ON CONFLICT (username) DO NOTHING;

-- Step 3: Create wallet for admin user
INSERT INTO wallets (user_id, balance, total_recharged, total_earned, total_withdrawn)
SELECT id, 0.00, 0.00, 0.00, 0.00
FROM users
WHERE username = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- Step 4: Create a test regular user
-- Username: testuser
-- Password: test123
-- Wallet Password: wallet123
-- Reference Code: BXD17TEST
INSERT INTO users (
  username,
  full_name,
  email,
  phone,
  password_hash,
  wallet_password_hash,
  reference_code,
  referrer_id,
  tier_id,
  credibility,
  min_withdrawal,
  max_withdrawal,
  user_status,
  wallet_status,
  user_type
) VALUES (
  'testuser',
  'Test User',
  'test@example.com',
  '+9876543210',
  '$2a$10$YourHashedPasswordHere',  -- Password: test123
  '$2a$10$YourHashedWalletPasswordHere',  -- Wallet Password: wallet123
  'BXD17TEST',
  (SELECT id FROM users WHERE username = 'admin'),
  1,
  100,
  50.00,
  500.00,
  'Active',
  'Deactivate',
  'User'
) ON CONFLICT (username) DO NOTHING;

-- Step 5: Create wallet for test user
INSERT INTO wallets (user_id, balance, total_recharged, total_earned, total_withdrawn)
SELECT id, 100.00, 100.00, 0.00, 0.00
FROM users
WHERE username = 'testuser'
ON CONFLICT (user_id) DO NOTHING;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check created users
SELECT 
  id,
  username,
  full_name,
  email,
  reference_code,
  user_type,
  user_status,
  wallet_status
FROM users
WHERE username IN ('admin', 'testuser');

-- Check wallets
SELECT 
  w.id,
  u.username,
  w.balance,
  w.total_recharged,
  w.total_earned,
  w.total_withdrawn
FROM wallets w
JOIN users u ON w.user_id = u.id
WHERE u.username IN ('admin', 'testuser');

-- ================================================================
-- USAGE INSTRUCTIONS
-- ================================================================
-- After running this script, you can:
--
-- 1. LOGIN AS ADMIN:
--    Username: admin
--    Password: admin123
--    Access: /administration
--
-- 2. LOGIN AS TEST USER:
--    Username: testuser
--    Password: test123
--    Access: /dashboard
--
-- 3. REGISTER NEW USERS:
--    Use reference code: BXD17 (from admin)
--    Or use: BXD17TEST (from test user)
--
-- ================================================================
