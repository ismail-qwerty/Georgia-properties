-- Insert Special Lot Properties (Premium high-value properties)
-- Special lots: User pays full price, gets 30% back (net: pays 70%)

INSERT INTO properties (name, value, lot_type, image_url, status) VALUES
('Trump Tower Penthouse Suite', 500000.00, 'special', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Active'),
('Beverly Hills Mega Mansion', 750000.00, 'special', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'Active'),
('Dubai Marina Luxury Residence', 600000.00, 'special', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', 'Active'),
('Monaco Beachfront Villa', 850000.00, 'special', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'Active'),
('Singapore Sky Penthouse', 680000.00, 'special', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'Active'),
('London Kensington Palace View', 720000.00, 'special', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'Active'),
('Hong Kong Victoria Harbor Tower', 890000.00, 'special', 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1354?w=800', 'Active'),
('Paris Champs-Élysées Apartment', 640000.00, 'special', 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800', 'Active'),
('Tokyo Shibuya Executive Suite', 550000.00, 'special', 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800', 'Active'),
('Miami South Beach Oceanfront', 780000.00, 'special', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Active');

-- Verify special lots were created
SELECT id, name, value, lot_type, status 
FROM properties 
WHERE lot_type = 'special'
ORDER BY value DESC;

-- Check total count by lot type
SELECT lot_type, COUNT(*) as count
FROM properties
GROUP BY lot_type;
