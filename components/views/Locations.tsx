import React from 'react';
import { MapPin, Ticket, Music2, Store } from 'lucide-react';

const Locations: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-vallenato-beige text-center px-4 animate-fade-in-up">
      <div className="bg-vallenato-cream p-12 rounded-[3rem] shadow-museum border border-vallenato-mustard/20 max-w-2xl w-full relative overflow-hidden">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-vallenato-blue via-vallenato-red to-vallenato-mustard"></div>

        {/* Icons Composition */}
        <div className="flex justify-center items-center gap-4 mb-8">
           <div className="bg-vallenato-blue p-5 rounded-full shadow-lg text-vallenato-mustard transform -rotate-6 z-10">
              <Ticket size={32} />
           </div>
           <div className="bg-white p-6 rounded-full shadow-xl text-vallenato-red border-2 border-vallenato-beige z-20 -mx-4 -mt-4">
              <MapPin size={40} />
           </div>
           <div className="bg-vallenato-blue p-5 rounded-full shadow-lg text-vallenato-mustard transform rotate-6 z-10">
              <Store size={32} />
           </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-vallenato-blue mb-6 font-bold">
          El Vallenato cerca a ti
        </h1>
        
        <p className="text-gray-600 font-sans text-lg mb-8 leading-relaxed px-4">
          Estamos afinando los últimos detalles para conectarte con el folclor en vivo. 
          <br className="hidden md:block" />
          Muy pronto esta sección te permitirá geolocalizar <strong className="text-vallenato-red">conciertos, eventos y tiendas de música</strong> especializadas cerca de tu ubicación.
        </p>
        
        <div className="inline-flex items-center gap-3 bg-vallenato-mustard/10 text-vallenato-blue px-8 py-3 rounded-full border border-vallenato-mustard/50 shadow-sm animate-pulse">
          <Music2 size={16} className="text-vallenato-red" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Sección en Construcción</span>
        </div>
      </div>
    </div>
  );
};

export default Locations;