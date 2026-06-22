-- Simple script to set random parent IDs (referrer_id) between 20-100
-- Run this after the main conversion script

-- Step 1: Set NULL for first 20 users (they are top-level users)
UPDATE users 
SET referrer_id = NULL 
WHERE id <= 20;

-- Step 2: For users 21 and above, assign random parent between 20-100
UPDATE users 
SET referrer_id = FLOOR(20 + RANDOM() * 81)::INTEGER
WHERE id > 20;

-- Step 3: Verify the results
SELECT 
  id,
  username,
  referrer_id as "P-ID",
  (SELECT username FROM users u2 WHERE u2.id = users.referrer_id) as "Parent Username",
  user_type,
  created_at
FROM users
ORDER BY id
LIMIT 50;

-- Step 4: Check distribution of parent IDs
SELECT 
  referrer_id,
  COUNT(*) as count
FROM users
WHERE referrer_id IS NOT NULL
GROUP BY referrer_id
ORDER BY referrer_id;
