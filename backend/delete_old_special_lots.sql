-- Delete OLD special lots (the ones with old names)
-- This will keep ONLY the 40 new special lots we just created

-- First, let's see the date when new lots were created
SELECT created_at, COUNT(*) as count
FROM properties
WHERE lot_type = 'special'
GROUP BY created_at
ORDER BY created_at DESC;

-- Delete all special lots EXCEPT the 40 new ones we created today
-- The 40 new lots all have created_at = '2026-06-20 00:01:51.235827+00'
DELETE FROM properties 
WHERE lot_type = 'special' 
AND created_at < '2026-06-20 00:01:51'::timestamp;

-- Verify only 40 special lots remain (the new ones)
SELECT COUNT(*) as remaining_special_lots
FROM properties
WHERE lot_type = 'special';

-- View the remaining special lots ordered by price
SELECT id, name, value, lot_type, created_at
FROM properties
WHERE lot_type = 'special'
ORDER BY value ASC;
