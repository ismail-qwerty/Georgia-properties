-- CRITICAL: BACKUP YOUR DATABASE BEFORE RUNNING THIS SCRIPT
-- This script converts UUID-based IDs to integer sequential IDs (1, 2, 3...)

-- Step 1: Create mapping table for UUID to Integer conversion
CREATE TEMP TABLE id_mapping AS
SELECT 
  id AS old_uuid,
  ROW_NUMBER() OVER (ORDER BY created_at)::INTEGER AS new_int_id
FROM users
ORDER BY created_at;

-- Step 2: Add temporary integer ID column to users table
ALTER TABLE users ADD COLUMN temp_int_id INTEGER;

-- Step 3: Populate temporary ID column
UPDATE users u
SET temp_int_id = m.new_int_id
FROM id_mapping m
WHERE u.id = m.old_uuid;

-- Step 4: Drop Row Level Security policies that depend on user_id columns
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own wallets" ON wallets;
DROP POLICY IF EXISTS "Users can view own recharges" ON recharges;
DROP POLICY IF EXISTS "Users can view own redemptions" ON redemptions;
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can view own special lots" ON user_special_lots_queue;
DROP POLICY IF EXISTS "Users can view own holdings" ON user_special_lots_holdings;
DROP POLICY IF EXISTS "Users can view own tasks" ON user_tasks_queue;
DROP POLICY IF EXISTS "Users can view own bound wallets" ON bound_wallets;

-- Disable RLS temporarily
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE recharges DISABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_special_lots_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_special_lots_holdings DISABLE ROW LEVEL SECURITY;
ALTER TABLE bound_wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE debits DISABLE ROW LEVEL SECURITY;
ALTER TABLE debits_log DISABLE ROW LEVEL SECURITY;

-- Step 5: Drop all foreign key constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_referrer_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tier_id_fkey;
ALTER TABLE wallets DROP CONSTRAINT IF EXISTS wallets_user_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE user_tasks_queue DROP CONSTRAINT IF EXISTS user_tasks_queue_user_id_fkey;
ALTER TABLE recharges DROP CONSTRAINT IF EXISTS recharges_user_id_fkey;
ALTER TABLE redemptions DROP CONSTRAINT IF EXISTS redemptions_user_id_fkey;
ALTER TABLE debits DROP CONSTRAINT IF EXISTS debits_user_id_fkey;
ALTER TABLE debits DROP CONSTRAINT IF EXISTS debits_applied_by_admin_id_fkey;
ALTER TABLE debits_log DROP CONSTRAINT IF EXISTS debits_log_user_id_fkey;
ALTER TABLE debits_log DROP CONSTRAINT IF EXISTS debits_log_applied_by_admin_id_fkey;
ALTER TABLE bound_wallets DROP CONSTRAINT IF EXISTS bound_wallets_user_id_fkey;
ALTER TABLE chat_conversations DROP CONSTRAINT IF EXISTS chat_conversations_user_id_fkey;
ALTER TABLE chat_conversations DROP CONSTRAINT IF EXISTS chat_conversations_support_agent_id_fkey;
ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_sender_id_fkey;
ALTER TABLE user_special_lots_queue DROP CONSTRAINT IF EXISTS user_special_lots_queue_user_id_fkey;
ALTER TABLE user_special_lots_holdings DROP CONSTRAINT IF EXISTS user_special_lots_holdings_user_id_fkey;

