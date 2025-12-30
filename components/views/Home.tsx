import React, { useEffect, useState } from 'react';
import { ViewState, AudioItem, VideoItem } from '../../types';
import { FESTIVAL_DATE, HERO_GALLERY } from '../../constants';
import Button from '../Button';
import MediaModal from '../MediaModal';
import { Play, Sparkles, ExternalLink, ArrowRight, Music, Disc, Youtube, Globe, User, ListMusic, Video, Calendar } from 'lucide-react';
import { fetchLatestAudio, fetchRecentAudios, fetchRecentVideos } from '../../services/supabaseClient';
import { SombreroVueltiaoIcon, YouTubeLogo, SpotifyLogo, AppleMusicLogo } from '../CustomIcons';

interface HomeProps {
  setViewState: (view: ViewState) => void;
  onNavigateArchive?: (tab: 'audio' | 'video') => void;
}

interface TimeLeft {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Home: React.FC<HomeProps> = ({ setViewState, onNavigateArchive }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [latestAudio, setLatestAudio] = useState<AudioItem | null>(null);
  const [recentAudios, setRecentAudios] = useState<AudioItem[]>([]);
  const [recentVideos, setRecentVideos] = useState<VideoItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<AudioItem | VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

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
      setLoadingData(true);
      try {
        const [latest, audios, videos] = await Promise.all([
          fetchLatestAudio(),
          fetchRecentAudios(3),
          fetchRecentVideos(2)
        ]);
        setLatestAudio(latest);
        setRecentAudios(audios);
        setRecentVideos(videos);
      } catch (error) {
        console.error("Home fetch error", error);
      } finally {
        setLoadingData(false);
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
        const totalSeconds = Math.floor(difference / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        
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

  const openMedia = (item: AudioItem | VideoItem | null) => {
    if (item) {
      setSelectedMedia(item);
      setIsModalOpen(true);
    }
  };

  const goToArchive = (tab: 'audio' | 'video') => {
    if (onNavigateArchive) {
      onNavigateArchive(tab);
    } else {
      setViewState(ViewState.ARCHIVE);
    }
  };

  return (
    <div className="animate-fade-in-up">
      
      {/* 1. Feature: Banner Novedad Exclusiva */}
      {!loadingData && latestAudio && (
        <div className="bg-vallenato-blue text-white relative overflow-hidden border-b border-white/10">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-center relative z-10 gap-4 md:gap-10">
              <div className="flex items-center gap-3">
                 <div className="bg-vallenato-mustard p-1.5 rounded-full animate-pulse flex-shrink-0">
                    <Sparkles size={16} className="text-vallenato-blue" />
                 </div>
                 <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-vallenato-mustard whitespace-nowrap">Novedad Exclusiva:</span>
                    <span className="font-serif italic text-lg line-clamp-1">"{latestAudio.titulo}" - {latestAudio.autor}</span>
                 </div>
              </div>
              <button 
                onClick={() => openMedia(latestAudio)}
                className="bg-white/10 hover:bg-white text-white hover:text-vallenato-blue px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border border-white/20 shadow-lg flex-shrink-0"
              >
                Reproducir <Play size={12} fill="currentColor" />
              </button>
           </div>
        </div>
      )}

      {/* 2. Sección Hero (Carrusel Visual) */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] w-full overflow-hidden flex items-center justify-center pt-12 pb-8 md:pb-12">
        {HERO_GALLERY.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url("${img}")` }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/90 z-10"></div>

        <div className="relative z-20 text-center max-w-5xl px-4 flex flex-col items-center">
          <span className="text-white font-sans font-light tracking-[0.3em] uppercase mb-4 text-sm md:text-base animate-fade-in-down drop-shadow-md">
            Estampas Vallenatas
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 drop-shadow-2xl leading-[1.1]">
            <span className="text-vallenato-mustard italic block text-3xl md:text-5xl mb-3">El Museo Digital del</span>
            <span className="text-vallenato-red">Folclor Vallenato</span>
          </h1>
          <h2 className="text-gray-100 text-lg md:text-2xl font-light mb-12 max-w-3xl mx-auto border-l-2 border-vallenato-mustard pl-6 text-left drop-shadow-lg">
            Un archivo que preserva la riqueza musical de los grandes juglares de Colombia
          </h2>
          
          <div className="mt-4 w-full max-w-4xl flex flex-col items-center">
             <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl w-full">
                {Object.entries(timeLeft).map(([label, value]) => {
                  const isHighlighted = label === 'seconds' || label === 'minutes';
                  return (
                    <div 
                      key={label} 
                      className={`flex flex-col items-center justify-center bg-black/30 rounded-xl py-3 border transition-all duration-300 ${
                        isHighlighted 
                        ? 'border-vallenato-mustard/60 scale-105 shadow-[0_0_15px_rgba(234,170,0,0.3)] bg-vallenato-mustard/5' 
                        : 'border-white/10'
                      }`}
                    >
                       <span className={`text-2xl md:text-3xl font-mono font-bold mb-1 transition-all ${
                         isHighlighted 
                         ? 'text-vallenato-mustard drop-shadow-[0_0_8px_rgba(234,170,0,0.8)] animate-pulse' 
                         : 'text-vallenato-mustard'
                       }`}>
                         {String(value).padStart(2, '0')}
                       </span>
                       <span className={`text-[10px] md:text-xs uppercase tracking-widest font-bold opacity-90 ${
                         isHighlighted ? 'text-vallenato-mustard' : 'text-white'
                       }`}>
                         {label === 'months' ? 'Meses' : 
                          label === 'weeks' ? 'Sem' :
                          label === 'days' ? 'Días' :
                          label === 'hours' ? 'Hrs' :
                          label === 'minutes' ? 'Min' : 'Seg'}
                       </span>
                    </div>
                  );
                })}
             </div>
             <p className="text-white text-xs md:text-sm mt-5 uppercase tracking-widest font-bold font-sans mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
               Cuenta regresiva para el 59° Festival de la Leyenda Vallenata
             </p>

             <a 
               href="https://festivalvallenato.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-vallenato-mustard text-vallenato-blue hover:bg-white px-8 py-3 rounded-full font-bold uppercase text-xs md:text-sm tracking-widest transition-all duration-300 shadow-2xl flex items-center gap-3 border border-vallenato-mustard/20"
             >
               Sitio oficial del Festival <Globe size={18} />
             </a>
          </div>
        </div>
      </section>

      {/* 4. Sección: Estampas Recientes (AUDIOS) */}
      <section className="pt-16 pb-12 bg-white relative z-10">
         <div className="container mx-auto px-6">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
                <div>
                   <span className="text-vallenato-red font-bold uppercase tracking-widest text-sm">Últimas Estampas</span>
                   <h2 className="text-4xl font-serif text-vallenato-blue mt-2">Audios</h2>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:mb-10">
                {recentAudios.map((item) => (
                   <div 
                     key={item.id} 
                     onClick={() => openMedia(item)}
                     className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group hover:shadow-museum transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                   >
                      <div className="p-6 bg-vallenato-beige/30 relative flex-grow">
                         <div className="absolute top-4 right-4 text-vallenato-blue/20 group-hover:text-vallenato-mustard transition-colors">
                            <SombreroVueltiaoIcon className="w-16 h-16" />
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
             
             <div className="flex justify-center">
                <Button variant="outline" onClick={() => goToArchive('audio')} className="group">
                   Ver todos los Audios <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>
         </div>
      </section>

      {/* 5. Sección: Estampas Recientes (VIDEOS) */}
      <section className="pt-12 pb-20 bg-vallenato-cream/50 relative z-10 border-t border-vallenato-mustard/10">
         <div className="container mx-auto px-6">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
                <div>
                   <span className="text-vallenato-red font-bold uppercase tracking-widest text-sm">Últimas Estampas</span>
                   <h2 className="text-4xl font-serif text-vallenato-blue mt-2">Videos</h2>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 md:mb-10">
                {recentVideos.map((item) => (
                   <div 
                     key={item.id} 
                     onClick={() => openMedia(item)}
                     className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group hover:shadow-museum transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                   >
                      <div className="aspect-video relative overflow-hidden bg-black">
                        {item.thumbnail_url ? (
                          <img 
                            src={item.thumbnail_url} 
                            alt={item.titulo} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-vallenato-blue flex items-center justify-center relative">
                             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                             <Video size={48} className="text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/50 group-hover:scale-110 transition-transform">
                              <Play size={24} className="text-white fill-white" />
                           </div>
                        </div>
                      </div>
                      <div className="p-6 flex-grow">
                         <h3 className="text-xl font-serif text-vallenato-blue font-bold mb-2 group-hover:text-vallenato-red transition-colors">
                           {item.titulo}
                         </h3>
                         <div className="flex justify-between items-center">
                            <p className="text-vallenato-mustard text-sm font-bold flex items-center gap-2">
                               <User size={14} /> {item.autor}
                            </p>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                               <Calendar size={12} />
                               <span>{item.anio}</span>
                            </div>
                         </div>
                      </div>
                      <div className="mt-auto bg-vallenato-blue p-4 flex items-center justify-between group-hover:bg-vallenato-red transition-colors duration-300">
                         <span className="text-white text-xs font-bold uppercase tracking-widest">Ver Video</span>
                         <div className="bg-white/20 p-1.5 rounded-full">
                           <Play size={14} className="text-white fill-white" />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="flex justify-center">
                <Button variant="outline" onClick={() => goToArchive('video')} className="group">
                   Ver todos los Videos <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>
         </div>
      </section>

      {/* 6. Sección: Parranda Digital */}
      <section className="py-24 bg-vallenato-beige relative border-t border-vallenato-mustard/10">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-vallenato-blue mb-4">Parranda Digital</h2>
              <div className="h-1 w-20 bg-vallenato-red mx-auto"></div>
              <p className="mt-6 text-gray-600 max-w-xl mx-auto font-light">
                Listas de reproducción <span className="font-bold text-vallenato-red">recomendadas</span> para que lleves lo mejor del Vallenato en tu <span className="font-bold text-vallenato-blue">plataforma preferida</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* YouTube Card */}
               <div className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/10 border-t-8 border-[#FF0000]">
                  <div className="bg-red-50 p-8 flex flex-col items-center relative overflow-hidden">
                     <div className="absolute -right-6 -top-6 text-red-100 opacity-50 transform rotate-12">
                       <Youtube size={120} />
                     </div>
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
                     <img 
                       src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" 
                       alt="Spotify Logo" 
                       className="h-16 w-auto relative z-10 mb-4 drop-shadow-md"
                     />
                     <h3 className="text-2xl font-bold text-gray-800 relative z-10">Spotify</h3>
                     <p className="text-sm text-gray-500 uppercase tracking-widest relative z-10">Clásicos del Vallenato</p>
                  </div>
                  <div className="p-8 text-center">
                     <p className="text-gray-600 mb-6 font-serif italic">"Pasado y presente para que la parranda perdure con los clásicos"</p>
                     <a href="https://open.spotify.com/playlist/37i9dQZF1DXbUPnz12C5bA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-[#1DB954] font-bold uppercase text-xs tracking-widest group-hover:underline">
                        Escuchar Playlist <SpotifyLogo className="w-5 h-5" />
                     </a>
                  </div>
               </div>

               {/* Apple Music Card */}
               <div className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-900/10 border-t-8 border-[#FA243C]">
                  <div className="bg-pink-50 p-8 flex flex-col items-center relative overflow-hidden">
                     <div className="absolute -right-6 -top-6 text-pink-100 opacity-50 transform rotate-12">
                       <Music size={120} />
                     </div>
                     <div className="h-16 flex items-center justify-center relative z-10 mb-4">
                        <AppleMusicLogo className="h-full w-auto text-[#FA243C] drop-shadow-sm" />
                     </div>
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