-- Update properties with found image URLs from scraper
-- Images are named using the property titles from seed-properties.sql
-- Run this in your Supabase SQL editor

-- Note: Image filenames correspond to property names as follows:
-- 1779482320.jfif = Bank of America Plaza, Atlanta
-- 1779482847.jfif = One Atlantic Center, Atlanta
-- 1779482951.jfif = Buckhead Atlanta Mixed-Use Tower
-- 1779483724.jfif = Peachtree Center Complex, Atlanta
-- 1779484059.jfif = 12th & Midtown Residential Tower
-- 1779484477.jfif = Ponce City Market, Atlanta
-- 1779485113.jfif = Atlantic Station Office Park, Atlanta
-- 1779485195.jfif = Savannah Historic District Estate
-- 1779485718.jfif = Cumberland Galleria Office Tower, Atlanta
-- 1779485915.jfif = Georgia Tech Innovation Hub, Atlanta
-- 1779485946.jfif = Avalon Mixed-Use Development, Alpharetta
-- 1779486053.jfif = Colony Square, Midtown Atlanta
-- 1779486186.jfif = Serenbe Eco-Village Estate, Chattahoochee Hills
-- 1779486221.jfif = The Battery Atlanta Mixed-Use, Cobb County
-- 1779486330.jfif = Phipps Tower, Buckhead Atlanta
-- 1779486145.jfif = SunTrust Plaza, Atlanta
-- 1779488214.jfif = Terminus 100 Office Tower, Buckhead
-- 1779488311.jfif = The Pinnacle Building, Midtown Atlanta
-- 1779488353.jfif = Lenox Towers, Buckhead Atlanta
-- 1779488489.jfif = Perimeter Center Office Complex, Dunwoody
-- 1779488632.jfif = Concourse Corporate Center, Atlanta
-- 1779489152.jfif = Resurgens Plaza, Downtown Atlanta
-- 1779489187.jfif = 191 Peachtree Tower, Atlanta
-- 1779489354.jfif = Georgia-Pacific Tower, Atlanta
-- 1779489437.jfif = Promenade Office Park, Alpharetta
-- 1779489733.jfif = Piedmont Center, Buckhead Atlanta
-- 1779489865.jfif = Tower Place, Buckhead Atlanta
-- 1779489919.jfif = Northpark Town Center, Atlanta
-- 1779490042.jfif = Glenridge Highlands, Sandy Springs
-- 1779490399.jfif = The Pinnacle at Buckhead
-- 1779490451.jfif = Vinings Corporate Center, Atlanta
-- 1779490698.jfif = Perimeter Summit, Atlanta
-- 1779490757.jfif = Northside Office Tower, Atlanta
-- 1779490857.jfif = Wildwood Office Park, Marietta

WITH ordered_properties AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM properties
)
UPDATE properties p
SET image_url = CASE o.row_num
  WHEN 1 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779482320.jfif'
  WHEN 2 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779482847.jfif'
  WHEN 3 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779482951.jfif'
  WHEN 4 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779483724.jfif'
  WHEN 5 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779484059.jfif'
  WHEN 6 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779484477.jfif'
  WHEN 7 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779485113.jfif'
  WHEN 8 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779485195.jfif'
  WHEN 9 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779485718.jfif'
  WHEN 10 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779485915.jfif'
  WHEN 11 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779485946.jfif'
  WHEN 12 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779486053.jfif'
  WHEN 13 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779486186.jfif'
  WHEN 14 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779486221.jfif'
  WHEN 15 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779486330.jfif'
  WHEN 16 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779486145.jfif'
  WHEN 17 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779488214.jfif'
  WHEN 18 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779488311.jfif'
  WHEN 19 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779488353.jfif'
  WHEN 20 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779488489.jfif'
  WHEN 21 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779488632.jfif'
  WHEN 22 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779489152.jfif'
  WHEN 23 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779489187.jfif'
  WHEN 24 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779489354.jfif'
  WHEN 25 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779489437.jfif'
  WHEN 26 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779489733.jfif'
  WHEN 27 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779489865.jfif'
  WHEN 28 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779489919.jfif'
  WHEN 29 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779490042.jfif'
  WHEN 30 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779490399.jfif'
  WHEN 31 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779490451.jfif'
  WHEN 32 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779490698.jfif'
  WHEN 33 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779490757.jfif'
  WHEN 34 THEN 'https://work.brookfieldproperties.pro/public/OrderImages/1779490857.jfif'
END
FROM ordered_properties o
WHERE p.id = o.id AND o.row_num <= 34;
