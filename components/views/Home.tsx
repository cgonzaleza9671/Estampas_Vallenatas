import React, { useEffect, useState } from 'react';
import { ViewState, AudioItem, VideoItem } from '../../types';
import { FESTIVAL_DATE, HERO_GALLERY } from '../../constants';
import Button from '../Button';
import MediaModal from '../MediaModal';
import { Play, Sparkles, ExternalLink, ArrowRight, Music, Disc, Youtube, Globe, User, ListMusic } from 'lucide-react';
import { fetchLatestAudio, fetchRecentAudios } from '../../services/supabaseClient';
import { AccordionPlayIcon, YouTubeLogo, SpotifyLogo, AppleMusicLogo } from '../CustomIcons';

interface HomeProps {
  setViewState: (view: ViewState) => void;
}

interface TimeLeft {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Home: React.FC<HomeProps> = ({ setViewState }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [latestAudio, setLatestAudio] = useState<AudioItem | null>(null);
  const [recentAudios, setRecentAudios] = useState<AudioItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<AudioItem | VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(true);

  // Carousel Logic - 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_GALLERY.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Data Fetching
  useEffect(() => {
    const loadData = async () => {
      setLoadingLatest(true);
      try {
        const latest = await fetchLatestAudio();
        setLatestAudio(latest);
        const recent = await fetchRecentAudios(3);
        setRecentAudios(recent);
      } catch (error) {
        console.error("Home fetch error", error);
      } finally {
        setLoadingLatest(false);
      }
    };
    loadData();
  }, []);

  // Countdown Logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +FESTIVAL_DATE - +new Date();
      let timeLeft: TimeLeft = { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        // Simplified breakdown for visual impact
        const totalSeconds = Math.floor(difference / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        
        // Approximations for UI display
        timeLeft = {
          months: Math.floor(totalDays / 30),
          weeks: Math.floor((totalDays % 30) / 7),
          days: Math.floor(totalDays % 7),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openMedia = (item: AudioItem | null) => {
    if (item) {
      setSelectedMedia(item);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="animate-fade-in-up">
      
      {/* 1. Feature: Banner Novedad Exclusiva */}
      {!loadingLatest && latestAudio && (
        <div className="bg-vallenato-blue text-white relative overflow-hidden border-b border-white/10">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between relative z-10 gap-3">
              <div className="flex items-center gap-3">
                 <div className="bg-vallenato-mustard p-1.5 rounded-full animate-pulse">
                    <Sparkles size={16} className="text-vallenato-blue" />
                 </div>
                 <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-vallenato-mustard">Novedad Exclusiva:</span>
                    <span className="font-serif italic text-lg line-clamp-1">"{latestAudio.titulo}" - {latestAudio.autor}</span>
                 </div>
              </div>
              <button 
                onClick={() => openMedia(latestAudio)}
                className="bg-white/10 hover:bg-white text-white hover:text-vallenato-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border border-white/20"
              >
                Escuchar <Play size={12} fill="currentColor" />
              </button>
           </div>
        </div>
      )}

      {/* 2. Sección Hero (Carrusel Visual) */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        {/* Background Gallery */}
        {HERO_GALLERY.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url("${img}")` }}
          />
        ))}

        {/* Overlay: Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/90 z-10"></div>

        <div className="relative z-20 text-center max-w-5xl px-4 flex flex-col items-center">
          <span className="text-white/80 font-sans font-light tracking-[0.3em] uppercase mb-4 text-sm md:text-base animate-fade-in-down">
            Estampas Vallenatas
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 drop-shadow-2xl leading-[1.1]">
            <span className="text-vallenato-mustard italic block text-3xl md:text-5xl mb-3">El Museo Digital del</span>
            <span className="text-vallenato-red">Folclor Vallenato</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-2xl font-light mb-12 max-w-3xl mx-auto border-l-2 border-vallenato-mustard pl-6 text-left">
            Un archivo que preserva la riqueza musical de los grandes juglares de Colombia
          </p>
          
          {/* 3. Feature: Countdown */}
          <div className="mt-8 w-full max-w-4xl flex flex-col items-center">
             <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl w-full">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className="flex flex-col items-center justify-center bg-black/20 rounded-xl py-3 border border-white/5">
                     <span className="text-2xl md:text-3xl font-mono font-bold text-vallenato-mustard mb-1">
                       {String(value).padStart(2, '0')}
                     </span>
                     <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-widest font-bold">
                       {label === 'months' ? 'Meses' : 
                        label === 'weeks' ? 'Sem' :
                        label === 'days' ? 'Días' :
                        label === 'hours' ? 'Hrs' :
                        label === 'minutes' ? 'Min' : 'Seg'}
                     </span>
                  </div>
                ))}
             </div>
             <p className="text-white/50 text-xs mt-3 uppercase tracking-widest font-sans mb-4">
               Cuenta regresiva para el 59° Festival de la Leyenda Vallenata
             </p>

             <a 
               href="https://festivalvallenato.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-vallenato-mustard text-vallenato-blue hover:bg-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest transition-all duration-300 shadow-lg flex items-center gap-2"
             >
               Sitio oficial del Festival <Globe size={16} />
             </a>
          </div>
        </div>
      </section>

      {/* 4. Sección: Estampas Recientes */}
      <section className="py-24 bg-white relative z-10">
         <div className="container mx-auto px-6">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                   <span className="text-vallenato-red font-bold uppercase tracking-widest text-sm">Archivo Reciente</span>
                   <h2 className="text-4xl font-serif text-vallenato-blue mt-2">Últimas Estampas</h2>
                </div>
                <Button variant="outline" onClick={() => setViewState(ViewState.ARCHIVE)} className="group">
                   Ver Archivo Completo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentAudios.map((item) => (
                   <div 
                     key={item.id} 
                     onClick={() => openMedia(item)}
                     className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group hover:shadow-museum transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                   >
                      <div className="p-6 bg-vallenato-beige/30 relative flex-grow">
                         {/* Updated to Custom Icon */}
                         <div className="absolute top-4 right-4 text-vallenato-blue/20 group-hover:text-vallenato-mustard transition-colors">
                            <AccordionPlayIcon className="w-16 h-16" />
                         </div>
                         <h3 className="text-xl font-serif text-vallenato-blue font-bold truncate pr-8 group-hover:text-vallenato-red transition-colors">{item.titulo}</h3>
                         <p className="text-vallenato-red text-sm font-bold uppercase mt-1 flex items-center gap-1">
                           <User size={12} /> {item.autor}
                         </p>
                         <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                           <ListMusic size={12} /> <span className="uppercase tracking-wide font-bold">Acordeón: {item.acordeonero}</span>
                         </div>
                         <p className="text-gray-500 text-xs mt-2 italic line-clamp-2 min-h-[2.5em]">
                            {item.descripcion}
                         </p>
                      </div>
                      
                      {/* Audio Footer - Action Button */}
                      <div className="mt-auto bg-vallenato-cream p-4 border-t border-vallenato-mustard/20 flex items-center justify-between group-hover:bg-vallenato-blue group-hover:text-white transition-colors duration-300">
                         <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                           Reproducir Estampa
                         </span>
                         <div className="bg-white/20 p-2 rounded-full">
                           <Play size={16} fill="currentColor" />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
         </div>
      </section>

      {/* 5. Sección: Parranda Digital */}
      <section className="py-24 bg-vallenato-beige relative border-t border-vallenato-mustard/10">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-vallenato-blue mb-4">Parranda Digital</h2>
              <div className="h-1 w-20 bg-vallenato-red mx-auto"></div>
              <p className="mt-6 text-gray-600 max-w-xl mx-auto font-light">
                Listas de reproducción recomendadas para que lleves lo mejor del Vallenato en tu plataforma preferida
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* YouTube Card */}
               <div className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/10 border-t-8 border-[#FF0000]">
                  <div className="bg-red-50 p-8 flex flex-col items-center relative overflow-hidden">
                     <div className="absolute -right-6 -top-6 text-red-100 opacity-50 transform rotate-12">
                       <Youtube size={120} />
                     </div>
                     {/* Replaced Icon with Image */}
                     <img 
                       src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" 
                       alt="YouTube Logo" 
                       className="h-16 w-auto relative z-10 mb-4 drop-shadow-md"
                     />
                     <h3 className="text-2xl font-bold text-gray-800 relative z-10">YouTube</h3>
                     <p className="text-sm text-gray-500 uppercase tracking-widest relative z-10">Vallenatos clásicos</p>
                  </div>
                  <div className="p-8 text-center">
                     <p className="text-gray-600 mb-6 font-serif italic">"Sumérgete en los temas que perduran en el tiempo"</p>
                     <a href="https://www.youtube.com/watch?app=desktop&v=MC1qqYo2fHk&list=PLGwRpZ4OHjUsyQVLJa0ao0Cz3qc5ri1OR" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-[#FF0000] font-bold uppercase text-xs tracking-widest group-hover:underline">
                        Abrir Canal <YouTubeLogo className="w-5 h-5" />
                     </a>
                  </div>
               </div>

               {/* Spotify Card */}
               <div className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10 border-t-8 border-[#1DB954]">
                  <div className="bg-green-50 p-8 flex flex-col items-center relative overflow-hidden">
                     <div className="absolute -right-6 -top-6 text-green-100 opacity-50 transform rotate-12">
                       <Music size={120} />
                     </div>
                     {/* Replaced Icon with Image */}
                     <img 
                       src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" 
                       alt="Spotify Logo" 
                       className="h-16 w-auto relative z-10 mb-4 drop-shadow-md"
                     />
                     <h3 className="text-2xl font-bold text-gray-800 relative z-10">Spotify</h3>
                     <p className="text-sm text-gray-500 uppercase tracking-widest relative z-10">Clásicos del Vallenato</p>
                  </div>
                  <div className="p-8 text-center">
                     <p className="text-gray-600 mb-6 font-serif italic">"Pasado y presente para parrandear"</p>
                     <a href="https://open.spotify.com/playlist/37i9dQZF1DXbUPnz12C5bA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-[#1DB954] font-bold uppercase text-xs tracking-widest group-hover:underline">
                        Escuchar Playlist <SpotifyLogo className="w-5 h-5" />
                     </a>
                  </div>
               </div>

               {/* Apple Music Card */}
               <div className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-900/10 border-t-8 border-[#FA243C]">
                  <div className="bg-pink-50 p-8 flex flex-col items-center relative overflow-hidden">
                     <div className="absolute -right-6 -top-6 text-pink-100 opacity-50 transform rotate-12">
                       <Disc size={120} />
                     </div>
                     {/* Replaced Icon with Image */}
                     <img 
                       src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg" 
                       alt="Apple Music Logo" 
                       className="h-16 w-auto relative z-10 mb-4 drop-shadow-md"
                     />
                     <h3 className="text-2xl font-bold text-gray-800 relative z-10">Apple Music</h3>
                     <p className="text-sm text-gray-500 uppercase tracking-widest relative z-10">Vallenato Essentials</p>
                  </div>
                  <div className="p-8 text-center">
                     <p className="text-gray-600 mb-6 font-serif italic">"Lo esencial para enamorarse del Vallenato"</p>
                     <a href="https://music.apple.com/us/playlist/vallenato-essentials/pl.4463cdc654a9494f8d933923e91b3a22" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-[#FA243C] font-bold uppercase text-xs tracking-widest group-hover:underline">
                        Abrir Álbum <AppleMusicLogo className="w-5 h-5" />
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </section>
      
      <MediaModal 
        item={selectedMedia} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
};

export default Home;