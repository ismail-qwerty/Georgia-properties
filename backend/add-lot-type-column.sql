-- Add lot_type column to properties table to differentiate normal and special lots
-- Run this in your Supabase SQL editor

-- Add lot_type column (default: 'normal')
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS lot_type VARCHAR(20) DEFAULT 'normal' CHECK (lot_type IN ('normal', 'special'));

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_lot_type ON properties(lot_type);

-- Update existing properties to be normal lots
UPDATE properties SET lot_type = 'normal' WHERE lot_type IS NULL;

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'properties' AND column_name = 'lot_type';
