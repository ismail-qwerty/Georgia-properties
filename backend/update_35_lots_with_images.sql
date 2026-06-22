-- Step 1: Get the first 35 normal lots ordered by value (lowest to highest)
WITH ranked_properties AS (
  SELECT id, name, value, 
         ROW_NUMBER() OVER (ORDER BY value ASC) as rn
  FROM properties
  WHERE lot_type = 'normal'
)
SELECT id, name, value, rn FROM ranked_properties WHERE rn <= 35 ORDER BY rn;

-- Step 2: Update the properties with new names and images
-- After running the query above, update each one manually OR use this dynamic approach:

WITH ranked_properties AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY value ASC) as rn
  FROM properties
  WHERE lot_type = 'normal'
),
updates AS (
  SELECT 
    rp.id,
    CASE rp.rn
      WHEN 1 THEN 'Modern Urban Skyline Tower Complex'
      WHEN 2 THEN 'Luxury High-Rise Living in Downtown Toronto'
      WHEN 3 THEN 'Modern Urban Skyline Tower Complex'
      WHEN 4 THEN 'Luxury High-Rise Living in Downtown Toronto'
      WHEN 5 THEN 'London Guarantee & Accident Building — Chicago Landmark'
      WHEN 6 THEN 'Modern Commercial Towers – Beijing, China'
      WHEN 7 THEN 'Construction Update: 809 Broadway — FIELD Architecture'
      WHEN 8 THEN 'Capella Tower in Downtown Minneapolis'
      WHEN 9 THEN 'Modern Urban Skyline Tower Complex'
      WHEN 10 THEN 'The Lumina Tower – A Modern Marvel in the Urban Skyline'
      WHEN 11 THEN '1000 de La Gauchetière, Montreal'
      WHEN 12 THEN 'Iconic Curved Twin Towers'
      WHEN 13 THEN 'Parliament Building of Quebec'
      WHEN 14 THEN 'Modern Architecture Meets Classic Design'
      WHEN 15 THEN '130 William Street, New York'
      WHEN 16 THEN 'K11 Atelier King''s Road – Hong Kong''s Vertical Landmark'
      WHEN 17 THEN 'Luxury High-Rise Living in Downtown Toronto'
      WHEN 18 THEN 'The Prudential Tower – A Boston Icon at Dusk'
      WHEN 19 THEN 'Modern Commercial Towers – Beijing, China'
      WHEN 20 THEN 'Hearst Tower – A Fusion of History and Modernity in New York City'
      WHEN 21 THEN 'Iconic Curved Twin Towers'
      WHEN 22 THEN 'The Bow, Calgary'
      WHEN 23 THEN 'Salesforce Tower – San Francisco''s Tallest Icon'
      WHEN 24 THEN 'Flatiron Building in Front of the Toronto Skyline'
      WHEN 25 THEN 'Sleek Giants of the Skyline'
      WHEN 26 THEN 'Iconic Curved Twin Towers'
      WHEN 27 THEN 'Parliament Building of Quebec'
      WHEN 28 THEN 'Construction Update: 809 Broadway — FIELD Architecture'
      WHEN 29 THEN 'Vancouver City Hall'
      WHEN 30 THEN 'Hearst Tower – A Fusion of History and Modernity in New York City'
      WHEN 31 THEN '1 York Street, Toronto'
      WHEN 32 THEN 'K11 Atelier King''s Road – Hong Kong''s Vertical Landmark'
      WHEN 33 THEN 'The Lumina Tower – A Modern Marvel in the Urban Skyline'
      WHEN 34 THEN 'Massey Tower – Toronto, Ontario, Canada'
      WHEN 35 THEN 'The Pacific by ACDF Architecture'
    END as new_name,
    CASE rp.rn
      WHEN 1 THEN '/a1.jfif'
      WHEN 2 THEN '/a2.jfif'
      WHEN 3 THEN '/a3.jfif'
      WHEN 4 THEN '/a4.jfif'
      WHEN 5 THEN '/a5.jpg'
      WHEN 6 THEN '/a6.jfif'
      WHEN 7 THEN '/a7.webp'
      WHEN 8 THEN '/a8.jfif'
      WHEN 9 THEN '/a9.jfif'
      WHEN 10 THEN '/a10.jfif'
      WHEN 11 THEN '/a11.jfif'
      WHEN 12 THEN '/a12.jfif'
      WHEN 13 THEN '/a13.jfif'
      WHEN 14 THEN '/a14.webp'
      WHEN 15 THEN '/a15.jfif'
      WHEN 16 THEN '/a16.jfif'
      WHEN 17 THEN '/a17.jfif'
      WHEN 18 THEN '/a18.jfif'
      WHEN 19 THEN '/a19.jfif'
      WHEN 20 THEN '/a20.jfif'
      WHEN 21 THEN '/a21.jfif'
      WHEN 22 THEN '/a22.jfif'
      WHEN 23 THEN '/a23.jfif'
      WHEN 24 THEN '/a24.jfif'
      WHEN 25 THEN '/a25.jfif'
      WHEN 26 THEN '/a26.jfif'
      WHEN 27 THEN '/a27.jfif'
      WHEN 28 THEN '/a28.jfif'
      WHEN 29 THEN '/a29.jfif'
      WHEN 30 THEN '/a30.jfif'
      WHEN 31 THEN '/a31.jfif'
      WHEN 32 THEN '/a32.jfif'
      WHEN 33 THEN '/a33.jfif'
      WHEN 34 THEN '/a34.jfif'
      WHEN 35 THEN '/a35.jpg'
    END as new_image
  FROM ranked_properties rp
  WHERE rp.rn <= 35
)
UPDATE properties
SET 
  name = updates.new_name,
  image_url = updates.new_image
FROM updates
WHERE properties.id = updates.id;

-- Verify the updates
SELECT id, name, value, image_url, lot_type
FROM properties
WHERE lot_type = 'normal'
ORDER BY value ASC
LIMIT 35;