-- Step 6: Add temporary integer columns to related tables
ALTER TABLE wallets ADD COLUMN temp_user_id INTEGER;
ALTER TABLE orders ADD COLUMN temp_user_id INTEGER;
ALTER TABLE user_tasks_queue ADD COLUMN temp_user_id INTEGER;
ALTER TABLE recharges ADD COLUMN temp_user_id INTEGER;
ALTER TABLE redemptions ADD COLUMN temp_user_id INTEGER;
ALTER TABLE debits ADD COLUMN temp_user_id INTEGER;
ALTER TABLE debits ADD COLUMN temp_admin_id INTEGER;
ALTER TABLE debits_log ADD COLUMN temp_user_id INTEGER;
ALTER TABLE debits_log ADD COLUMN temp_admin_id INTEGER;
ALTER TABLE bound_wallets ADD COLUMN temp_user_id INTEGER;
ALTER TABLE chat_conversations ADD COLUMN temp_user_id INTEGER;
ALTER TABLE chat_conversations ADD COLUMN temp_support_agent_id INTEGER;
ALTER TABLE chat_messages ADD COLUMN temp_sender_id INTEGER;
ALTER TABLE user_special_lots_queue ADD COLUMN temp_user_id INTEGER;
ALTER TABLE user_special_lots_holdings ADD COLUMN temp_user_id INTEGER;

-- Step 7: Populate temporary integer columns in related tables
UPDATE wallets w
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = w.user_id);

UPDATE orders o
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = o.user_id);

UPDATE user_tasks_queue utq
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = utq.user_id);

UPDATE recharges r
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = r.user_id);

UPDATE redemptions r
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = r.user_id);

UPDATE debits d
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = d.user_id),
    temp_admin_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = d.applied_by_admin_id);

UPDATE debits_log dl
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = dl.user_id),
    temp_admin_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = dl.applied_by_admin_id);

UPDATE bound_wallets bw
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = bw.user_id);

UPDATE chat_conversations cc
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = cc.user_id),
    temp_support_agent_id = CASE 
      WHEN cc.support_agent_id IS NOT NULL 
      THEN (SELECT new_int_id FROM id_mapping WHERE old_uuid = cc.support_agent_id)
      ELSE NULL 
    END;

UPDATE chat_messages cm
SET temp_sender_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = cm.sender_id);

UPDATE user_special_lots_queue uslq
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = uslq.user_id);

UPDATE user_special_lots_holdings uslh
SET temp_user_id = (SELECT new_int_id FROM id_mapping WHERE old_uuid = uslh.user_id);

-- Step 8: Drop old UUID columns and rename temp columns
-- USERS TABLE
ALTER TABLE users DROP COLUMN id;
ALTER TABLE users RENAME COLUMN temp_int_id TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- Set referrer_id to NULL for now (will set random values later)
ALTER TABLE users DROP COLUMN IF EXISTS referrer_id;
ALTER TABLE users ADD COLUMN referrer_id INTEGER;

-- WALLETS TABLE
ALTER TABLE wallets DROP COLUMN user_id;
ALTER TABLE wallets RENAME COLUMN temp_user_id TO user_id;

-- ORDERS TABLE
ALTER TABLE orders DROP COLUMN user_id;
ALTER TABLE orders RENAME COLUMN temp_user_id TO user_id;

-- USER_TASKS_QUEUE TABLE
ALTER TABLE user_tasks_queue DROP COLUMN user_id;
ALTER TABLE user_tasks_queue RENAME COLUMN temp_user_id TO user_id;

-- RECHARGES TABLE
ALTER TABLE recharges DROP COLUMN user_id;
ALTER TABLE recharges RENAME COLUMN temp_user_id TO user_id;

-- REDEMPTIONS TABLE
ALTER TABLE redemptions DROP COLUMN user_id;
ALTER TABLE redemptions RENAME COLUMN temp_user_id TO user_id;

-- DEBITS TABLE
ALTER TABLE debits DROP COLUMN user_id;
ALTER TABLE debits RENAME COLUMN temp_user_id TO user_id;
ALTER TABLE debits DROP COLUMN applied_by_admin_id;
ALTER TABLE debits RENAME COLUMN temp_admin_id TO applied_by_admin_id;

-- DEBITS_LOG TABLE
ALTER TABLE debits_log DROP COLUMN user_id;
ALTER TABLE debits_log RENAME COLUMN temp_user_id TO user_id;
ALTER TABLE debits_log DROP COLUMN applied_by_admin_id;
ALTER TABLE debits_log RENAME COLUMN temp_admin_id TO applied_by_admin_id;

