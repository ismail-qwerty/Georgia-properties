-- ================================================================
-- SPECIAL LOTS SYSTEM SCHEMA
-- ================================================================

-- 1. Add special_lots table to store special property listings
CREATE TABLE IF NOT EXISTS special_lots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 2.50,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_special_lots_status ON special_lots(status);

-- 2. Add user_special_lots_queue table (similar to user_tasks_queue but for special lots)
CREATE TABLE IF NOT EXISTS user_special_lots_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    special_lot_id UUID NOT NULL,
    lot_value DECIMAL(12,2) NOT NULL,
    daily_commission DECIMAL(12,2) NOT NULL,
    trigger_after_order_no INT NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (special_lot_id) REFERENCES special_lots(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_special_lots_user_id ON user_special_lots_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_user_special_lots_status ON user_special_lots_queue(status);

-- 3. Add user_special_lots_holdings table (tracks active special lots earning daily)
CREATE TABLE IF NOT EXISTS user_special_lots_holdings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    special_lot_id UUID NOT NULL,
    special_lot_title VARCHAR(500) NOT NULL,
    lot_value DECIMAL(12,2) NOT NULL,
    daily_commission DECIMAL(12,2) NOT NULL,
    total_earned DECIMAL(12,2) DEFAULT 0.00,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_commission_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (special_lot_id) REFERENCES special_lots(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_special_lots_holdings_user_id ON user_special_lots_holdings(user_id);

-- 4. Add columns to wallets table for special lots tracking
ALTER TABLE wallets 
ADD COLUMN IF NOT EXISTS total_special_lots_invested DECIMAL(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_special_lots_earned DECIMAL(12,2) DEFAULT 0.00;

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%special_lots%';
