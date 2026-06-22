-- Check and fix properties table schema
-- Run this in your Supabase SQL editor

-- 1. Check current columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- 2. Add missing columns if they don't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS name VARCHAR(500);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title VARCHAR(500);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS value DECIMAL(12,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price DECIMAL(12,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_type VARCHAR(20) DEFAULT 'normal';

-- 3. If using 'title' column, copy to 'name' for consistency
UPDATE properties SET name = title WHERE name IS NULL AND title IS NOT NULL;

-- 4. If using 'name' column, copy to 'title' for consistency  
UPDATE properties SET title = name WHERE title IS NULL AND name IS NOT NULL;

-- 5. Ensure value and price are synced (use price as primary)
UPDATE properties SET value = price WHERE value IS NULL OR value = 0;

-- 6. Verify the updates
SELECT id, name, title, value, price, lot_type, status FROM properties LIMIT 5;
