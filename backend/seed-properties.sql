-- Seed real Georgia / Atlanta landmark properties
-- Run this in your Supabase SQL editor to populate the properties table

TRUNCATE TABLE properties RESTART IDENTITY CASCADE;

INSERT INTO properties (title, description, image_url, price, status) VALUES

('Bank of America Plaza, Atlanta',
 'The tallest building in Atlanta and the Southeast, standing at 1,023 ft. This iconic skyscraper features Class A office space in the heart of Midtown Atlanta with stunning panoramic views.',
 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=800&q=80',
 850000.00, 'Active'),

('One Atlantic Center, Atlanta',
 'A prestigious 50-story postmodern skyscraper located on Peachtree Street in Midtown Atlanta. Known for its distinctive crown and granite facade, offering premium office suites.',
 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
 720000.00, 'Active'),

('Buckhead Atlanta Mixed-Use Tower',
 'A luxury mixed-use high-rise in the upscale Buckhead district featuring premium residential condos, boutique retail, and fine dining. One of Atlanta''s most sought-after addresses.',
 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
 695000.00, 'Active'),

('Peachtree Center Complex, Atlanta',
 'A landmark multi-tower commercial complex in downtown Atlanta designed by architect John Portman. Features interconnected towers with office, hotel, and retail space totaling over 3 million sq ft.',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
 980000.00, 'Active'),

('12th & Midtown Residential Tower',
 'A modern luxury residential skyscraper in Midtown Atlanta offering breathtaking city views, resort-style amenities, rooftop terrace, and concierge services in a prime walkable neighborhood.',
 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
 540000.00, 'Active'),

('Ponce City Market, Atlanta',
 'A historic adaptive reuse development transforming the former City Hall East building into a vibrant mixed-use destination with 300,000 sq ft of retail, restaurants, offices, and 259 residences.',
 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',
 460000.00, 'Active'),

('Atlantic Station Office Park, Atlanta',
 'A premier 138-acre mixed-use urban development on the former Atlantic Steel brownfield site in Midtown Atlanta. Features Class A office towers, retail, and residential in a walkable urban village.',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
 610000.00, 'Active'),

('Savannah Historic District Estate',
 'An exquisite antebellum-style estate in Savannah''s famous Historic District, just steps from Forsyth Park. Features original hardwood floors, wraparound porches, and meticulously preserved period architecture.',
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
 380000.00, 'Active'),

('Cumberland Galleria Office Tower, Atlanta',
 'A Class A office tower in the Cumberland/Galleria submarket of Atlanta, one of the metro area''s premier suburban office markets. Features modern amenities, abundant parking, and easy interstate access.',
 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
 495000.00, 'Active'),

('Georgia Tech Innovation Hub, Atlanta',
 'A cutting-edge mixed-use innovation campus adjacent to Georgia Tech in Midtown Atlanta. Houses tech startups, research labs, co-working spaces, and modern residential units in a vibrant innovation ecosystem.',
 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
 570000.00, 'Active'),

('Avalon Mixed-Use Development, Alpharetta',
 'A 86-acre luxury mixed-use development in Alpharetta featuring Class A office space, upscale retail, fine dining, a hotel, and premium residences. Known as Atlanta''s premier suburban live-work-play destination.',
 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
 520000.00, 'Active'),

('Colony Square, Midtown Atlanta',
 'A landmark redeveloped mixed-use complex in the heart of Midtown Atlanta featuring renovated office towers, luxury residences, and a curated collection of restaurants, retail shops, and entertainment venues.',
 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80',
 640000.00, 'Active'),

('Serenbe Eco-Village Estate, Chattahoochee Hills',
 'A stunning modern farmhouse-style home in the award-winning Serenbe agrihood community south of Atlanta. Features sustainable design, organic farmland access, miles of nature trails, and vibrant community living.',
 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
 320000.00, 'Active'),

('The Battery Atlanta Mixed-Use, Cobb County',
 'A premier mixed-use development surrounding Truist Park, home of the Atlanta Braves. Features Class A office, luxury apartments, upscale restaurants and entertainment in a dynamic live-work-play environment.',
 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
 675000.00, 'Active'),

('Phipps Tower, Buckhead Atlanta',
 'A prestigious 25-story Class A office tower in the heart of Buckhead adjacent to Phipps Plaza mall. One of Atlanta''s most recognized corporate addresses with LEED Gold certification and premium finishes.',
 'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?w=800&q=80',
 730000.00, 'Active');
