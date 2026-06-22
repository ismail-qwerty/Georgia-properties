-- Check for properties with lot_type = 'special'
SELECT id, name, title, value, price, image_url, lot_type, status 
FROM properties 
WHERE lot_type = 'special'
ORDER BY name;

-- Check all lot types to see what we have
SELECT lot_type, COUNT(*) as count
FROM properties
GROUP BY lot_type;

-- View all properties with their lot types
SELECT id, name, value, price, lot_type, image_url, status
FROM properties
ORDER BY lot_type, name;
