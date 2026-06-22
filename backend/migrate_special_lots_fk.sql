-- Migrate user_special_lots_queue.special_lot_id FK from special_lots to properties

-- Drop old FK constraint
ALTER TABLE user_special_lots_queue
DROP CONSTRAINT IF EXISTS user_special_lots_queue_special_lot_id_fkey;

-- Add new FK pointing to properties table
ALTER TABLE user_special_lots_queue
ADD CONSTRAINT user_special_lots_queue_special_lot_id_fkey
FOREIGN KEY (special_lot_id) REFERENCES properties(id) ON DELETE CASCADE;

-- Also fix user_special_lots_holdings if it exists
ALTER TABLE user_special_lots_holdings
DROP CONSTRAINT IF EXISTS user_special_lots_holdings_special_lot_id_fkey;

ALTER TABLE user_special_lots_holdings
ADD CONSTRAINT user_special_lots_holdings_special_lot_id_fkey
FOREIGN KEY (special_lot_id) REFERENCES properties(id) ON DELETE CASCADE;
