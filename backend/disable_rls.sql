-- Run this in Supabase SQL Editor to fix the registration issue

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE recharges DISABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE debits_log DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;

-- Grant full access to service role
GRANT ALL ON users TO service_role;
GRANT ALL ON wallets TO service_role;
GRANT ALL ON membership_levels TO service_role;
GRANT ALL ON properties TO service_role;
GRANT ALL ON orders TO service_role;
GRANT ALL ON recharges TO service_role;
GRANT ALL ON redemptions TO service_role;
GRANT ALL ON debits_log TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
