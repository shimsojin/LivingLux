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
  { icon: 'Trash2', title: "Cleanliness", desc: "Weekly professional cleaning covers common areas. Though, we may clean up after using the kitchen and common spaces." },
  { icon: 'CigaretteOff', title: "No Smoking", desc: "Smoking is strictly prohibited inside all premises." },
];

export const FAQS = [
  { question: "Is there an agency fee?", answer: "No. All our properties are rented directly by the owners, so you save on agency fees (typically 1 month rent + VAT). We believe in transparent and fair pricing." },
  { question: "What is the typical tenant profile?", answer: "Our community consists of young professionals (22-35 years old) working in Luxembourg's major sectors like finance, tech, and European institutions." },
  { question: "What is included in the charges?", answer: "Charges include 2Gbit fiber internet, water, heating, electricity, weekly cleaning of common areas, and garbage disposal." },
  { question: "What is the minimum rental duration?", answer: "Our standard contracts start from 3 months. We offer flexibility for interns and project-based professionals depending on availability." },
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
    title: 'Limpertsberg Grand Residence',
    location: 'Limpertsberg, Luxembourg City',
    address: '365 rue de rollingergrund',
    totalSpace: '200m² + 5m² backyard',
    type: 'House',
    mapPos: { top: '45%', left: '42%' },
    tags: ['High-end', '3 Floors', 'Spacious'],
    description: 'An expansive 3-story high-end house offering the ultimate coliving experience in the prestigious Limpertsberg district. Generous common areas and premium privacy.',
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
    image: '/images/limpertsberg-house-room22.jpg',
    images: [
      '/images/limpertsberg-house-main.jpg',
      '/images/limpertsberg-house-living.JPG',
      '/images/limpertsberg-house-kitchen.JPG',
      '/images/limpertsberg-house-bath1.jpg',
      '/images/limpertsberg-house-bath2.jpg',
      '/images/limpertsberg-house-corridor2.JPG',
      '/images/limpertsberg-house-corridor.jpg'
    ],
    rooms: [
      { id: 'h-r1', name: 'Standard Double A', price: null, charges: null, size: '13m²', available: 'Indefinite', status: 'occupied', features: 'Ground floor, Dedicated WC', images: ['/images/limpertsberg-house-room10.JPG'] },
      { id: 'h-r2', name: 'Standard Double B', price: null, charges: null, size: '13m²', available: 'Indefinite', status: 'occupied', features: '1st floor', images: ['/images/limpertsberg-house-room11.JPG','/images/limpertsberg-house-room11-2.JPG'] },
      { id: 'h-r3', name: 'Suite Double A', price: 1100, charges: 150, size: '16m²', available: '2026-03-01', status: 'available', features: '1st floor', images: ['/images/limpertsberg-house-room12.JPG'] },
      { id: 'h-r4', name: 'Mini Double A', price: null, charges: null, size: '11m²', available: 'Indefinite', status: 'occupied', features: '1st floor', images: ['/images/limpertsberg-house-room13.jpg','/images/limpertsberg-house-room13-2.jpg'] },
      { id: 'h-r5', name: 'Suite Double B', price: null, charges: null, size: '15m²', available: 'Indefinite', status: 'occupied', features: '2nd floor', images: ['/images/limpertsberg-house-room22.jpg'] },
      { id: 'h-r6', name: 'Suite Double C', price: 1050, charges: 150, size: '16m²', available: '2026-03-01', status: 'available', features: '2nd floor', images: ['/images/limpertsberg-house-room22.jpg'] },
      { id: 'h-r7', name: 'Standard Double C', price: null, charges: null, size: '12.5m²', available: 'Indefinite', status: 'occupied', features: '2nd floor, Skylight window', images: ['/images/limpertsberg-house-room23.JPG'] },
    ]
  },
  {
    id: 'dom-house',
    title: 'Dommeldange Grand Residence',
    location: 'Dommeldange Gare, Luxembourg City',
    address: '15 Rue des Hauts-Fourneaux',
    totalSpace: '250m² + 20m² terrace',
    type: 'House',
    mapPos: { top: '25%', left: '75%' },
    tags: ['3 Floors', 'Excellent Connection', 'Spacious'],
    description: 'A magnificent 3-story Grand Residence located in the quiet area of Dommeldange Gare. Close to the train station and Kirchberg, this property features 8 fully renovated rooms, a large common area, and beautiful forest views.',
    locationHighlights: [
      { icon: 'Train', text: "Right next to Dommeldange Gare" },
      { icon: 'Bus', text: "Direct bus to Kirchberg (150 min)" },
      { icon: 'Trees', text: "Direct access to Grengewald forest trails" },
      { icon: 'Clock', text: "8 min to Clausen nightlife" }
    ],
    amenities: [
      '2Gbit speed fiber internet', '8 Bedrooms', 'Forest View', 'Large Kitchen', '3 Bathrooms', 
      'Laundry Room', 'Weekly Maid', 'Garden/Terrace', 'BBQ Area', 'Bike Storage', 
      'Dishwasher', 'Microwave', 'Oven', 'Coffee Machine'
    ],
    image: '/images/dommeldange-room12.JPG',
    images: [
      '/images/dommeldange-dinning.JPG',
      '/images/dommeldange-living.JPG',
      '/images/dommeldange-corridor.JPG',
      '/images/dommeldange-corridor2.JPG'
    ],

    rooms: [
      { id: 'h-r1', name: 'Standard Double A', price: 700, charges: 150, size: '13m²', available: '2026-04-01', status: 'available', features: 'Ground floor', images: ['/images/limpertsberg-house-room10.JPG'] },
      { id: 'h-r2', name: 'Standard Double B', price: 700, charges: 150, size: '13m²', available: '2026-04-01', status: 'available', eatures: 'Ground floor', images: ['/images/limpertsberg-house-room10.JPG'] },
      { id: 'h-r3', name: 'Standard Double C', price: 750, charges: 150, size: '13m²', available: '2026-04-01', status: 'available', features: '1st floor', images: ['/images/limpertsberg-house-room12.JPG'] },
      { id: 'h-r4', name: 'Grand Suite Double', price: 850, charges: 150, size: '18m²', available: '2026-04-01', status: 'available', features: '1st floor', images: ['/images/dommeldange-room12.JPG','/images/dommeldange-room12-2.JPG'] },
      { id: 'h-r5', name: 'Standard Double D', price: 750, charges: 150, size: '13m²', available: '2026-04-01', status: 'available', features: '1st floor', images: ['/images/limpertsberg-house-room12.JPG'] },
      { id: 'h-r6', name: 'Suite Double A', price: 800, charges: 150, size: '16m²', available: '2026-04-15', status: 'available', features: '2nd floor', images: ['/images/limpertsberg-house-room22.jpg'] },
      { id: 'h-r7', name: 'Suite Double B', price: 800, charges: 150, size: '16m²', available: '2026-04-15', status: 'available', features: '2nd floor', images: ['/images/limpertsberg-house-room22.jpg'] },
      { id: 'h-r8', name: 'Suite Double C', price: 800, charges: 150, size: '16m²', available: '2026-04-15', status: 'available', features: '2nd floor, Skylight window', images: ['/images/limpertsberg-house-room23.JPG'] }
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
    image: '/images/bertrange-apt-room2.jpg',
    images: [
      '/images/bertrange-apt-main.jpg',
      '/images/bertrange-apt-main2.jpg',
      '/images/bertrange-apt-balcony.jpeg',
      '/images/bertrange-apt-garden.jpeg',
      '/images/bertrange-apt-corridor1.jpg',
      '/images/bertrange-apt-corridor2.jpg',
    ],
    rooms: [
      { id: 'b-r1', name: 'Bright room A', price: 1000, charges: 150, size: '10m²', available: '2026-05-01', status: 'available', features: 'Street view', images: ['/images/bertrange-apt-room1.jpeg'] },
      { id: 'b-r2', name: 'Bright room B', price: null, charges: null, size: '10m²', available: 'Indefinite', status: 'occupied', features: 'Street view', images: ['/images/bertrange-apt-room2.jpg'] },
      { id: 'b-r3', name: 'Cosy room', price: null, charges: null, size: '13m²', available: '2026-02-01', status: 'available', features: 'Street view', images: ['/images/bertrange-apt-room3.jpg'] },
    ]
  },
  {
    id: 'limp-apt',
    title: 'Limpertsberg SkylineFlat',
    location: 'Limpertsberg, Luxembourg City',
    address: '342 Rue de Rollingergrund',
    totalSpace: '118m² + 6m² balcony',
    type: 'Apartment',
    mapPos: { top: '38%', left: '48%' },
    tags: ['City Central', 'Forest View', 'Bright & Spacious'],
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
    image: '/images/limpertsberg-apt-room4.JPG',
    images: [
      '/images/limpertsberg-apt-living.JPG',
      '/images/limpertsberg-apt-kitchen.JPG',
      '/images/limpertsberg-apt-balcony1.JPG',
      '/images/limpertsberg-apt-balcony2.JPG',
      '/images/limpertsberg-apt-bath1.JPG',
      '/images/limpertsberg-apt-bath2.JPG',
    ],
    rooms: [
      { id: 'l-r1', name: 'Bright room with private balcony', price: null, charges: null, size: '16.4m² + 3m² balcony', available: 'Indefinite', status: 'occupied', features: 'Garden view, Private balcony access', images: ['/images/limpertsberg-apt-room1.JPG'] },
      { id: 'l-r2', name: 'Bright double room', price: null, charges: null, size: '12m²', available: 'Indefinite', status: 'occupied', features: 'Garden view', images: ['/images/limpertsberg-apt-room2.JPG'] },
      { id: 'l-r3', name: 'Suite double room', price: null, charges: null, size: '14m²', available: 'Indefinite', status: 'occupied', features: 'Garden view, Private balcony access', images: ['/images/limpertsberg-apt-room3.JPG','/images/limpertsberg-apt-room3-2.JPG'] },
      { id: 'l-r4', name: 'Spacious room with private balcony', price: null, charges: null, size: '19.2m² + 3m² balcony', available: 'Indefinite', status: 'occupied', features: 'Forest view, Private balcony access', images: ['/images/limpertsberg-apt-room4.JPG'] },
      { id: 'l-r5', name: 'Cosy double room', price: null, charges: null, size: '12m²', available: 'Indefinite', status: 'occupied', features: 'Forest view', images: ['/images/limpertsberg-apt-room5.JPG','/images/limpertsberg-apt-room5-2.JPG'] },
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
