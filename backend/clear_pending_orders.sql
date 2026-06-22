-- Delete all existing pending orders to force regeneration with new property names
DELETE FROM orders WHERE status = 'Pending';

-- Verify deletion
SELECT COUNT(*) as pending_orders_count FROM orders WHERE status = 'Pending';
