import React, { useState, useEffect, useCallback } from 'react';
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import initFirebase from './firebase';
import { 
  Home, MapPin, Bed, Bath, Trees, Calendar, Send, 
  CheckCircle, Briefcase, User, Mail, Phone, Shield, 
  ChevronRight, ChevronLeft, ArrowLeft, Star, LayoutGrid, X, Camera, ZoomIn,
  Moon, Trash2, CigaretteOff, HeartHandshake, Euro, FileText, Clock, Bus, Train
} from 'lucide-react';

// --- Firebase Initialization (Vite env) ---
const firebase = initFirebase();
const auth = firebase ? firebase.auth : null;
const db = firebase ? firebase.db : null;
const appId = import.meta.env.VITE_APP_ID || 'default-app-id';

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
  } catch (e) {
    // Fallback
  }

  return {
    count: availableRooms.length,
    text: `${availableRooms.length} Room${availableRooms.length > 1 ? 's' : ''} from ${dateDisplay}`,
    color: 'text-emerald-600'
  };
};

// --- Housing Rules Constant ---
const HOUSE_RULES = [
  { icon: HeartHandshake, title: "Community First", desc: "Respect your housemates and treat everyone with kindness." },
  { icon: Moon, title: "Quiet Hours", desc: "Please keep noise to a minimum between 10 PM and 7 AM." },
  { icon: Trash2, title: "Cleanliness", desc: "Clean up after cooking. Weekly professional cleaning covers common areas." },
  { icon: CigaretteOff, title: "No Smoking", desc: "Smoking is strictly prohibited inside all properties." },
];