-- BOUND_WALLETS TABLE
ALTER TABLE bound_wallets DROP COLUMN user_id;
ALTER TABLE bound_wallets RENAME COLUMN temp_user_id TO user_id;

-- CHAT_CONVERSATIONS TABLE
ALTER TABLE chat_conversations DROP COLUMN user_id;
ALTER TABLE chat_conversations RENAME COLUMN temp_user_id TO user_id;
ALTER TABLE chat_conversations DROP COLUMN support_agent_id;
ALTER TABLE chat_conversations RENAME COLUMN temp_support_agent_id TO support_agent_id;

-- CHAT_MESSAGES TABLE
ALTER TABLE chat_messages DROP COLUMN sender_id;
ALTER TABLE chat_messages RENAME COLUMN temp_sender_id TO sender_id;

-- USER_SPECIAL_LOTS_QUEUE TABLE
ALTER TABLE user_special_lots_queue DROP COLUMN user_id;
ALTER TABLE user_special_lots_queue RENAME COLUMN temp_user_id TO user_id;

-- USER_SPECIAL_LOTS_HOLDINGS TABLE
ALTER TABLE user_special_lots_holdings DROP COLUMN user_id;
ALTER TABLE user_special_lots_holdings RENAME COLUMN temp_user_id TO user_id;

-- Step 9: Set random parent IDs between 20-100
-- First 20 users have no parent
UPDATE users SET referrer_id = NULL WHERE id <= 20;

-- Users 21-100 get random parent between 20-100
UPDATE users 
SET referrer_id = 20 + floor(random() * 81)::INTEGER
WHERE id BETWEEN 21 AND 100;

-- Users above 100 get random parent between 20-100
UPDATE users 
SET referrer_id = 20 + floor(random() * 81)::INTEGER
WHERE id > 100;

-- Step 10: Create sequence for auto-increment
CREATE SEQUENCE IF NOT EXISTS users_id_seq;
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

-- Step 11: Recreate foreign key constraints
ALTER TABLE users ADD CONSTRAINT users_referrer_id_fkey 
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE users ADD CONSTRAINT users_tier_id_fkey 
  FOREIGN KEY (tier_id) REFERENCES membership_levels(id);

ALTER TABLE wallets ADD CONSTRAINT wallets_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_tasks_queue ADD CONSTRAINT user_tasks_queue_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE recharges ADD CONSTRAINT recharges_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE redemptions ADD CONSTRAINT redemptions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE debits ADD CONSTRAINT debits_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE debits ADD CONSTRAINT debits_applied_by_admin_id_fkey 
  FOREIGN KEY (applied_by_admin_id) REFERENCES users(id);

ALTER TABLE debits_log ADD CONSTRAINT debits_log_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE debits_log ADD CONSTRAINT debits_log_applied_by_admin_id_fkey 
  FOREIGN KEY (applied_by_admin_id) REFERENCES users(id);

ALTER TABLE bound_wallets ADD CONSTRAINT bound_wallets_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE chat_conversations ADD CONSTRAINT chat_conversations_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE chat_conversations ADD CONSTRAINT chat_conversations_support_agent_id_fkey 
  FOREIGN KEY (support_agent_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_special_lots_queue ADD CONSTRAINT user_special_lots_queue_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_special_lots_holdings ADD CONSTRAINT user_special_lots_holdings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 12: Re-enable RLS (optional - recreate policies as needed)
-- You can recreate RLS policies here if needed
-- Example:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own orders" ON orders
--   FOR SELECT USING (user_id = auth.uid()::INTEGER);

-- Step 13: Verify results
SELECT 
  id,
  username,
  referrer_id,
  (SELECT username FROM users u2 WHERE u2.id = users.referrer_id) as parent_username,
  user_type,
  created_at
FROM users
ORDER BY id
LIMIT 50;

-- Cleanup
DROP TABLE IF EXISTS id_mapping;

-- SUCCESS! User IDs are now integers (1, 2, 3...) and parent IDs are random (20-100)
