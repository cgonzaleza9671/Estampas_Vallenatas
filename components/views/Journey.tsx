import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { ComposableMap, Geographies, Geography, Line, Marker } from 'react-simple-maps';
import { geoInterpolate } from 'd3-geo';
import { X, ChevronRight, MapPin } from 'lucide-react';
import { reachData, reachStats, ReachCountry } from '../../src/data/reachData.ts';

// Import Generated Images
import globeImg from '../../src/assets/images/globe_avatar_1786635466243.jpg';
import pinImg from '../../src/assets/images/pin_avatar_1786635476432.jpg';
import peopleImg from '../../src/assets/images/people_avatar_1786635486441.jpg';

import { createPortal } from 'react-dom';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const mapToEsName = (geoName: string) => {
  const map: Record<string, string> = {
    "United States of America": "Estados Unidos",
    "Spain": "España",
    "Germany": "Alemania",
    "Canada": "Canadá",
    "Mexico": "México",
    "Netherlands": "Países Bajos",
    "Sweden": "Suecia",
    "Switzerland": "Suiza",
    "United Kingdom": "Reino Unido",
    "Ireland": "Irlanda",
    "Panama": "Panamá",
    "Poland": "Polonia",
    "Russian Federation": "Rusia",
    "Russia": "Rusia",
    "France": "Francia",
    "United States": "Estados Unidos",
    "Dominican Rep.": "República Dominicana",
    "New Zealand": "Nueva Zelanda",
    "Italy": "Italia"
  };
  return map[geoName] || geoName;
};

const COLOMBIA_COORDS: [number, number] = [-73.2452, 10.4631]; // Valledupar, Colombia
const ANIMATION_ROUTES: [number, number][] = [
  [-3.7038, 40.4168], // Madrid, Spain
  [-80.1918, 25.7617], // Miami, US
  [-58.3816, -34.6037], // Buenos Aires, Argentina
  [151.2093, -33.8688], // Sydney, Australia
  [116.4074, 39.9042], // Beijing, China
  [-99.1332, 19.4326], // CDMX, Mexico
  [-74.0060, 40.7128], // New York, US
  [-0.1276, 51.5072], // London, UK
  [2.3522, 48.8566], // Paris, France
  [12.4964, 41.9028], // Rome, Italy
  [77.2090, 28.6139], // New Delhi, India
  [174.7762, -41.2865], // Wellington, New Zealand
  [-73.5673, 45.5017], // Montreal, Canada
  [-70.6693, -33.4489] // Santiago, Chile
];

const AccordionIcon = () => (
  <g transform="translate(-12, -12)">
    {/* Left Keyboard */}
    <rect x="3" y="6" width="6" height="12" rx="1.5" fill="#D4AF37" />
    <line x1="6" y1="7" x2="6" y2="17" stroke="#1A365D" strokeWidth="0.75" />
    
    {/* Right Buttons */}
    <rect x="15" y="6" width="6" height="12" rx="1.5" fill="#D4AF37" />
    <circle cx="18" cy="9.5" r="1" fill="#1A365D" />
    <circle cx="18" cy="12" r="1" fill="#1A365D" />
    <circle cx="18" cy="14.5" r="1" fill="#1A365D" />
    
    {/* Bellows */}
    <path d="M9 8 l 6 -1 m -6 3 l 6 -1 m -6 3 l 6 -1 m -6 3 l 6 -1" stroke="#B02A2A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </g>
);

const TravelingAccordion = () => {
  const [activeRouteIdx, setActiveRouteIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start: number;
    const duration = 4000; // 4 seconds per trip
    let rafId: number;
    
    const animate = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);
      
      // Smooth easing (easeInOutCubic)
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(easeT);
      
      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Wait briefly at destination, then pick next route
        setTimeout(() => {
          setActiveRouteIdx((prev) => (prev + 1) % ANIMATION_ROUTES.length);
          setProgress(0);
        }, 800);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [activeRouteIdx]);

  const currentDestination = ANIMATION_ROUTES[activeRouteIdx];
  const interpolate = geoInterpolate(COLOMBIA_COORDS, currentDestination);
  const currentCoords = interpolate(progress) as [number, number];

  if (progress <= 0 || progress >= 1) return null;

  return (
    <Marker coordinates={currentCoords} style={{ pointerEvents: 'none' }}>
      <AccordionIcon />
    </Marker>
  );
};