// --- Mock Data for Properties ---
const PROPERTIES = [
  // 1. Limpertsberg House
  {
    id: 'limp-house',
    title: 'Maison de Maître Limpertsberg',
    location: 'Limpertsberg, Luxembourg',
    type: 'House',
    tags: ['High-end', '3 Floors', 'Prestige'],
    description: 'An expansive 3-story high-end house offering the ultimate coliving experience. Generous common areas and premium privacy.',
    locationHighlights: [
      { icon: Bus, text: "2 min walk to Tram stop Glacis" },
      { icon: Briefcase, text: "10 min walk to Kirchberg Financial District" },
      { icon: Clock, text: "5 min to City Center by Tram" },
      { icon: Trees, text: "Next to Parc Tony Neuman" }
    ],
    amenities: ['3 Floors', 'Grand Kitchen', 'Home Cinema', 'Gym Area', 'Wine Cellar', 'Weekly Maid'],
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
    location: 'Dommeldange, Luxembourg',
    type: 'House',
    tags: ['8 Rooms', 'Forest View', 'Spacious'],
    description: 'A magnificent 3-story Maison de Maître located in the quiet and green area of Dommeldange. Close to the train station and Kirchberg, this property features 8 fully renovated rooms, a large common area, and beautiful forest views.',
    locationHighlights: [
      { icon: Train, text: "5 min walk to Dommeldange Train Station" },
      { icon: Bus, text: "Direct bus to Kirchberg (10 min)" },
      { icon: Trees, text: "Direct access to Grengewald forest trails" },
      { icon: Clock, text: "8 min to Clausen nightlife" }
    ],
    amenities: ['8 Bedrooms', 'Forest View', 'Large Kitchen', '3 Bathrooms', 'High-speed Internet', 'Laundry Room'],
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
        `https://images.unsplash.com/photo-${1595526114035 + i + 10}?auto=format&fit=crop&q=80&w=600` // Example 2nd image
      ]
    }))
  },
  // 3. Limpertsberg Apartment
  {
    id: 'limp-apt',
    title: 'Limpertsberg Skyline Flat',
    location: 'Limpertsberg, Luxembourg',
    type: 'Apartment',
    tags: ['Bright', 'City View', 'Central'],
    description: 'A bright and spacious 5-bedroom apartment in the heart of Limpertsberg. Walking distance to Glacis and financial district.',
    locationHighlights: [
      { icon: Briefcase, text: "Walking distance to Big 4 firms" },
      { icon: Bus, text: "1 min to Bus stop" },
      { icon: Clock, text: "15 min walk to City Center" },
      { icon: Trees, text: "Close to Parc de Merl" }
    ],
    amenities: ['2 Balconies', 'Spacious Living Room', '2 Bathrooms', 'Laundry Room', 'Smart TV'],
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
    location: 'Bertrange, Luxembourg',
    type: 'Apartment',
    tags: ['High-end', 'Private Garden', 'Peaceful'],
    description: 'A luxurious apartment perfect for those seeking nature near the city. Features a stunning private garden and high-end finishes.',
    locationHighlights: [
      { icon: Bus, text: "Direct bus to City Center (20 min)" },
      { icon: Bus, text: "15 min to Cloche d'Or by bus" },
      { icon: Trees, text: "Private garden access" },
      { icon: Clock, text: "5 min to City Concorde Shopping Mall" }
    ],
    amenities: ['Private Garden', 'Large Balcony', 'High-end fully equipped Kitchen', 'Underground Parking'],
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

const PropertyHero = ({ property, onBack, onImageClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || [property.image]; 

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div 
      className="relative h-[50vh] w-full group select-none cursor-zoom-in overflow-hidden" 
      onClick={() => onImageClick(images, currentImageIndex)}
    >
      <div className="absolute inset-0 bg-slate-900">
        <img 
          src={images[currentImageIndex]} 
          alt={`${property.title} view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          key={currentImageIndex} 
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); onBack(); }}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors pointer-events-auto"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Properties
          </button>
          <div className="flex flex-wrap gap-3 mb-4">
            {property.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-100 text-xs font-semibold uppercase tracking-wider rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{property.title}</h1>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-5 h-5 text-emerald-400" />
            {property.location}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8 flex gap-2 z-10">
        <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
          <ZoomIn className="w-3 h-3" />
          Click to expand
        </div>
        {images.length > 1 && (
          <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
            <Camera className="w-3 h-3" />
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = ({ user, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
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
                    <Euro className="w-4 h-4" /> Net: €{app.netSalary}
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

const ApplicationModal = ({ property, room, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    occupation: '',
    employer: '',
    contractType: 'CDI',
    grossSalary: '',
    netSalary: '',
    moveInDate: '',
    duration: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'applications'), {
        ...formData,
        propertyName: property.title,
        roomName: room.name,
        propertyId: property.id,
        roomId: room.id,
        createdAt: serverTimestamp()
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Apply for Room</h3>
            <p className="text-sm text-slate-500">{property.title} • {room.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personal Info */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500">Full Name</label>
            <input required type="text" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
              value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
              <input required type="email" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
              <input required type="tel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Occupation</label>
              <input required type="text" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Employer</label>
              <input required type="text" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.employer} onChange={e => setFormData({...formData, employer: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500">Contract Type</label>
            <select required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.contractType} onChange={e => setFormData({...formData, contractType: e.target.value})}>
              <option value="CDI">CDI (Permanent)</option>
              <option value="CDD">CDD (Fixed-term)</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Financial Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Gross Monthly Salary (€)</label>
              <input required type="number" step="100" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.grossSalary} onChange={e => setFormData({...formData, grossSalary: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Net Monthly Salary (€)</label>
              <input required type="number" step="100" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.netSalary} onChange={e => setFormData({...formData, netSalary: e.target.value})} />
            </div>
          </div>

          {/* Rental Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Move-in Date</label>
              <input required type="date" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="Preferably 1st or 16th"
                value={formData.moveInDate} onChange={e => setFormData({...formData, moveInDate: e.target.value})} />
              <p className="text-[10px] text-slate-400">Preferably 1st or 16th of the month</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Duration</label>
              <input required type="text" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="e.g. 6 months, 1 year"
                value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500">Message (Optional)</label>
            <textarea className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
              placeholder="Tell us a bit about yourself..."
              value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-4">
            {submitting ? 'Sending...' : (
              <>
                <Send className="w-5 h-5" />
                Submit Application
              </>
            )}
          </button>
        </form>
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

export default function App() {
  const [user, setUser] = useState(null);
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
        const token = import.meta.env.VITE_INITIAL_AUTH_TOKEN;
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

  const handleApplySuccess = () => {
    setApplyingFor(null);
    setNotification({ type: 'success', message: 'Application received! We will contact you shortly.' });
    setTimeout(() => setNotification(null), 5000);
  };

  const openLightbox = (images, index = 0) => {
    setLightbox({ isOpen: true, images, index });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- Notification Toast --- */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-bounce-in">
          <CheckCircle className="w-5 h-5" />
          {notification.message}
        </div>
      )}

      {/* --- Modals --- */}
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
            onClick={() => setSelectedProperty(null)}
          >
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100" 
              alt="LivingLux Logo" 
              className="h-14 w-14 object-cover rounded-lg"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">LivingLux</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#properties" className="text-sm font-medium hover:text-emerald-600 transition-colors">Properties</a>
            <a href="#about" className="text-sm font-medium hover:text-emerald-600 transition-colors">About Us</a>
          </nav>
        </div>
      </header>

      {selectedProperty ? (
        // --- Single Property View ---
        <main className="animate-fade-in">
          <PropertyHero 
            property={selectedProperty} 
            onBack={() => setSelectedProperty(null)}
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

                <section>
                  <h2 className="text-2xl font-bold mb-6 text-slate-900">Amenities & Features</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProperty.amenities.map(item => (
                      <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

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
                   <h2 className="text-2xl font-bold mb-6 text-slate-900">House Rules</h2>
                   <div className="grid sm:grid-cols-2 gap-6">
                    {HOUSE_RULES.map((rule, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex-shrink-0 w-10 h-10 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                          <rule.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{rule.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{rule.desc}</p>
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
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                Curated residences in Bertrange and Limpertsberg designed for young professionals. High-end amenities, great communities, flexible terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                <a href="#properties" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/50">
                  View Properties
                </a>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div id="properties" className="max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Residences</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Each property is unique, fully furnished, and ready for you to move in. Click on a property to see available rooms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROPERTIES.map((prop, idx) => {
                const availability = getAvailabilitySummary(prop.rooms);
                
                return (
                  <div 
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-200"
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
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-2">
                        <MapPin className="w-4 h-4" />
                        {prop.location}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                        {prop.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {prop.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Availability</div>
                          <div className={`text-sm font-bold flex items-center gap-2 ${availability.color}`}>
                            {availability.count > 0 && <Calendar className="w-4 h-4" />}
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

          {/* Value Props */}
          <div className="bg-slate-900 text-white py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
                    <Trees className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Prime Locations</h3>
                  <p className="text-slate-400">Whether you prefer the garden peace of Bertrange or the city vibes of Limpertsberg.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Young Professionals</h3>
                  <p className="text-slate-400">Curated community of like-minded individuals working in Lux's top sectors.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">All-Inclusive Living</h3>
                  <p className="text-slate-400">High-end furnishings, internet, and cleaning services included in many options.</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Us Section */}
          <div id="about" className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-200">
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
                    <span className="text-3xl font-bold text-slate-900">3</span>
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
          <div className="bg-slate-50 py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">House Rules & Values</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  To ensure a harmonious living environment for everyone, we ask all our tenants to respect a few simple guidelines.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {HOUSE_RULES.map((rule, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <rule.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{rule.title}</h3>
                    <p className="text-slate-500 text-sm">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>
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