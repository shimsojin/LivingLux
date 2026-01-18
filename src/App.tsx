import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { 
  Home, MapPin, Bed, Bath, Trees, Calendar, Send, 
  CheckCircle, Briefcase, User, Mail, Phone, Shield, 
  ChevronRight, ChevronLeft, ArrowLeft, Star, LayoutGrid, X, Camera, ZoomIn,
  Moon, Trash2, CigaretteOff, HeartHandshake, Euro, FileText, Clock, Bus, Train,
  HelpCircle, Car, Users, Info, Map as MapIcon, Maximize, Wifi, Key, Zap, Sparkles, Heart, Copy
} from 'lucide-react';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

let app, auth, db;
try {
  if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn('Firebase init error:', e);
}

// --- Helper for Availability Summary ---
const getAvailabilitySummary = (rooms) => {
  const availableRooms = rooms.filter(r => r.status === 'available');
  
  if (availableRooms.length === 0) {
    return { count: 0, text: 'Fully Rented', color: 'text-slate-400' };
  }

  const sortedDates = availableRooms
    .map(r => r.available)
    .sort((a, b) => new Date(a) - new Date(b));
  
  const earliestDate = sortedDates[0];
  
  let dateDisplay = earliestDate;
  try {
    const dateObj = new Date(earliestDate);
    if (!isNaN(dateObj)) {
      dateDisplay = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch (e) {}

  return {
    count: availableRooms.length,
    text: `${availableRooms.length} Room${availableRooms.length > 1 ? 's' : ''} available\nEarliest from ${dateDisplay}`,
    color: 'text-emerald-600'
  };
};

// --- Helper to Generate Move-in Dates (1st & 16th) ---
const getMoveInOptions = () => {
  const options = [];
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  for (let i = 0; i < 12; i++) {
    const date1 = new Date(currentYear, currentMonth, 1);
    const date16 = new Date(currentYear, currentMonth, 16);

    if (date1 >= today) {
      options.push(date1.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
    }
    if (date16 >= today) {
      options.push(date16.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
    }

    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }
  return options;
};

// --- Constants ---
const CORE_VALUES = [
  { 
    icon: Heart, 
    title: "Lifestyle Match", 
    desc: "Curated homes designed to match the dynamic lifestyle of ambitious young professionals." 
  },
  { 
    icon: Key, 
    title: "Move-in Ready", 
    desc: "Fully furnished with style. Just bring your suitcase and feel at home from day one." 
  },
  { 
    icon: MapPin, 
    title: "Prime Locations", 
    desc: "Strategically located in Belair, Limpertsberg, and Bertrange for easy city access." 
  },
  { 
    icon: Calendar, 
    title: "Flexible Terms", 
    desc: "We understand your needs. Lease terms starting from just 3 months." 
  },
  { 
    icon: Star, 
    title: "Premium Facilities", 
    desc: "High-end furniture, modern appliances, and top-tier amenities for maximum comfort." 
  },
  { 
    icon: Zap, 
    title: "Hassle-Free Living", 
    desc: "2Gbit fiber internet, regular cleaning service, and fast troubleshooting included." 
  },
];

const HOUSE_RULES = [
  { icon: HeartHandshake, title: "Community First", desc: "Respect your housemates and treat everyone with kindness." },
  { icon: Moon, title: "Quiet Hours", desc: "Please keep noise to a minimum between 10 PM and 7 AM." },
  { icon: Trash2, title: "Cleanliness", desc: "Clean up after cooking. Weekly professional cleaning covers common areas." },
  { icon: CigaretteOff, title: "No Smoking", desc: "Smoking is strictly prohibited inside all properties." },
];

const FAQS = [
  { question: "Is there an agency fee?", answer: "No. All our properties are rented directly by the owners, so you save on agency fees (typically 1 month rent + VAT). We believe in transparent and fair pricing." },
  { question: "What is the typical tenant profile?", answer: "Our community consists of young professionals (22-35 years old) working in Luxembourg's major sectors like finance, tech, and European institutions." },
  { question: "What is included in the charges?", answer: "Charges include 2Gbit fiber internet, water, heating, electricity, weekly cleaning of common areas, and garbage disposal." },
  { question: "What is the minimum rental duration?", answer: "Our standard contracts start from 6 months. We offer flexibility for interns and project-based professionals depending on availability." },
  { question: "How do I apply?", answer: "Simply click 'Apply Now' on the room or garage you are interested in. We will review your application and get back to you within 24 hours to schedule a viewing." },
];

const GARAGES = [
  { id: 'g1', name: 'Garage Unit 1', location: 'Belair', price: 180, status: 'available', size: '15m²', type: 'Indoor Box', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600' },
  { id: 'g2', name: 'Garage Unit 2', location: 'Belair', price: 180, status: 'available', size: '15m²', type: 'Indoor Box', image: 'https://images.unsplash.com/photo-1574360772709-67990b79dc35?auto=format&fit=crop&q=80&w=600' },
  { id: 'g3', name: 'Garage Unit 3', location: 'Belair', price: 180, status: 'rented', size: '15m²', type: 'Indoor Box', image: 'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?auto=format&fit=crop&q=80&w=600' },
  { id: 'g4', name: 'Parking Spot A', location: 'Bertrange', price: 120, status: 'rented', size: '12m²', type: 'Outdoor', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600' },
  { id: 'g5', name: 'Parking Spot B', location: 'Bertrange', price: 120, status: 'rented', size: '12m²', type: 'Outdoor', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600' },
];

// --- Mock Data for Properties ---
const PROPERTIES = [
  // 1. Belair House
  {
    id: 'belair-house',
    title: 'Maison de Maître Belair',
    location: 'Belair, Luxembourg City',
    address: '365 rue de rollingergrund',
    totalSpace: '200m² + 5m² backyard',
    type: 'House',
    mapPos: { top: '45%', left: '42%' },
    tags: ['High-end', '3 Floors', 'Prestige'],
    description: 'An expansive 3-story high-end house offering the ultimate coliving experience in the prestigious Belair district. Generous common areas and premium privacy.',
    locationHighlights: [
      { icon: Bus, text: "2 min walk to Tram stop Place de l'Étoile" },
      { icon: Briefcase, text: "15 min walk to City Center" },
      { icon: Clock, text: "Quick access to Route d'Arlon" },
      { icon: Trees, text: "Next to Parc de Merl" }
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
      { 
        id: 'h-r1', name: 'Standard Double A', price: 950, charges: 150, size: '13m²', 
        available: '2026-03-01', status: 'available', features: 'Ground floor, Dedicated WC',
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'h-r2', name: 'Standard Double B', price: null, charges: null, size: '13m²', 
        available: 'Indefinite', status: 'occupied', features: '1st floor',
        images: ['https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'h-r3', name: 'Suite Double A', price: 1100, charges: 150, size: '16m²', 
        available: '2026-03-01', status: 'available', features: '1st floor',
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'h-r4', name: 'Mini Double A', price: null, charges: null, size: '11m²', 
        available: 'Indefinite', status: 'occupied', features: '1st floor',
        images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'h-r5', name: 'Suite Double B', price: null, charges: null, size: '15m²', 
        available: 'Indefinite', status: 'occupied', features: '2nd floor',
        images: ['https://images.unsplash.com/photo-1522771753035-4a53c9d1314f?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'h-r6', name: 'Suite Double C', price: 1050, charges: 150, size: '16m²', 
        available: '2026-03-01', status: 'available', features: '2nd floor',
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'h-r7', name: 'Standard Double C', price: null, charges: null, size: '12.5m²', 
        available: 'Indefinite', status: 'occupied', features: '2nd floor, Skylight window',
        images: ['https://images.unsplash.com/photo-1536349788264-1b816db3cc13?auto=format&fit=crop&q=80&w=600']
      },
    ]
  },
  // 2. Dommeldange House
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
      { icon: Train, text: "5 min walk to Dommeldange Train Station" },
      { icon: Bus, text: "Direct bus to Kirchberg (10 min)" },
      { icon: Trees, text: "Direct access to Grengewald forest trails" },
      { icon: Clock, text: "8 min to Clausen nightlife" }
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
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
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
  // 3. Limpertsberg Apartment
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
      { icon: Briefcase, text: "Walking distance to Big 4 firms" },
      { icon: Bus, text: "1 min to Bus stop" },
      { icon: Clock, text: "15 min walk to City Center" },
      { icon: Trees, text: "Close to Parc de Merl" }
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
      { 
        id: 'l-r1', name: 'Bright room with private balcony', price: null, charges: null, size: '16.4m² + 3m² balcony', 
        available: 'Indefinite', status: 'occupied', features: 'Garden view, Private balcony access',
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'l-r2', name: 'Spacious room with private balcony', price: null, charges: null, size: '19.2m² + 3m² balcony', 
        available: 'Indefinite', status: 'occupied', features: 'Forest view, Private balcony access',
        images: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'l-r3', name: 'Bright room', price: null, charges: null, size: '12m²', 
        available: 'Indefinite', status: 'occupied', features: 'Garden view',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600']
      },
    ]
  },
  // 4. Bertrange Apartment
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
      { icon: Bus, text: "Direct bus to City Center (20 min)" },
      { icon: Bus, text: "15 min to Cloche d'Or by bus" },
      { icon: Trees, text: "Private garden access" },
      { icon: Clock, text: "5 min to City Concorde Shopping Mall" }
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
      { 
        id: 'b-r1', name: 'Bright room 1', price: 1000, charges: 150, size: '10m²', 
        available: '2026-04-30', status: 'occupied', features: 'Street view',
        images: [
          'https://images.unsplash.com/photo-1616594039964-40891a909d93?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600'
        ]
      },
      { 
        id: 'b-r2', name: 'Bright room 2', price: null, charges: null, size: '10m²', 
        available: 'Indefinite', status: 'occupied', features: 'Street view',
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600']
      },
      { 
        id: 'b-r3', name: 'Cosy room', price: null, charges: null, size: '13m²', 
        available: 'Indefinite', status: 'occupied', features: 'Street view',
        images: ['https://images.unsplash.com/photo-1512918760530-772752699e9b?auto=format&fit=crop&q=80&w=600']
      },
    ]
  }
];

// --- Components ---

const Lightbox = ({ isOpen, onClose, images, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next(e);
      if (e.key === 'ArrowLeft') prev(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  if (!isOpen) return null;

  const next = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[110]"
      >
        <X className="w-8 h-8" />
      </button>
      
      <div 
        className="relative w-full max-w-7xl h-full flex items-center justify-center" 
        onClick={e => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt="Full screen view" 
          className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prev} 
              className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white hover:bg-black/20 rounded-r-lg transition-all focus:outline-none group"
            >
              <ChevronLeft className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={next} 
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white hover:bg-black/20 rounded-l-lg transition-all focus:outline-none group"
            >
              <ChevronRight className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium px-4 py-1.5 bg-black/60 rounded-full backdrop-blur-md border border-white/10">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Seamless infinite-scroll image reel with 1.3x speed
const ImageReel = ({ property, onBack, onImageClick }) => {
  const originalImages = property.images || [property.image];
  const images = [...originalImages, ...originalImages]; 
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || originalImages.length <= 1) return;
    
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId;
    let scrollSpeed = 1.3; // Increased speed (1.3x faster than original 1.0)

    const scroll = () => {
      if (isPaused || !container) return;
      
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, originalImages.length]);

  return (
    <div 
      className="relative w-full group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto overflow-y-hidden scrollbar-hide h-[60vh] touch-pan-x"
        style={{ scrollBehavior: 'auto' }} 
      >
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-full md:w-[80vw] lg:w-[60vw] h-full relative cursor-zoom-in border-r border-white/10"
            onClick={() => onImageClick(originalImages, idx % originalImages.length)}
          >
            <img 
              src={img} 
              alt={`${property.title} - view`}
              className="w-full h-full object-cover"
            />
            {idx < originalImages.length && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {idx + 1}/{originalImages.length}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-2">
            {property.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-emerald-500/80 text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 shadow-sm">{property.title}</h1>
          <div className="flex items-center gap-2 text-slate-200">
            <MapPin className="w-5 h-5 text-emerald-400" />
            {property.location}
          </div>
        </div>
      </div>
    </div>
  );
};

const AmenitiesSection = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleAmenities = showAll ? amenities : amenities.slice(0, 6);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Amenities & Features</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {visibleAmenities.map(item => (
          <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-100 shadow-sm animate-fade-in">
            {item.includes('fiber internet') ? (
              <Wifi className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            )}
            <span className="font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>
      {amenities.length > 6 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1"
        >
          {showAll ? (
            <>Show Less <ChevronLeft className="w-4 h-4 rotate-90" /></>
          ) : (
            <>List of all amenities <ChevronRight className="w-4 h-4 rotate-90" /></>
          )}
        </button>
      )}
    </section>
  );
};

const AdminDashboard = ({ user, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (!db) { setLoading(false); return; }
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'applications');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Owner Dashboard
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-white">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center text-gray-400">
            No applications received yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map(app => (
              <div key={app.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{app.fullName}</h3>
                    <p className="text-emerald-400 text-sm">{app.propertyName} - {app.roomName}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 md:mt-0">
                    {app.createdAt ? new Date(app.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {app.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {app.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {app.occupation} ({app.contractType})
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Employer: {app.employer}
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4" /> Gross: €{app.grossSalary}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Move-in: {app.moveInDate}
                  </div>
                </div>

                {app.message && (
                  <div className="bg-gray-900/50 p-3 rounded text-sm text-gray-400 italic">
                    "{app.message}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ApplicationModal = ({ property, room, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText("info@livinglux.lu");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl p-8 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">How to Apply</h3>
          <p className="text-slate-600 mt-2">
            To apply for <strong>{room.name}</strong> at <strong>{property.title}</strong>, please email us directly.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 text-center">
             <p className="text-sm text-slate-500 mb-2">Send your application to:</p>
             <div className="flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="font-bold text-lg text-slate-800 select-all">info@livinglux.lu</span>
                <button onClick={handleCopy} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500">
                    {copied ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </button>
             </div>
        </div>

        <div className="text-left space-y-4">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <Info className="w-4 h-4" /> Please include in your email:
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
            <li>Full Name & Phone Number</li>
            <li>Occupation & Contract Type (CDI/CDD)</li>
            <li>Employer Name</li>
            <li>Gross Monthly Salary</li>
            <li>Desired Move-in Date (1st or 16th)</li>
            <li>Planned Duration of Stay</li>
          </ul>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
                We typically respond within 24 hours.
            </p>
        </div>
      </div>
    </div>
  );
};

const RoomCard = ({ room, property, onApply, onImageClick }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const isAvailable = room.status === 'available';
  const images = room.images || (room.image ? [room.image] : []);

  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  return (
    <div className={`group relative bg-white border border-slate-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-100 ${!isAvailable ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      <div 
        className="h-48 overflow-hidden relative group/image cursor-zoom-in" 
        onClick={() => onImageClick(images, currentImgIdx)}
      >
        <img src={images[currentImgIdx]} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-black/60 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20">Rented</span>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover/image:opacity-100 backdrop-blur-sm z-20">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover/image:opacity-100 backdrop-blur-sm z-20">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white font-medium z-20">
              {currentImgIdx + 1}/{images.length}
            </div>
          </>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{room.name}</h4>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <LayoutGrid className="w-4 h-4" />
              <span>{room.size}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            {room.price ? (
              <>
                <div>
                  <span className="font-bold text-emerald-600 text-xl">€{room.price}</span>
                  <span className="text-xs text-slate-400 ml-1">/month</span>
                </div>
                {room.charges && (
                  <div className="text-xs text-slate-500 font-medium mt-0.5">+ €{room.charges} charges</div>
                )}
              </>
            ) : (
              <div className="font-bold text-slate-400 text-lg">Rented</div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{room.features}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium ${isAvailable ? 'text-emerald-600' : 'text-amber-600'}`}>
            <Calendar className="w-4 h-4" />
            <span>{isAvailable ? `Available: ${room.available}` : (room.available === 'Indefinite' ? 'Currently Rented' : `Booked until ${room.available}`)}</span>
          </div>
        </div>

        <button onClick={() => isAvailable && onApply(property, room)} disabled={!isAvailable}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${isAvailable ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
          {isAvailable ? 'Apply Now' : 'Currently Rented'}
        </button>
      </div>
    </div>
  );
};

const ContactInfoSection = () => {
  return (
    <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-100 text-center">
      <h3 className="text-3xl font-bold text-slate-900 mb-8">Get in Touch</h3>
      <div className="grid md:grid-cols-3 gap-8 justify-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
            <Phone className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Phone / WhatsApp</h4>
          <p className="text-slate-600 text-lg font-medium">+352 661 841 915</p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
            <Mail className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Email</h4>
          <a href="mailto:info@livinglux.lu" className="text-emerald-600 text-lg font-medium hover:underline">
            info@livinglux.lu
          </a>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
            <Clock className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Business Hours</h4>
          <p className="text-slate-600 text-lg">Mon - Fri: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
  );
};

const FaqView = () => (
  <div className="max-w-4xl mx-auto px-4 py-24 animate-fade-in">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        Everything you need to know about renting a room or garage with LivingLux.
      </p>
    </div>
    <div className="space-y-6">
      {FAQS.map((faq, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-xl text-slate-900 mb-3 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            {faq.question}
          </h3>
          <p className="text-slate-600 leading-relaxed pl-9 text-lg">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
);

// Map Component with CSS circles
const PropertyMap = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
        <MapIcon className="w-8 h-8 text-emerald-600" />
        Property Locations
      </h2>
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
        {/* Placeholder Map Image - User will replace this */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Location Map" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs text-slate-500">
          * Map of Luxembourg City
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); // 'home' | 'faq' | 'property'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [applyingFor, setApplyingFor] = useState(null); 
  const [showAdmin, setShowAdmin] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase auth not initialized; skipping auth setup.');
      return;
    }

    const initAuth = async () => {
      try {
        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (token) {
          await signInWithCustomToken(auth, token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.warn('Auth initialization failed:', e);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Scroll to top when view or property changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedProperty]);

  const handleApplySuccess = () => {
    setApplyingFor(null);
    setNotification({ type: 'success', message: 'Application received! We will contact you shortly.' });
    setTimeout(() => setNotification(null), 5000);
  };

  const openLightbox = (images, index = 0) => {
    setLightbox({ isOpen: true, images, index });
  };

  const handlePropertySelect = (prop) => {
    setSelectedProperty(prop);
    setView('property');
  };

  const handleNavClick = (targetView) => {
    setSelectedProperty(null);
    setView(targetView);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-bounce-in">
          <CheckCircle className="w-5 h-5" />
          {notification.message}
        </div>
      )}

      <Lightbox 
        isOpen={lightbox.isOpen} 
        onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
        images={lightbox.images}
        initialIndex={lightbox.index}
      />

      {applyingFor && (
        <ApplicationModal 
          property={applyingFor.property} 
          room={applyingFor.room} 
          onClose={() => setApplyingFor(null)}
          onSuccess={handleApplySuccess}
        />
      )}
      
      {showAdmin && (
        <AdminDashboard 
          user={user} 
          onClose={() => setShowAdmin(false)} 
        />
      )}

      {/* --- Header --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => handleNavClick('home')}
          >
            <img 
              src="./public/images/logo.png" 
              alt="LivingLux Logo" 
              className="h-14 w-14 object-cover rounded-lg"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">LivingLux</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('home')} className={`text-sm font-medium transition-colors ${view === 'home' && !selectedProperty ? 'text-emerald-600' : 'hover:text-emerald-600'}`}>Our Houses</button>
            <button onClick={() => { handleNavClick('home'); setTimeout(() => document.getElementById('garages')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-emerald-600 transition-colors">Garages</button>
            <button onClick={() => handleNavClick('faq')} className={`text-sm font-medium transition-colors ${view === 'faq' ? 'text-emerald-600' : 'hover:text-emerald-600'}`}>FAQ</button>
            <button onClick={() => { handleNavClick('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-emerald-600 transition-colors">About Us</button>
          </nav>
        </div>
      </header>

      {/* --- Main Content Switch --- */}
      {view === 'faq' ? (
        <FaqView />
      ) : selectedProperty ? (
        // --- Single Property View ---
        <main className="animate-fade-in">
          <ImageReel 
            property={selectedProperty} 
            onBack={() => { setSelectedProperty(null); setView('home'); }}
            onImageClick={openLightbox} 
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left: Info */}
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-900">About this property</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{selectedProperty.description}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                    Location
                  </h2>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {selectedProperty.locationHighlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                            <highlight.icon className="w-5 h-5" />
                          </div>
                          <span className="text-slate-700">{highlight.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <AmenitiesSection amenities={selectedProperty.amenities} />

                <section>
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                    Available Rooms
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full font-medium">
                      {selectedProperty.rooms.filter(r => r.status === 'available').length} Available
                    </span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedProperty.rooms.map(room => (
                      <RoomCard 
                        key={room.id} 
                        room={room} 
                        property={selectedProperty}
                        onApply={(p, r) => setApplyingFor({ property: p, room: r })}
                        onImageClick={openLightbox}
                      />
                    ))}
                  </div>
                </section>

                <section className="pt-8 border-t border-slate-200">
                   <h2 className="text-2xl font-bold mb-6 text-slate-900">Why Choose LivingLux?</h2>
                   <div className="grid sm:grid-cols-2 gap-6">
                    {CORE_VALUES.map((val, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-rose-50 rounded-lg border border-rose-100 hover:-translate-y-1 transition-transform">
                        <div className="flex-shrink-0 w-10 h-10 bg-white text-rose-500 rounded-full flex items-center justify-center shadow-sm">
                          <val.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{val.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{val.desc}</p>
                        </div>
                      </div>
                    ))}
                   </div>
                </section>
              </div>

              {/* Right: Sticky Sidebar / Contact */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Interested in viewing?</h3>
                  <p className="text-slate-600 mb-6">
                    Please <strong>apply now</strong> directly for a specific room to schedule a viewing. 
                    For any questions, feel free to email us at <a href="mailto:info@livinglux.lu" className="text-emerald-600 hover:underline">info@livinglux.lu</a>.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase text-slate-400">WhatsApp / Call</div>
                        <div className="font-medium">+352 661 841 915</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase text-slate-400">Email</div>
                        <div className="font-medium">info@livinglux.lu</div>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-6 border-slate-100" />
                  
                  <div className="bg-emerald-50 p-4 rounded-lg flex gap-3">
                    <Star className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-emerald-800">
                      Perfect for young professionals working at Amazon, Big 4, or European Institutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        // --- Home View ---
        <main>
          {/* Hero Section */}
          <div className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40"></div>
            <div className="relative max-w-7xl mx-auto text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm font-semibold mb-6 animate-fade-in-up">
                EXCLUSIVE COLIVING IN LUXEMBOURG
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up delay-100">
                Live Where You Thrive
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6 animate-fade-in-up delay-200">
                Curated residences in Bertrange and Limpertsberg designed for young professionals. High-end amenities, great communities, flexible terms.
              </p>
              
              {/* No Agency Fee Banner */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-10 animate-fade-in-up delay-300">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-emerald-100">No Agency Fees — Rented Directly by Owners</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                <button onClick={() => document.getElementById('houses').scrollIntoView({behavior: 'smooth'})} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/50">
                  View Properties
                </button>
              </div>
            </div>
          </div>

          {/* Property Map Section */}
          <PropertyMap />

          {/* Properties Grid (Our Houses) */}
          <div id="houses" className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-200">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Houses</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Each property is unique, fully furnished, and ready for you to move in. Click on a property to see available rooms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {PROPERTIES.map((prop, idx) => {
                const availability = getAvailabilitySummary(prop.rooms);
                
                return (
                  <div 
                    key={prop.id}
                    onClick={() => handlePropertySelect(prop)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col h-full"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={prop.image} 
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-slate-800 shadow-sm">
                        {prop.type}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-2">
                        <MapPin className="w-4 h-4" />
                        {prop.location}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                        {prop.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {prop.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-6">
                        <Maximize className="w-3 h-3" />
                        {prop.totalSpace}
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-auto">
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Availability</div>
                          <div className={`text-sm font-bold flex items-start gap-2 whitespace-pre-line ${availability.color}`}>
                            {availability.count > 0 && <Calendar className="w-4 h-4 mt-0.5" />}
                            {availability.text}
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-slate-400 font-medium text-sm group-hover:text-emerald-600 transition-colors">
                          View <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flatmates Section */}
          <div className="bg-slate-900 text-white py-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Who are our flatmates?</h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Our community is curated for ambitious young professionals aged typically between mid-20s and mid-30s. 
                They work at prestigious institutions including <span className="text-white font-semibold">Amazon, Big 4 firms, European Institutions, and major Banks</span>. 
                We foster a professional yet social environment where you can network, relax, and feel at home.
              </p>
            </div>
          </div>

          {/* Garages Section */}
          <div id="garages" className="max-w-7xl mx-auto px-4 py-24 border-b border-slate-200">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Parking & Garages</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Secure parking spots available for rent independently.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {GARAGES.map((garage) => (
                <div key={garage.id} className={`bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col ${garage.status !== 'available' ? 'opacity-70' : ''}`}>
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={garage.image} 
                      alt={garage.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {garage.status !== 'available' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="px-3 py-1 bg-black/60 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20">Rented</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">{garage.name}</h4>
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {garage.location}
                        </div>
                      </div>
                      <div className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold uppercase text-slate-600">
                        {garage.type}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-6 mt-auto">
                      <div className="text-sm text-slate-600">{garage.size}</div>
                      <div className="font-bold text-emerald-600 text-lg">€{garage.price}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    </div>

                    <button 
                      disabled={garage.status !== 'available'}
                      onClick={() => setApplyingFor({ property: { title: 'Garage Rental', id: 'garage' }, room: { name: garage.name, id: garage.id } })}
                      className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
                        garage.status === 'available'
                          ? 'bg-slate-900 text-white hover:bg-emerald-600'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {garage.status === 'available' ? 'Apply Now' : 'Rented'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Us Section */}
          <div id="about" className="bg-slate-50 py-24 px-4 border-t border-slate-200">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">About LivingLux</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-6">More Than Just a Room</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  Founded with a vision to transform the rental experience in Luxembourg, LivingLux offers premium coliving spaces designed for ambitious young professionals.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  We understand that moving to a new country or city can be challenging. That's why we provide fully furnished, high-end properties where you can feel at home from day one. Our focus is on creating a community where you can connect, relax, and thrive.
                </p>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900">50+</span>
                    <span className="text-sm text-slate-500">Happy Tenants</span>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900">4</span>
                    <span className="text-sm text-slate-500">Prime Locations</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-100 rounded-2xl transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Community" 
                  className="relative rounded-2xl shadow-lg w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Housing Rules Section */}
          <div className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose LivingLux?</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Our core values ensure a seamless and premium living experience.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {CORE_VALUES.map((val, idx) => (
                  <div key={idx} className="bg-rose-50 p-8 rounded-xl border border-rose-100 hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white text-rose-500 rounded-full flex items-center justify-center shadow-sm mb-4">
                      <val.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{val.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-200">
            <ContactInfoSection />
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-12 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-slate-900">LivingLux</span>
              </div>
              <div className="text-slate-500 text-sm">
                © 2024 LivingLux Properties. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}