const Journey: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<ReachCountry | null>(null);

  return (
    <div className="min-h-screen bg-vallenato-beige animate-fade-in-up pb-32">
      {/* Hero Section */}
      <div className="bg-vallenato-blue rounded-b-[1.5rem] md:rounded-b-[2rem] pt-20 pb-14 px-6 relative z-10 shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">El viaje de un legado</h1>
          <p className="text-vallenato-cream/80 text-sm md:text-base font-sans max-w-2xl mx-auto">
            Desde el corazón de Colombia, Estampas Vallenatas lleva la memoria de nuestros juglares a cientos de rincones del mundo, conectando corazones a través de la música.
          </p>
          
          <div className="pt-2">
            <p className="text-vallenato-mustard font-serif italic text-base md:text-lg font-light">
              Estampas Vallenatas, el museo digital del folclor Vallenato ha llegado a:
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid (Numerical Cards) */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-museum border-b-4 border-vallenato-mustard flex flex-col items-center text-center">
            <img src={globeImg} alt="Globo" className="w-24 h-24 rounded-full object-cover mb-4 shadow-md border-4 border-white" />
            <div className="text-4xl font-black text-vallenato-blue tracking-tighter">
              <CountUp end={reachStats.totalCountries} duration={2.5} />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Países</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-museum border-b-4 border-vallenato-red flex flex-col items-center text-center">
            <img src={pinImg} alt="Pin" className="w-24 h-24 rounded-full object-cover mb-4 shadow-md border-4 border-white" />
            <div className="text-4xl font-black text-vallenato-blue tracking-tighter">
              <CountUp end={reachStats.totalCities} duration={2.5} />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Ciudades</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-museum border-b-4 border-vallenato-blue flex flex-col items-center text-center">
            <img src={peopleImg} alt="Visitantes" className="w-24 h-24 rounded-full object-cover mb-4 shadow-md border-4 border-white" />
            <div className="text-4xl font-black text-vallenato-blue tracking-tighter">
              +<CountUp end={reachStats.totalVisitors} duration={2.5} separator="," />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Visitantes Globales</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-[100rem] mx-auto px-4 md:px-8 mt-20">
        <div className="bg-white rounded-[3rem] p-4 md:p-8 shadow-museum border border-vallenato-mustard/10 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-vallenato-blue">El Mundo Vallenato</h2>
            <p className="text-gray-400 font-sans text-sm mt-2">Explora los países donde se escucha nuestra historia</p>
          </div>
          
          <div className="w-full aspect-[4/3] md:aspect-[2.5/1] bg-gray-50 rounded-[2rem] overflow-hidden">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130, center: [0, 35] }} width={1200} height={480} className="w-full h-full pointer-events-auto">
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const geoEsName = mapToEsName(geo.properties.name);
                    const countryData = reachData.find(c => c.name === geoEsName);
                    const isVisited = !!countryData;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          if (isVisited) setSelectedCountry(countryData);
                        }}
                        style={{
                          default: {
                            fill: isVisited ? '#D4AF37' : '#E5E7EB',
                            outline: 'none',
                            stroke: '#FFFFFF',
                            strokeWidth: 0.5,
                            transition: 'all 250ms'
                          },
                          hover: {
                            fill: isVisited ? '#B02A2A' : '#D1D5DB',
                            outline: 'none',
                            cursor: isVisited ? 'pointer' : 'default'
                          },
                          pressed: {
                            fill: isVisited ? '#1A365D' : '#D1D5DB',
                            outline: 'none'
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Background Tracks */}
              {ANIMATION_ROUTES.map((route, idx) => (
                <Line
                  key={idx}
                  from={COLOMBIA_COORDS}
                  to={route}
                  stroke="#D4AF37"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  style={{ opacity: 0.25, pointerEvents: 'none' }}
                />
              ))}

              {/* Origin Glowing Marker */}
              <Marker coordinates={COLOMBIA_COORDS} style={{ pointerEvents: 'none' }}>
                <circle r={8} fill="#B02A2A" opacity={0.3} className="animate-ping" />
                <circle r={3} fill="#B02A2A" />
              </Marker>

              {/* Traveling Accordion */}
              <TravelingAccordion />
            </ComposableMap>
          </div>
        </div>
      </div>

      {/* Country Directory */}
      <div className="max-w-6xl mx-auto px-6 mt-20">
        <h2 className="text-3xl font-serif font-bold text-vallenato-blue text-center mb-10">Directorio por País</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reachData.map(country => (
            <div 
              key={country.isoCode}
              onClick={() => setSelectedCountry(country)}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-vallenato-mustard/30 overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
                    <img 
                      src={`https://flagcdn.com/${country.isoCode}.svg`} 
                      alt={`Bandera de ${country.name}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-vallenato-blue text-lg leading-tight">{country.name}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{country.cities.length} {country.cities.length === 1 ? 'Ciudad' : 'Ciudades'}</p>
                  </div>
                </div>
                <ChevronRight className="text-vallenato-mustard opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Epilogue Section */}
      <div className="max-w-4xl mx-auto px-6 mt-32 mb-10 text-center">
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="h-0.5 w-16 bg-vallenato-mustard rounded-full"></div>
          
          <div className="space-y-8">
            <h3 className="text-2xl md:text-4xl font-serif text-vallenato-blue leading-relaxed font-light italic">
              Cada nueva ciudad representa una voz más que mantiene vivo el legado del vallenato.
            </h3>
            
            <p className="text-lg md:text-xl font-sans text-gray-500 leading-loose max-w-3xl mx-auto">
              El vallenato nació en una región del Caribe colombiano, pero sus historias ya encuentran eco en ciudades de todo el mundo.
            </p>
            
            <p className="text-lg md:text-xl font-sans text-gray-500 leading-loose max-w-3xl mx-auto">
              Cada lectura, cada canción y cada relato hacen que este patrimonio cultural continúe viajando de generación en generación.
            </p>
          </div>
          
          <div className="h-0.5 w-16 bg-vallenato-red/60 rounded-full mt-4"></div>
        </div>
      </div>

      {/* Map Modal */}
      {selectedCountry && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-32 md:pb-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-vallenato-blue/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCountry(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 flex flex-col max-h-[85vh] animate-scale-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
                  <img 
                    src={`https://flagcdn.com/${selectedCountry.isoCode}.svg`} 
                    alt={`Bandera de ${selectedCountry.name}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-vallenato-blue text-xl">{selectedCountry.name}</h3>
                  <p className="text-vallenato-red text-xs font-bold uppercase tracking-widest">{selectedCountry.cities.length} {selectedCountry.cities.length === 1 ? 'Ciudad' : 'Ciudades'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCountry(null)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-vallenato-red hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable City List */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50 rounded-b-[2rem]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCountry.cities.map((city, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-vallenato-mustard/30 transition-colors">
                    <MapPin size={16} className="text-vallenato-mustard shrink-0" />
                    <span className="text-sm font-medium text-gray-700 leading-tight break-words flex-1">{city.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Journey;
