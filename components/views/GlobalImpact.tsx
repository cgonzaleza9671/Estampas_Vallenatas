
import React, { useState, useMemo } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Users, MapPin, ArrowRight, Info, ExternalLink, Star } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Datos extraídos de los reportes (excluyendo "not set")
const CITY_DATA = [
  { name: "Bogotá", users: 333, coordinates: [-74.0721, 4.7110] },
  { name: "Valledupar", users: 73, coordinates: [-73.2532, 10.4631] },
  { name: "Barranquilla", users: 61, coordinates: [-74.7813, 10.9685] },
  { name: "Madrid", users: 55, coordinates: [-3.7038, 40.4168] },
  { name: "Flint Hill", users: 49, coordinates: [-78.1014, 38.7665] },
  { name: "Medellín", users: 43, coordinates: [-75.5812, 6.2442] },
  { name: "San José", users: 25, coordinates: [-121.8863, 37.3382] },
  { name: "Phoenix", users: 23, coordinates: [-112.0740, 33.4484] },
  { name: "Ashburn", users: 17, coordinates: [-77.4875, 39.0438] },
  { name: "Cali", users: 16, coordinates: [-76.5320, 3.4516] },
  { name: "Villavicencio", users: 13, coordinates: [-73.6267, 4.1420] },
  { name: "Cúcuta", users: 12, coordinates: [-72.5078, 7.8939] },
  { name: "Arjona", users: 9, coordinates: [-75.3444, 10.2544] },
  { name: "Manizales", users: 9, coordinates: [-75.5174, 5.0689] },
  { name: "Miami", users: 7, coordinates: [-80.1918, 25.7617] },
  { name: "Bello", users: 6, coordinates: [-75.5579, 6.3373] },
  { name: "Chía", users: 6, coordinates: [-74.0583, 4.8619] },
  { name: "Barcelona", users: 4, coordinates: [2.1734, 41.3851] },
  { name: "Montería", users: 4, coordinates: [-75.8814, 8.7479] },
  { name: "Murcia", users: 4, coordinates: [-1.1307, 37.9922] },
  { name: "Pasto", users: 4, coordinates: [-77.2811, 1.2136] },
  { name: "Valencia", users: 3, coordinates: [-0.3763, 39.4699] },
  { name: "Bucaramanga", users: 3, coordinates: [-73.1198, 7.1254] },
];

const COUNTRY_DATA = [
  { name: "Colombia", users: 566 },
  { name: "Estados Unidos", users: 170 },
  { name: "España", users: 61 },
  { name: "Alemania", users: 7 },
  { name: "Suecia", users: 3 },
  { name: "Argentina", users: 2 },
  { name: "Canadá", users: 2 },
  { name: "China", users: 2 },
  { name: "México", users: 2 },
  { name: "Suiza", users: 2 },
  { name: "Reino Unido", users: 2 },
  { name: "Venezuela", users: 1 },
  { name: "Chile", users: 1 },
  { name: "Australia", users: 1 },
];

const GlobalImpact: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const totalUsers = useMemo(() => COUNTRY_DATA.reduce((acc, curr) => acc + curr.users, 0), []);

  return (
    <div className="min-h-screen bg-vallenato-dark text-white animate-fade-in pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header de la sección */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-vallenato-mustard/20 border border-vallenato-mustard/30 px-4 py-1.5 rounded-full mb-6"
          >
            <Globe size={14} className="text-vallenato-mustard animate-pulse" />
            <span className="text-vallenato-mustard text-[10px] font-black uppercase tracking-[0.25em]">Impacto Global</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight"
          >
            Donde el Vallenato <span className="text-vallenato-mustard italic">Resuena</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-serif italic text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Desde el corazón de Valledupar hasta los rincones más lejanos del mundo. 
            Nuestra audiencia crece, unida por el sentimiento de un acordeón.
          </motion.p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {[
            { label: "Usuarios Totales", value: totalUsers, icon: Users, color: "text-vallenato-mustard" },
            { label: "Países Conectados", value: COUNTRY_DATA.length, icon: Globe, color: "text-vallenato-red" },
            { label: "Ciudades Activas", value: CITY_DATA.length, icon: MapPin, color: "text-blue-400" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-white/10 transition-all duration-500"
            >
              <div className={`p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-3xl md:text-4xl font-serif font-bold mb-1">{stat.value}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Contenedor del Mapa */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative bg-[#001a33]/60 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] mb-16"
        >
          <div className="absolute top-8 left-8 z-10">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-vallenato-mustard rounded-full animate-ping"></div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Mapa de Audiencia en Tiempo Real</span>
            </div>
          </div>

          <div className="h-[500px] md:h-[700px] w-full cursor-grab active:cursor-grabbing">
            <ComposableMap
              projectionConfig={{
                scale: 200,
                center: [-40, 20]
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#1a2a3a"
                        stroke="#2a3a4a"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#243444", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {CITY_DATA.map(({ name, coordinates, users }) => (
                  <Marker key={name} coordinates={coordinates as [number, number]}>
                    <motion.circle
                      initial={{ r: 0 }}
                      animate={{ r: Math.max(3, Math.min(15, Math.sqrt(users) * 0.8)) }}
                      fill="#EAAA00"
                      stroke="#FFFFFF"
                      strokeWidth={1}
                      fillOpacity={0.6}
                      className="cursor-pointer hover:fill-vallenato-red transition-colors duration-300"
                      onMouseEnter={() => setTooltipContent(`${name}: ${users} usuarios`)}
                      onMouseLeave={() => setTooltipContent(null)}
                      onClick={() => setSelectedMarker({ name, users })}
                    />
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Tooltip Flotante */}
          <AnimatePresence>
            {tooltipContent && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-vallenato-mustard text-vallenato-blue px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl pointer-events-none z-20"
              >
                {tooltipContent}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leyenda del Mapa */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-white/40">
              <div className="w-2 h-2 rounded-full bg-vallenato-mustard"></div>
              <span>Concentración de Usuarios</span>
            </div>
          </div>
        </motion.div>

        {/* Listado Detallado (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Top Países */}
          <div className="lg:col-span-1 bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif font-bold">Top Países</h3>
              <Globe size={18} className="text-vallenato-mustard" />
            </div>
            <div className="space-y-4">
              {COUNTRY_DATA.slice(0, 5).map((country, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/20">0{i+1}</span>
                    <span className="text-sm font-medium group-hover:text-vallenato-mustard transition-colors">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-vallenato-mustard" style={{ width: `${(country.users / COUNTRY_DATA[0].users) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-vallenato-mustard">{country.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Ciudades */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif font-bold">Ciudades con más Sentimiento</h3>
              <MapPin size={18} className="text-blue-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {CITY_DATA.slice(0, 10).map((city, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:bg-vallenato-mustard group-hover:text-vallenato-blue transition-all">
                      {i+1}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none mb-1">{city.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Impacto Local</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-serif font-bold text-vallenato-mustard">{city.users}</p>
                    <p className="text-[8px] font-bold uppercase tracking-tighter text-white/20">Usuarios</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer de la sección */}
        <div className="mt-24 text-center">
          <div className="w-16 h-0.5 bg-vallenato-mustard/30 mx-auto mb-8"></div>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Datos procesados desde Google Analytics</p>
          <p className="text-white/20 text-[9px] font-medium max-w-md mx-auto leading-relaxed">
            Esta visualización representa la distribución geográfica de nuestra audiencia. 
            Cada punto es un testimonio de la universalidad de nuestra cultura.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalImpact;
