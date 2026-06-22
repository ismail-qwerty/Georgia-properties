-- Update remaining generic property names with realistic real estate titles

UPDATE properties SET name = 'Riverside Garden Villas' WHERE name = 'Property 1';
UPDATE properties SET name = 'Downtown Financial Tower' WHERE name = 'Property 2';
UPDATE properties SET name = 'Westside Premium Condos' WHERE name = 'Property 3';
UPDATE properties SET name = 'Eastside Commercial Hub' WHERE name = 'Property 4';
UPDATE properties SET name = 'Northpoint Executive Suites' WHERE name = 'Property 5';
UPDATE properties SET name = 'Southgate Luxury Apartments' WHERE name = 'Property 6';
UPDATE properties SET name = 'Midtown Corporate Center' WHERE name = 'Property 7';
UPDATE properties SET name = 'Heritage Square Residences' WHERE name = 'Property 8';
UPDATE properties SET name = 'Willow Creek Estates' WHERE name = 'Property 9';
UPDATE properties SET name = 'Summit Ridge Townhomes' WHERE name = 'Property 10';
UPDATE properties SET name = 'Coastal Breeze Apartments' WHERE name = 'Property 11';

-- Verify all property names
SELECT id, name, value, price, status FROM properties ORDER BY name;
