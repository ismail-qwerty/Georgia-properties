-- Update first 35 normal lots with new names and images from public folder
-- Images are located at /public/a1.jpg through /public/a35.jpg (adjust extension if needed)

-- First, let's see the current normal lots ordered by value
SELECT id, name, value, lot_type, image_url
FROM properties
WHERE lot_type = 'normal'
ORDER BY value ASC
LIMIT 35;

-- Note: Replace 'PROPERTY_ID_HERE' with actual IDs from the query above
-- Update each property with new name and image path
-- Format: UPDATE properties SET name = 'New Name', image_url = '/public/a1.jpg' WHERE id = 'actual-uuid-here';

-- You'll need to run the SELECT query first, then match each ID with the corresponding name below:
-- a1  -> Modern Urban Skyline Tower Complex
-- a2  -> Luxury High-Rise Living in Downtown Toronto
-- a3  -> Modern Urban Skyline Tower Complex
-- a4  -> Luxury High-Rise Living in Downtown Toronto
-- a5  -> London Guarantee & Accident Building — Chicago Landmark
-- a6  -> Modern Commercial Towers – Beijing, China
-- a7  -> Construction Update: 809 Broadway — FIELD Architecture
-- a8  -> Capella Tower in Downtown Minneapolis
-- a9  -> Modern Urban Skyline Tower Complex
-- a10 -> The Lumina Tower – A Modern Marvel in the Urban Skyline
-- a11 -> 1000 de La Gauchetière, Montreal
-- a12 -> Iconic Curved Twin Towers
-- a13 -> Parliament Building of Quebec
-- a14 -> Modern Architecture Meets Classic Design
-- a15 -> 130 William Street, New York
-- a16 -> K11 Atelier King's Road – Hong Kong's Vertical Landmark
-- a17 -> Luxury High-Rise Living in Downtown Toronto
-- a18 -> The Prudential Tower – A Boston Icon at Dusk
-- a19 -> Modern Commercial Towers – Beijing, China
-- a20 -> Hearst Tower – A Fusion of History and Modernity in New York City
-- a21 -> Iconic Curved Twin Towers
-- a22 -> The Bow, Calgary
-- a23 -> Salesforce Tower – San Francisco's Tallest Icon
-- a24 -> Flatiron Building in Front of the Toronto Skyline
-- a25 -> Sleek Giants of the Skyline
-- a26 -> Iconic Curved Twin Towers
-- a27 -> Parliament Building of Quebec
-- a28 -> Construction Update: 809 Broadway — FIELD Architecture
-- a29 -> Vancouver City Hall
-- a30 -> Hearst Tower – A Fusion of History and Modernity in New York City
-- a31 -> 1 York Street, Toronto
-- a32 -> K11 Atelier King's Road – Hong Kong's Vertical Landmark
-- a33 -> The Lumina Tower – A Modern Marvel in the Urban Skyline
-- a34 -> Massey Tower – Toronto, Ontario, Canada
-- a35 -> The Pacific by ACDF Architecture
