// Centralized content for LivingLux — edit texts, images, addresses here.

export const CORE_VALUES = [
  { icon: 'Heart', title: "Lifestyle Match", desc: "Curated homes designed to match the dynamic lifestyle of ambitious young professionals." },
  { icon: 'Key', title: "Move-in Ready", desc: "Fully furnished with style. Just bring your suitcase and feel at home from day one." },
  { icon: 'MapPin', title: "Prime Locations", desc: "Strategically located in Belair, Limpertsberg, and Bertrange for easy city access." },
  { icon: 'Calendar', title: "Flexible Terms", desc: "We understand your needs. Lease terms starting from just 3 months." },
  { icon: 'Star', title: "Premium Facilities", desc: "High-end furniture, modern appliances, and top-tier amenities for maximum comfort." },
  { icon: 'Zap', title: "Hassle-Free Living", desc: "2Gbit fiber internet, regular cleaning service, and fast troubleshooting included." },
];

export const HOUSE_RULES = [
  { icon: 'HeartHandshake', title: "Community First", desc: "Respect your housemates and treat everyone with kindness." },
  { icon: 'Moon', title: "Quiet Hours", desc: "Please keep noise to a minimum between 10 PM and 7 AM." },
  { icon: 'Trash2', title: "Cleanliness", desc: "Clean up after cooking. Weekly professional cleaning covers common areas." },
  { icon: 'CigaretteOff', title: "No Smoking", desc: "Smoking is strictly prohibited inside all properties." },
];

export const FAQS = [
  { question: "Is there an agency fee?", answer: "No. All our properties are rented directly by the owners, so you save on agency fees (typically 1 month rent + VAT). We believe in transparent and fair pricing." },
  { question: "What is the typical tenant profile?", answer: "Our community consists of young professionals (22-35 years old) working in Luxembourg's major sectors like finance, tech, and European institutions." },
  { question: "What is included in the charges?", answer: "Charges include 2Gbit fiber internet, water, heating, electricity, weekly cleaning of common areas, and garbage disposal." },
  { question: "What is the minimum rental duration?", answer: "Our standard contracts start from 6 months. We offer flexibility for interns and project-based professionals depending on availability." },
  { question: "How do I apply?", answer: "Simply click 'Apply Now' on the room or garage you are interested in. We will review your application and get back to you within 24 hours to schedule a viewing." },
];

