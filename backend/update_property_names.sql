-- Update property names with realistic real estate titles
-- Run this in your Supabase SQL Editor or PostgreSQL client

UPDATE properties SET name = 'Manhattan Plaza Tower' WHERE name = 'Manhattan Plaza Tower';
UPDATE properties SET name = 'Downtown Executive Suites' WHERE name = 'Property 12';
UPDATE properties SET name = 'Parkside Luxury Residences' WHERE name = 'Property 13';
UPDATE properties SET name = 'Riverside Commercial Plaza' WHERE name = 'Property 14';
UPDATE properties SET name = 'Sunset Boulevard Estate' WHERE name = 'Property 15';
UPDATE properties SET name = 'Central Park View Apartments' WHERE name = 'Property 16';
UPDATE properties SET name = 'Harbor Front Tower' WHERE name = 'Property 17';
UPDATE properties SET name = 'Metropolitan Business Center' WHERE name = 'Property 18';
UPDATE properties SET name = 'Greenwood Garden Complex' WHERE name = 'Property 19';
UPDATE properties SET name = 'Skyline Corporate Plaza' WHERE name = 'Property 20';
UPDATE properties SET name = 'Lakeside Premium Villas' WHERE name = 'Property 21';
UPDATE properties SET name = 'Urban Heights Residence' WHERE name = 'Property 22';
UPDATE properties SET name = 'Golden Gate Luxury Homes' WHERE name = 'Property 23';
UPDATE properties SET name = 'Bay Area Business Park' WHERE name = 'Property 24';
UPDATE properties SET name = 'Hillside Manor Estates' WHERE name = 'Property 25';
UPDATE properties SET name = 'Oceanview Towers' WHERE name = 'Property 26';
UPDATE properties SET name = 'Crystal Lake Condominiums' WHERE name = 'Property 27';
UPDATE properties SET name = 'Empire State Business Hub' WHERE name = 'Property 28';
UPDATE properties SET name = 'Palm Springs Resort Villas' WHERE name = 'Property 29';
UPDATE properties SET name = 'Madison Square Residences' WHERE name = 'Property 30';
UPDATE properties SET name = 'Highland Park Penthouses' WHERE name = 'Property 31';
UPDATE properties SET name = 'Waterfront Marina Estates' WHERE name = 'Property 32';
UPDATE properties SET name = 'Grand Avenue Shopping Plaza' WHERE name = 'Property 33';
UPDATE properties SET name = 'Crosstown Commercial Center' WHERE name = 'Property 34';
UPDATE properties SET name = 'Beacon Hill Luxury Apartments' WHERE name = 'Property 35';
UPDATE properties SET name = 'Pacific Coast Business Complex' WHERE name = 'Property 36';
UPDATE properties SET name = 'Millionaire Row Mansions' WHERE name = 'Property 37';
UPDATE properties SET name = 'Capitol District Offices' WHERE name = 'Property 38';
UPDATE properties SET name = 'Vintage Valley Estates' WHERE name = 'Property 39';
UPDATE properties SET name = 'Silicon Valley Tech Campus' WHERE name = 'Property 40';

-- Verify the changes
SELECT id, name, value, price, status FROM properties ORDER BY name;
