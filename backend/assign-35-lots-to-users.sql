-- First, let's check what columns exist in the properties table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties'
ORDER BY ordinal_position;

-- Script to assign 35 random property lots to all users
DO $$
DECLARE
    user_record RECORD;
    property_id_val INTEGER;
    calculated_commission DECIMAL(10,2);
    properties_assigned INTEGER;
BEGIN
    FOR user_record IN 
        SELECT u.id, u.username, u.tier_id, ml.commission_rate
        FROM users u
        JOIN membership_levels ml ON u.tier_id = ml.id
        WHERE u.user_type = 'User'
    LOOP
        RAISE NOTICE 'Assigning lots to user: % (ID: %)', user_record.username, user_record.id;
        
        DELETE FROM orders 
        WHERE user_id = user_record.id 
        AND status = 'Pending';
        
        properties_assigned := 0;
        
        FOR property_id_val IN 
            SELECT id
            FROM properties
            WHERE status = 'Active'
            ORDER BY RANDOM()
            LIMIT 35
        LOOP
            calculated_commission := 0.50;
            
            INSERT INTO orders (user_id, property_id, commission, status, created_at, updated_at)
            VALUES (
                user_record.id,
                property_id_val,
                calculated_commission,
                'Pending',
                NOW(),
                NOW()
            );
            
            properties_assigned := properties_assigned + 1;
        END LOOP;
        
        RAISE NOTICE 'Assigned % properties to user %', properties_assigned, user_record.username;
    END LOOP;
END $$;

-- Verify assignments
SELECT 
    u.id,
    u.username,
    COUNT(o.id) as pending_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'Pending'
WHERE u.user_type = 'User'
GROUP BY u.id, u.username
ORDER BY u.id;
