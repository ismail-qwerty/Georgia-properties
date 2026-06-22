-- Script to assign 35 random property lots to all users
-- This creates pending orders for each user to complete daily

DO $$
DECLARE
    user_record RECORD;
    property_record RECORD;
    commission_rate DECIMAL(5,2);
    calculated_commission DECIMAL(10,2);
    properties_assigned INTEGER;
BEGIN
    -- Loop through all users (exclude ChatSupport and Admin types if needed)
    FOR user_record IN 
        SELECT u.id, u.username, u.tier_id, ml.commission_rate
        FROM users u
        JOIN membership_levels ml ON u.tier_id = ml.id
        WHERE u.user_type = 'User'
    LOOP
        RAISE NOTICE 'Assigning lots to user: % (ID: %)', user_record.username, user_record.id;
        
        -- Clear existing pending orders for this user
        DELETE FROM orders 
        WHERE user_id = user_record.id 
        AND status = 'Pending';
        
        properties_assigned := 0;
        
        -- Assign 35 random properties to this user
        FOR property_record IN 
            SELECT id, price
            FROM properties
            WHERE status = 'Active'
            ORDER BY RANDOM()
            LIMIT 35
        LOOP
            -- Calculate commission based on property price and user's tier rate
            calculated_commission := (property_record.price * user_record.commission_rate) / 100;
            
            -- Insert order
            INSERT INTO orders (user_id, property_id, commission, status, created_at, updated_at)
            VALUES (
                user_record.id,
                property_record.id,
                calculated_commission,
                'Pending',
                NOW(),
                NOW()
            );
            
            properties_assigned := properties_assigned + 1;
        END LOOP;
        
        RAISE NOTICE 'Assigned % properties to user %', properties_assigned, user_record.username;
    END LOOP;
    
    RAISE NOTICE 'Lot assignment complete!';
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