export const GARAGES = [
  { id: 'g1', name: 'High ceiling box garage', location: 'Limpertsberg', price: 350, status: 'available', size: '20m²', type: 'Box garage', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600' },
  { id: 'g2', name: 'Box garage', location: 'Limpertsberg', price: 300, status: 'rented', size: '18m²', type: 'Box garage', image: 'https://images.unsplash.com/photo-1574360772709-67990b79dc35?auto=format&fit=crop&q=80&w=600' },
  { id: 'g3', name: 'High ceiling box garage', location: 'Dommeldange Gare', price: 350, status: 'available', size: '20m²', type: 'Box garage', image: 'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?auto=format&fit=crop&q=80&w=600' },
  { id: 'g4', name: 'Underground parking lot', location: 'Bertrange', price: 100, status: 'rented', size: '13m²', type: 'Indoor', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600' },
  { id: 'g5', name: 'Private outdoor parking lot', location: 'Bertrange', price: 75, status: 'rented', size: '18m²', type: 'Outdoor', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600' },
];

export const PROPERTIES = [
  {
    id: 'limpertsberg-house',
    title: 'Maison de Maître Limpertsberg',
    location: 'Limpertsberg, Luxembourg City',
    address: '365 rue de rollingergrund',
    totalSpace: '200m² + 5m² backyard',
    type: 'House',
    mapPos: { top: '45%', left: '42%' },
    tags: ['High-end', '3 Floors', 'Prestige'],
    description: 'An expansive 3-story high-end house offering the ultimate coliving experience in the prestigious Belair district. Generous common areas and premium privacy.',
    locationHighlights: [
      { icon: 'Bus', text: "2 min walk to Tram stop Place de l'Étoile" },
      { icon: 'Briefcase', text: "15 min walk to City Center" },
      { icon: 'Clock', text: "Quick access to Route d'Arlon" },
      { icon: 'Trees', text: "Next to Parc de Merl" }
    ],
    amenities: [
      '2Gbit speed fiber internet', '3 Floors', 'Grand Kitchen', 'Home Cinema', 'Gym Area', 'Wine Cellar', 
      'Weekly Maid', 'Washing Machine', 'Tumble Dryer', 'Dishwasher', 'Smart TV', 
      'Fully Equipped Kitchen', 'Coffee Machine', 'Iron & Ironing Board', 'Bed Linen Provided'
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7213aa9?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1600596542815-6ad4c7213aa9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=1200'
    ],
    rooms: [
      { id: 'h-r1', name: 'Standard Double A', price: 950, charges: 150, size: '13m²', available: '2026-03-01', status: 'available', features: 'Ground floor, Dedicated WC', images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=600'] },
      { id: 'h-r2', name: 'Standard Double B', price: null, charges: null, size: '13m²', available: 'Indefinite', status: 'occupied', features: '1st floor', images: ['https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80&w=600'] },
      { id: 'h-r3', name: 'Suite Double A', price: 1100, charges: 150, size: '16m²', available: '2026-03-01', status: 'available', features: '1st floor', images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600'] },
      { id: 'h-r4', name: 'Mini Double A', price: null, charges: null, size: '11m²', available: 'Indefinite', status: 'occupied', features: '1st floor', images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600'] },
      { id: 'h-r5', name: 'Suite Double B', price: null, charges: null, size: '15m²', available: 'Indefinite', status: 'occupied', features: '2nd floor', images: ['https://images.unsplash.com/photo-1522771753035-4a53c9d1314f?auto=format&fit=crop&q=80&w=600'] },
      { id: 'h-r6', name: 'Suite Double C', price: 1050, charges: 150, size: '16m²', available: '2026-03-01', status: 'available', features: '2nd floor', images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600'] },
      { id: 'h-r7', name: 'Standard Double C', price: null, charges: null, size: '12.5m²', available: 'Indefinite', status: 'occupied', features: '2nd floor, Skylight window', images: ['https://images.unsplash.com/photo-1536349788264-1b816db3cc13?auto=format&fit=crop&q=80&w=600'] },
    ]
  },
  {
    id: 'dom-house',
    title: 'Maison de Maître Dommeldange',
    location: 'Dommeldange, Luxembourg City',
    address: '15 Rue des Hauts-Fourneaux',
    totalSpace: '225m² + 20m² terrace',
    type: 'House',
    mapPos: { top: '25%', left: '75%' },
    tags: ['8 Rooms', 'Forest View', 'Spacious'],
    description: 'A magnificent 3-story Maison de Maître located in the quiet and green area of Dommeldange. Close to the train station and Kirchberg, this property features 8 fully renovated rooms, a large common area, and beautiful forest views.',
    locationHighlights: [
      { icon: 'Train', text: "5 min walk to Dommeldange Train Station" },
      { icon: 'Bus', text: "Direct bus to Kirchberg (10 min)" },
      { icon: 'Trees', text: "Direct access to Grengewald forest trails" },
      { icon: 'Clock', text: "8 min to Clausen nightlife" }
    ],
    amenities: [
      '2Gbit speed fiber internet', '8 Bedrooms', 'Forest View', 'Large Kitchen', '3 Bathrooms', 
      'Laundry Room', 'Weekly Maid', 'Garden/Terrace', 'BBQ Area', 'Bike Storage', 
      'Dishwasher', 'Microwave', 'Oven', 'Coffee Machine'
    ],
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200'
    ],
    rooms: Array.from({ length: 8 }).map((_, i) => ({
      id: `d-r${i+1}`,
      name: `Room ${i+1}`,
      price: 900 + (i * 20),
      charges: 150,
      size: `${12 + i}m²`,
      available: '2026-03-10',
      status: 'available',
      features: i % 2 === 0 ? 'Forest view' : 'Street view',
      images: [
        `https://images.unsplash.com/photo-${1595526114035 + i}?auto=format&fit=crop&q=80&w=600`,
        `https://images.unsplash.com/photo-${1595526114035 + i + 10}?auto=format&fit=crop&q=80&w=600`
      ]
    }))
  },
  {
    id: 'limp-apt',
    title: 'Limpertsberg Skyline Flat',
    location: 'Limpertsberg, Luxembourg City',
    address: '342 Rue de Rollingergrund',
    totalSpace: '118m² + 6m² balcony',
    type: 'Apartment',
    mapPos: { top: '38%', left: '48%' },
    tags: ['Bright', 'City View', 'Central'],
    description: 'A bright and spacious 5-bedroom apartment in the heart of Limpertsberg. Walking distance to Glacis and financial district.',
    locationHighlights: [
      { icon: 'Briefcase', text: "Walking distance to Big 4 firms" },
      { icon: 'Bus', text: "1 min to Bus stop" },
      { icon: 'Clock', text: "15 min walk to City Center" },
      { icon: 'Trees', text: "Close to Parc de Merl" }
    ],
    amenities: [
      '2Gbit speed fiber internet', '2 Balconies', 'Spacious Living Room', '2 Bathrooms', 'Laundry Room', 
      'Smart TV', 'Weekly Maid', 'City View', 'Elevator', 'Bike Storage', 
      'Dishwasher', 'Microwave', 'Oven'
    ],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200'
    ],
    rooms: [
      { id: 'l-r1', name: 'Bright room with private balcony', price: null, charges: null, size: '16.4m² + 3m² balcony', available: 'Indefinite', status: 'occupied', features: 'Garden view, Private balcony access', images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600'] },
      { id: 'l-r2', name: 'Spacious room with private balcony', price: null, charges: null, size: '19.2m² + 3m² balcony', available: 'Indefinite', status: 'occupied', features: 'Forest view, Private balcony access', images: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=600'] },
      { id: 'l-r3', name: 'Bright room', price: null, charges: null, size: '12m²', available: 'Indefinite', status: 'occupied', features: 'Garden view', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600'] },
    ]
  },
  {
    id: 'bertrange-apt',
    title: 'The Bertrange Garden Residence',
    location: 'Bertrange',
    address: '67 rue de luxembourg, L-8077',
    totalSpace: '94m² + 5m² balcony + 180m² garden',
    type: 'Apartment',
    mapPos: { top: '58%', left: '15%' },
    tags: ['High-end', 'Private Garden', 'Peaceful'],
    description: 'A luxurious apartment perfect for those seeking nature near the city. Features a stunning private garden and high-end finishes.',
    locationHighlights: [
      { icon: 'Bus', text: "Direct bus to City Center (20 min)" },
      { icon: 'Bus', text: "15 min to Cloche d'Or by bus" },
      { icon: 'Trees', text: "Private garden access" },
      { icon: 'Clock', text: "5 min to City Concorde Shopping Mall" }
    ],
    amenities: [
      '2Gbit speed fiber internet', 'Private Garden', 'Large Balcony', 'High-end fully equipped Kitchen', 
      'Underground Parking', 'Smart TV', 'Weekly Maid', 'Garden Furniture', 'BBQ', 
      'Washing Machine', 'Tumble Dryer', 'Floor Heating'
    ],
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200'
    ],
    rooms: [
      { id: 'b-r1', name: 'Bright room 1', price: 1000, charges: 150, size: '10m²', available: '2026-04-30', status: 'occupied', features: 'Street view', images: ['https://images.unsplash.com/photo-1616594039964-40891a909d93?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600'] },
      { id: 'b-r2', name: 'Bright room 2', price: null, charges: null, size: '10m²', available: 'Indefinite', status: 'occupied', features: 'Street view', images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600'] },
      { id: 'b-r3', name: 'Cosy room', price: null, charges: null, size: '13m²', available: 'Indefinite', status: 'occupied', features: 'Street view', images: ['https://images.unsplash.com/photo-1512918760530-772752699e9b?auto=format&fit=crop&q=80&w=600'] },
    ]
  }
];

export default {
  CORE_VALUES,
  HOUSE_RULES,
  FAQS,
  GARAGES,
  PROPERTIES
};
