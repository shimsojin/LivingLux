// Centralized content for LivingLux — edit texts, images, addresses here.

import { Trees } from "lucide-react";

export const CORE_VALUES = [
  { icon: 'Heart', title: "Lifestyle Match", desc: "Curated homes designed to match the dynamic lifestyle of young professionals." },
  { icon: 'Key', title: "Move-in Ready", desc: "Fully furnished with style. Just bring your suitcase and feel at home from day one." },
  { icon: 'MapPin', title: "Prime Locations", desc: "Strategically located in Limpertsberg, Dommeldange Gare, and Bertrange for your comfortable commute to work." },
  { icon: 'Calendar', title: "Flexible Terms", desc: "We understand your needs. Lease terms starting from just 3 months." },
  { icon: 'Star', title: "Premium Facilities", desc: "High-end furniture, modern appliances, and top-tier amenities for maximum comfort." },
  { icon: 'Zap', title: "Hassle-Free Living", desc: "2Gbps fiber internet, regular cleaning service, and fast troubleshooting included." },
];

export const HOUSE_RULES = [
  { icon: 'HeartHandshake', title: "Community First", desc: "Respect your housemates and treat everyone with kindness." },
  { icon: 'Moon', title: "Quiet Hours", desc: "Please keep noise to a minimum between 10 PM and 7 AM." },
  { icon: 'Trash2', title: "Cleanliness", desc: "Weekly professional cleaning covers common areas. Though, everyone may clean up the kitchen and common spaces after every use." },
  { icon: 'CigaretteOff', title: "No Smoking", desc: "Smoking is strictly prohibited inside all premises." },
];

export const FAQS = [
  { question: "Is there an agency fee?", answer: "No. All our properties are rented directly by the owners, so you save on agency fees (typically 1 month rent + VAT). We believe in transparent and fair pricing." },
  { question: "What is the typical tenant profile?", answer: "Our community consists of young professionals (22-35 years old) working in Luxembourg's major sectors like finance, tech, and European institutions." },
  { question: "What is included in the charges?", answer: "Charges include 2Gbps fiber internet, water, heating, electricity, weekly cleaning of common areas, and garbage disposal." },
  { question: "What is the minimum rental duration?", answer: "Our standard contracts start from 3 months. We offer flexibility for interns and project-based professionals depending on availability." },
  { question: "How do I apply?", answer: "Simply click 'Apply Now' on the room or garage you are interested in. We will review your application and get back to you within 24 hours to schedule a viewing." },
];

