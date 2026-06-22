-- Insert 40 Special Lot Properties with values ranging from $600 to $10,000
-- Special lots: User pays full price, gets 30% back (net: pays 70%)

INSERT INTO properties (name, description, value, lot_type, image_url, status) VALUES
('Tribeca Loft Apartment', 'Modern loft with exposed brick walls and floor-to-ceiling windows in the heart of Tribeca district.', 8500.00, 'special', 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1354?w=800', 'Active'),
('SoHo Artist Studio', 'Spacious studio with natural lighting, perfect for creative professionals in trendy SoHo.', 7200.00, 'special', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Active'),
('Chelsea Market District Condo', 'Contemporary condo near Chelsea Market with rooftop access and modern amenities.', 9500.00, 'special', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'Active'),
('Upper East Side Penthouse', 'Elegant penthouse with Central Park views and marble finishes throughout.', 10000.00, 'special', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'Active'),
('Williamsburg Warehouse Conversion', 'Industrial-chic converted warehouse with original wood beams and modern updates.', 6800.00, 'special', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'Active'),
('West Village Brownstone Suite', 'Charming brownstone apartment with original details and private garden access.', 8800.00, 'special', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'Active'),
('Financial District High-Rise', 'Luxury high-rise apartment with stunning harbor views and concierge service.', 9200.00, 'special', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', 'Active'),
('Gramercy Park Residence', 'Exclusive apartment with access to private Gramercy Park and 24/7 doorman.', 9800.00, 'special', 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800', 'Active'),
('Brooklyn Heights Townhouse', 'Historic townhouse with modern renovations and panoramic Manhattan skyline views.', 8900.00, 'special', 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800', 'Active'),
('Battery Park Waterfront Unit', 'Waterfront apartment with floor-to-ceiling windows and Statue of Liberty views.', 7800.00, 'special', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Active'),
('NoHo Designer Loft', 'Designer loft with custom finishes, chef kitchen, and smart home technology.', 7500.00, 'special', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Active'),
('Murray Hill Executive Suite', 'Executive suite with marble bathrooms, hardwood floors, and gym access.', 6500.00, 'special', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Active'),
('East Village Walk-Up', 'Renovated walk-up with exposed brick, stainless appliances, and vibrant neighborhood.', 4200.00, 'special', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Active'),
('Midtown South Office Conversion', 'Creative office space converted to residential with open floor plan and city views.', 7000.00, 'special', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', 'Active'),
('Hudson Yards Premium Unit', 'Brand new luxury unit in Hudson Yards with building amenities and rooftop deck.', 9600.00, 'special', 'https://images.unsplash.com/photo-1600573472591-ee6c68c5ecaf?w=800', 'Active'),
('Greenwich Village Corner Unit', 'Sunny corner unit with washer/dryer, dishwasher, and tree-lined street views.', 5800.00, 'special', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', 'Active'),
('Lower Manhattan Loft Space', 'Spacious loft with 12-foot ceilings, industrial windows, and polished concrete.', 6200.00, 'special', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 'Active'),
('Park Slope Family Duplex', 'Two-story duplex perfect for families with private outdoor space and storage.', 8200.00, 'special', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800', 'Active'),
('Long Island City Studio', 'Modern studio with stainless steel kitchen and Manhattan skyline views.', 1800.00, 'special', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', 'Active'),
('Union Square Plaza Apartment', 'Central location apartment steps from Union Square with hardwood floors.', 7400.00, 'special', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'Active'),
('Flatiron District Corner Loft', 'Iconic building loft with oversized windows and exposed ductwork.', 8600.00, 'special', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800', 'Active'),
('Upper West Side Classic Six', 'Pre-war classic six with original moldings, parquet floors, and dining room.', 9000.00, 'special', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'Active'),
('Dumbo Loft with Bridge Views', 'Stunning loft with Brooklyn Bridge views and original timber columns.', 9400.00, 'special', 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800', 'Active'),
('Hell''s Kitchen Modern Studio', 'Contemporary studio with stainless appliances and building fitness center.', 2400.00, 'special', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Active'),
('Morningside Heights Unit', 'Bright apartment near Columbia University with updated kitchen and bathroom.', 2100.00, 'special', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800', 'Active'),
('Kips Bay High-Rise Unit', 'High-rise unit with doorman, gym, and convenient access to transportation.', 6000.00, 'special', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800', 'Active'),
('Nolita Boutique Building', 'Boutique building apartment in fashionable Nolita with European fixtures.', 7900.00, 'special', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800', 'Active'),
('Theater District Premium Suite', 'Premium suite in the heart of Theater District with marble bathroom.', 8400.00, 'special', 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800', 'Active'),
('Alphabet City Renovated Unit', 'Fully renovated unit in vibrant Alphabet City with all new appliances.', 1200.00, 'special', 'https://images.unsplash.com/photo-1600566752734-810d93762a67?w=800', 'Active'),
('Crown Heights Garden Unit', 'Garden-level unit with private patio and updated finishes throughout.', 850.00, 'special', 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', 'Active'),
('Fort Greene Historic Unit', 'Historic building unit with original details and modern kitchen updates.', 5600.00, 'special', 'https://images.unsplash.com/photo-1600566753051-f0bf5dc8b9c0?w=800', 'Active'),
('Astoria Queens Apartment', 'Spacious apartment in diverse Astoria neighborhood with parking available.', 650.00, 'special', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Active'),
('Prospect Heights Corner Unit', 'Corner unit with oversized windows and close proximity to Prospect Park.', 6400.00, 'special', 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800', 'Active'),
('Bushwick Artist Loft', 'Raw loft space perfect for artists with high ceilings and natural light.', 920.00, 'special', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800', 'Active'),
('Cobble Hill Charmer', 'Charming apartment on tree-lined street with updated appliances and storage.', 7100.00, 'special', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', 'Active'),
('Red Hook Waterfront Unit', 'Waterfront unit with harbor views and close to trendy restaurants and shops.', 2700.00, 'special', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', 'Active'),
('Carroll Gardens Duplex', 'Two-level duplex with private entrance and backyard in family-friendly area.', 8300.00, 'special', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 'Active'),
('Downtown Brooklyn Tower', 'Modern tower apartment with concierge, gym, and rooftop lounge access.', 7600.00, 'special', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800', 'Active'),
('Gowanus Industrial Loft', 'Industrial loft with 14-foot ceilings, polished concrete, and skylights.', 6700.00, 'special', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800', 'Active'),
('Boerum Hill Luxury Rental', 'Luxury rental with washer/dryer, dishwasher, and central air conditioning.', 8100.00, 'special', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Active');

-- Verify special lots were created
SELECT id, name, value, lot_type, status 
FROM properties 
WHERE lot_type = 'special'
ORDER BY value DESC;

-- Check total count by lot type
SELECT lot_type, COUNT(*) as count
FROM properties
GROUP BY lot_type;
