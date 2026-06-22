-- Check for any remaining properties with generic or placeholder names
SELECT id, name, value, price, status 
FROM properties 
WHERE name LIKE 'Property %' OR name IS NULL OR name = ''
ORDER BY name;

-- Get all current property names to verify
SELECT id, name, value, price, status 
FROM properties 
ORDER BY name;