export const GARAGES = [
  { id: 'g1', name: 'High-ceiling box garage', location: 'Limpertsberg', price: 350, status: 'available', size: '20m²', type: 'Box garage', utilitiesConnected: true, image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600' },
  { id: 'g2', name: 'Box garage', location: 'Limpertsberg', price: 300, status: 'rented', size: '18m²', type: 'Box garage', utilitiesConnected: true, image: '/images/limpertsberg-apt-garage.JPG' },
  { id: 'g3', name: 'High-ceiling box garage', location: 'Dommeldange Gare', price: 350, status: 'available', size: '20m²', type: 'Box garage', utilitiesConnected: true, image: '/images/dommeldange-garage.JPG' },
  { id: 'g4', name: 'Underground parking lot', location: 'Bertrange', price: 100, status: 'rented', size: '13m²', type: 'Indoor', utilitiesConnected: false, image: '/images/bertrange-apt-garage-indoor.JPG' },
  { id: 'g5', name: 'Private outdoor parking lot', location: 'Bertrange', price: 75, status: 'rented', size: '18m²', type: 'Outdoor', utilitiesConnected: false, image: '/images/bertrange-apt-garage-outdoor.JPG' },
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
    tags: ['Central', 'High-end', 'Spacious'],
    description: 'A prestigious three-story residence, fully renovated to a high-end standard, offering an exceptional coliving experience in Limpertsberg area.\nThe house features generous common areas thoughtfully designed for comfort and social living, while ensuring a high level of privacy for each resident.\nA brand-new, fully equipped kitchen will be delivered and installed on 1 February.\nEach room is furnished with comfortable, nearly new furniture, including a double bed, dedicated work desk and chair, large mirrored wardrobe, bedside table, smart lightings, and electric shutters, allowing you to move in with ease from day one.\nThe community is composed of young professionals in their mid-20s to mid-30s, in a mixed-gender environment, working in leading organisations such as Amazon, major banks, European institutions, and the public sector. The atmosphere is professional, respectful, and well-balanced—ideal for focused work and comfortable living.\n\nCommune registration is included.',
    locationHighlights: [
      { icon: 'Briefcase', text: "20 min walk to City Centre" },
      { icon: 'Bus', text: "1 min walk to the bus stop" },
      { icon: 'Bus', text: "15 min direct bus to Kirchberg" },
      { icon: 'Bus', text: "5 min bus ride to Place de l'Étoile" },
      { icon: 'Clock', text: "Restaurants 2-10 min walk" },
      { icon: 'Trees', text: "2 min walk to Bambesch forest" }
    ],
    amenities: [
      'Fully furnished', '2Gbps fiber internet', 'Weekly professional cleaning', 'Common space more than 100m²',
      '3 modern bathrooms', 'Smart TV', 'Smart lighting', 'Smart heating system', 'Washing Machine & Dryer', 
      'Brand-new kitchen', 'Dining and Cooking sets', 'Dishwasher', 'Large Fridge & Freezer', 'Coffee Machine & Toaster', 
      'Iron & Ironing Board', 'Bed Linen Provided'
    ],
    image: '/images/limpertsberg-house-room22.jpg',
    images: [
      '/images/limpertsberg-house-main.jpg',
      '/images/limpertsberg-house-living.JPG',
      '/images/limpertsberg-house-kitchen.JPG',
      '/images/limpertsberg-house-bath1.jpg',
      '/images/limpertsberg-house-bath2.jpg',
      '/images/limpertsberg-house-bath3.JPG',
      '/images/limpertsberg-house-corridor2.JPG',
      '/images/limpertsberg-house-corridor.jpg'
    ],
    rooms: [
      { id: 'h-r1', name: 'Standard Double A', price: null, charges: null, size: '13m²', available: 'Indefinite', status: 'occupied', features: 'Ground floor, Dedicated WC', images: ['/images/limpertsberg-house-room10.JPG','/images/limpertsberg-house-room10-2.JPG'] },
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
    tags: ['Excellent Connection', 'Spacious', 'To-be High-end'],
    description: 'A magnificent three-storey Grand Residence located in the quiet area of Dommeldange Gare, just steps from the train station and with excellent access to Kirchberg and the city centre. The property offers eight rooms, a spacious common living area, and a private terrace, creating a comfortable and well-balanced coliving environment.\n\nWith multiple direct train and bus connections, commuting to Kirchberg, the city centre, or major business districts is fast and effortless.\n\nEach room is furnished with comfortable, nearly new furniture, including a double bed, dedicated work desk and chair, large mirrored wardrobe, bedside table, and smart lighting, allowing you to move in seamlessly from day one.\n\nThe community consists of young professionals in their mid-20s to mid-30s, in a mixed-gender environment, working at leading organisations such as Amazon, major banks, European institutions, and the public sector.\n\nThe house is currently undergoing continuous upgrades to its common areas and facilities. Rental pricing has been adjusted accordingly, and the room photos accurately represent the room you will receive upon arrival.\n\nCommune registration is included.',
    locationHighlights: [
      { icon: 'Train', text: "1 min walk to Dommeldange Gare" },
      { icon: 'Train', text: "5 min direct train to Kirchberg (every 10 min)" },
      { icon: 'Train', text: "10 min direct train to Luxembourg Gare (every 10 min)" },
      { icon: 'Train', text: "15 min direct train to Cloche d'Or (every 10 min)" },
      { icon: 'Bus', text: "1 min walk to the bus stop" },
      { icon: 'Bus', text: "5 min direct bus to Kirchberg" },
      { icon: 'Bus', text: "8 min direct bus to Hamilius" },
      { icon: 'Trees', text: "Restaurant, cafe, grocery within 5 min walk" },
      { icon: 'Clock', text: "5 min walk to the hospital" }
    ],
    amenities: [
      'Fully furnished', '2Gbps fiber internet', 'Weekly professional cleaning', 'Common space more than 100m²', 
      '3 modern bathrooms', 'Smart TV', 'Smart lighting', 'Smart heating system', 'Shutter with solar panel', 'Washing Machine & Dryer', 
      'Brand-new kitchen', 'Dining and Cooking sets', 'Dishwasher', 'Large Fridge & Freezer', 'Coffee Machine & Toaster', 
      'Iron & Ironing Board', 'Bed Linen Provided'
    ],
    image: '/images/dommeldange-room12.JPG',
    images: [
      '/images/dommeldange-dinning.JPG',
      '/images/dommeldange-living.JPG',
      '/images/dommeldange-corridor.JPG',
      '/images/dommeldange-corridor2.JPG'
    ],

    rooms: [
      { id: 'h-r1', name: 'Standard Double A', price: 700, charges: 150, size: '13m²', available: '2026-04-01', status: 'available', features: 'Ground floor', images: ['/images/limpertsberg-house-room10.JPG','/images/limpertsberg-house-room10-2.JPG'] },
      { id: 'h-r2', name: 'Standard Double B', price: 700, charges: 150, size: '13m²', available: '2026-04-01', status: 'available', features: 'Ground floor', images: ['/images/limpertsberg-house-room10.JPG','/images/limpertsberg-house-room10-2.JPG'] },
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
    tags: ['Excellent Connection', 'High-end', 'Private Garden'],
    description: 'A luxurious apartment perfect for those seeking nature near the city. Features a stunning private garden and high-end finishes.With multiple direct bus and train connections, commuting to the city centre is effortless. \n\nEach room is furnished with comfortable, nearly new furniture, including a double bed, dedicated work desk and chair, large mirrored wardrobe, bedside table, smart lighting, and electric shutters, allowing you to move in seamlessly from day one.\n\nThe community is composed of young professionals in their mid-20s to mid-30s, in a mixed-gender environment, working at leading organisations such as Amazon, major banks, European institutions, and the public sector.\n\nCommune registration is included.',
    locationHighlights: [
      { icon: 'Bus', text: "1 min walk to the bus stop" },
      { icon: 'Bus', text: "15 min direct bus to Hamilius (City Center)" },
      { icon: 'Train', text: "3 min walk to Bertrange train station" },
      { icon: 'Train', text: "5 min direct train to Luxembourg Gare" },
      { icon: 'Clock', text: "5 min bus rides to 4 large supermarkets" },
      { icon: 'Trees', text: "Private garden access" },
      { icon: 'Trees', text: "Quiet, green, and upscale residential area" }
    ],
    amenities: [
      'Fully furnished', '2Gbps fiber internet', 'Weekly professional cleaning', '2 modern bathrooms',
      'Smart lighting', 'Smart heating system', 'Electronic shutters', 'Washing Machine & Dryer', 'High-end kitchen', 
      'Dining and Cooking sets', 'Dishwasher', 'Large Fridge & Freezer', 'Coffee Machine & Toaster', 'Bed Linen Provided'
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
      { id: 'b-r3', name: 'Cosy room', price: 1000, charges: 150, size: '13m²', available: '2026-02-01', status: 'available', features: 'Street view', images: ['/images/bertrange-apt-room3.jpg'] },
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
    tags: ['Prime Location', 'Bright', 'Forest View'],
    description: 'A bright five-bedroom apartment with dual balconies offering sunlight from morning to evening, located in the heart of Luxembourg City with excellent transport connections. \n\nWith multiple direct bus connections, commuting to the city centre, Kirchberg, or major business districts is effortless. \n\nEach room is furnished with comfortable, nearly new furniture, including a double bed, dedicated work desk and chair, large mirrored wardrobe, bedside table, smart lighting, and electric shutters, allowing you to move in seamlessly from day one.\n\nThe community is composed of young professionals in their mid-20s to mid-30s, in a mixed-gender environment, working at leading organisations such as Amazon, major banks, European institutions, and the public sector.\n\nCommune registration is included.',
    locationHighlights: [
      { icon: 'Briefcase', text: "20 min walk to City Centre" },
      { icon: 'Bus', text: "1 min walk to the bus stop" },
      { icon: 'Bus', text: "15 min direct bus to Kirchberg" },
      { icon: 'Bus', text: "5 min bus ride to Place de l'Étoile" },
      { icon: 'Clock', text: "Restaurants 2-10 min walk" },
      { icon: 'Trees', text: "2min walk to Bambesch forest" }
    ],
    amenities: [
      'Fully furnished', '2Gbps fiber internet', 'Weekly professional cleaning', 
      '2 modern bathrooms', 'Smart TV', 'Smart lighting', 'Smart heating system', 'Shutter with solar panel',
      'Washing Machine & Dryer', 'Fully equipped kitchen', 'Dining and Cooking sets', 'Dishwasher', 'Large Fridge & Freezer', 
      'Coffee Machine & Toaster', 'Iron & Ironing Board', 'Bed Linen Provided'
    ],
    image: '/images/limpertsberg-apt-room4.JPG',
    images: [
      '/images/limpertsberg-apt-living.JPG',
      '/images/limpertsberg-apt-kitchen.JPG',
      '/images/limpertsberg-apt-balcony1.jpeg',
      '/images/limpertsberg-apt-balcony2.jpeg',
      '/images/limpertsberg-apt-bath1.jpeg',
      '/images/limpertsberg-apt-bath2.jpeg',
    ],
    rooms: [
      { id: 'l-r1', name: 'Bright room with private balcony', price: null, charges: null, size: '16.4m² + 3m² balcony', available: 'Indefinite', status: 'occupied', features: 'Garden view, Private balcony access', images: ['/images/limpertsberg-apt-room1.JPG'] },
      { id: 'l-r2', name: 'Bright double room', price: null, charges: null, size: '12m²', available: 'Indefinite', status: 'occupied', features: 'Garden view', images: ['/images/limpertsberg-apt-room2.jpeg'] },
      { id: 'l-r3', name: 'Suite double room', price: null, charges: null, size: '14m²', available: 'Indefinite', status: 'occupied', features: 'Garden view, Private balcony access', images: ['/images/limpertsberg-apt-room3.jpeg','/images/limpertsberg-apt-room3-2.jpeg'] },
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
