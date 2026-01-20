
import React, { useEffect, useState, useMemo } from 'react';
import { ViewState, AudioItem, VideoItem, StoryItem } from '../../types.ts';
import { FESTIVAL_DATE, HERO_GALLERY } from '../../constants.ts';
import Button from '../Button.tsx';
import MediaModal from '../MediaModal.tsx';
import { Play, Sparkles, ArrowRight, User, Video, Calendar, Pause, Mic2, Globe, BookOpen, Headphones, X, Star } from 'lucide-react';
import { fetchLatestAudio, fetchRecentAudios, fetchRecentVideos, fetchRelatos } from '../../services/supabaseClient.ts';

interface HomeProps {
  setViewState: (view: ViewState) => void;
  onNavigateArchive?: (tab: 'audio' | 'video') => void;
  onPlayAudio?: (audio: AudioItem, list?: AudioItem[]) => void;
  onVideoOpen?: () => void;
  currentAudioId?: number;
  isPlaying?: boolean;
}

interface TimeLeft {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Home: React.FC<HomeProps> = ({ setViewState, onNavigateArchive, onPlayAudio, onVideoOpen, currentAudioId, isPlaying }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [latestAudio, setLatestAudio] = useState<AudioItem | null>(null);
  const [recentAudios, setRecentAudios] = useState<AudioItem[]>([]);
  const [recentVideos, setRecentVideos] = useState<VideoItem[]>([]);
  const [recentRelatos, setRecentRelatos] = useState<StoryItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<AudioItem | VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showPromoBanner, setShowPromoBanner] = useState(false);

  const [charCount, setCharCount] = useState(0);
  const segments = useMemo(() => [
    { text: "Una ", bold: false },
    { text: "colección digital", bold: true },
    { text: " recopilada por el estudioso vallenato ", bold: false },
    { text: "Álvaro González Pimienta", bold: true },
    { text: ", conformada por ", bold: false },
    { text: "grabaciones", bold: true },
    { text: " y materiales basados en años de ", bold: false },
    { text: "aprendizaje del folclor", bold: true },
    { text: ". Cada descripción es un ", bold: false },
    { text: "comentario personal", bold: true },
    { text: " de Álvaro, fruto de su ", bold: false },
    { text: "experiencia", bold: true },
    { text: " y ", bold: false },
    { text: "pasión", bold: true },
    { text: " por la ", bold: false },
    { text: "música vallenata", bold: true },
    { text: ".", bold: false },
  ], []);

  const totalChars = segments.reduce((acc, s) => acc + s.text.length, 0);

  useEffect(() => {
    if (charCount < totalChars) {
      const timer = setTimeout(() => setCharCount(prev => prev + 1), 25);
      return () => clearTimeout(timer);
    }
  }, [charCount, totalChars]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_GALLERY.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [latest, audios, videos, relatos] = await Promise.all([
          fetchLatestAudio(),
          fetchRecentAudios(6),
          fetchRecentVideos(3),
          fetchRelatos()
        ]);
        setLatestAudio(latest);
        setRecentAudios(audios);
        setRecentVideos(videos);
        setRecentRelatos(relatos.slice(0, 2));
        
        // Mostrar banner temporal después de cargar
        setTimeout(() => setShowPromoBanner(true), 1000);
        // Desaparecer después de 10 segundos
        setTimeout(() => setShowPromoBanner(false), 11000);

      } catch (error) {
        console.error("Home fetch error", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +FESTIVAL_DATE - +new Date();
      let timeLeft: TimeLeft = { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (difference > 0) {
        const totalSeconds = Math.floor(difference / 1000);
        const totalDays = Math.floor(totalSeconds / (3600 * 24));
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
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatBadgeDate = (dateStr: string) => {
    return dateStr.replace(/ de /g, ' ');
  };

  const openMedia = (item: AudioItem | VideoItem) => {
    if ('interprete' in item) {
      onVideoOpen?.(); 
      setSelectedMedia(item);
      setIsModalOpen(true);
    } else {
      onPlayAudio?.(item as AudioItem, recentAudios);
    }
  };

  const labelMap: Record<string, string> = {
    months: 'Meses',
    weeks: 'Semanas',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
  };

  const renderTypedDescription = () => {
    let currentPos = 0;
    return segments.map((seg, i) => {
      const start = currentPos;
      currentPos += seg.text.length;
      if (charCount <= start) return null;
      const visibleText = seg.text.substring(0, charCount - start);
      return (
        <span key={i} className={seg.bold ? "font-bold text-white drop-shadow-sm" : ""}>
          {visibleText}
        </span>
      );
    });
  };

  return (
    <div className="animate-fade-in-up relative">
      
      {/* BANNER TEMPORAL SUPERIOR (10 SEGUNDOS) */}
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 transform ${showPromoBanner ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
         <div className="bg-vallenato-blue/95 backdrop-blur-xl border-b-2 border-vallenato-mustard shadow-2xl overflow-hidden">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-4 md:gap-6">
                  {/* ÍCONO DE AUDÍFONOS AHORA ES UN LINK */}
                  <button 
                    onClick={() => setViewState(ViewState.TALES)}
                    className="bg-vallenato-mustard p-3 rounded-full shadow-gold animate-bounce hover:scale-110 active:scale-95 transition-transform cursor-pointer group/icon"
                    title="Ir a Relatos Legendarios"
                  >
                     <Headphones className="text-vallenato-blue group-hover/icon:rotate-12 transition-transform" size={24} />
                  </button>
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 mb-0.5">
                        <Sparkles className="text-vallenato-mustard" size={14} />
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Nueva Experiencia Inmersiva</span>
                     </div>
                     <p className="text-gray-200 text-sm md:text-base font-serif italic">
                        "Escuche los relatos acerca de grandes juglares que han marcado la historia del vallenato"
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setViewState(ViewState.TALES)}
                    className="hidden md:flex bg-vallenato-mustard text-vallenato-blue px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 items-center gap-2"
                  >
                     Ver Relatos <ArrowRight size={14} />
                  </button>
                  <button onClick={() => setShowPromoBanner(false)} className="text-white/40 hover:text-white transition-colors">
                     <X size={24} />
                  </button>
               </div>
            </div>
            {/* Barra de progreso de cierre */}
            <div className="h-1 bg-vallenato-mustard/20 w-full relative">
               <div className={`h-full bg-vallenato-mustard ${showPromoBanner ? 'w-0' : 'w-full'} transition-all duration-[10000ms] ease-linear`}></div>
            </div>
         </div>
      </div>

      {!loadingData && latestAudio && (
        <div className="bg-vallenato-blue text-white relative overflow-hidden border-b border-white/10">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="container mx-auto px-6 py-4 md:py-3 flex flex-col sm:flex-row items-center justify-center relative z-10 gap-5 md:gap-10">
              <div className="flex items-center gap-3 max-w-2xl">
                 <div className="bg-vallenato-mustard p-1.5 rounded-full animate-pulse flex-shrink-0">
                    <Sparkles size={16} className="text-vallenato-blue" />
                 </div>
                 <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-center sm:text-left">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-vallenato-mustard whitespace-nowrap mb-1 sm:mb-0">Novedad Exclusiva:</span>
                    <span className="font-serif italic text-base md:text-lg line-clamp-2 md:line-clamp-1 leading-tight">"{latestAudio.titulo}" - {latestAudio.autor}</span>
                 </div>
              </div>
              <button onClick={() => onPlayAudio?.(latestAudio, [latestAudio])} className={`relative overflow-hidden px-7 py-3 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 border flex-shrink-0 group/btn shadow-xl ${currentAudioId === latestAudio.id && isPlaying ? 'bg-vallenato-red border-vallenato-red text-white shadow-[0_0_25px_rgba(200,16,46,0.5)]' : 'bg-gradient-to-tr from-[#9a7b0c] via-[#FFD700] to-[#EAAA00] border-[#FDE68A] text-vallenato-blue hover:scale-105 active:scale-95 active:brightness-90'}`}>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer transition-transform duration-1000 pointer-events-none"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {currentAudioId === latestAudio.id && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                  <span>{currentAudioId === latestAudio.id && isPlaying ? 'Pausar' : 'Reproducir'}</span>
                </span>
              </button>
           </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] w-full overflow-hidden flex items-center justify-center pt-12 pb-8 md:pb-12">
        {HERO_GALLERY.map((img, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`} 
            style={{ 
              backgroundImage: `url("${img}")`, 
              filter: (img === "https://i.imgur.com/H7JgO73.jpeg" || img === "https://i.imgur.com/l4iOgsO.jpeg" || img === "https://i.imgur.com/wDz7qUP.jpeg") ? 'brightness(0.7) contrast(1.05)' : 'none' 
            }} 
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 z-10"></div>
        <div className="relative z-20 text-center max-w-5xl px-4 flex flex-col items-center">
          <span className="text-white font-sans font-light tracking-[0.3em] uppercase mb-4 text-sm md:text-base animate-fade-in-down drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Estampas Vallenatas</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-[1.1]">
            <span className="text-vallenato-mustard italic block text-3xl md:text-5xl mb-2">El Museo Digital del</span>
            <span className="text-vallenato-red">Folclor Vallenato</span>
          </h1>
          <h2 className="text-gray-100 text-sm md:text-lg font-light mb-6 max-w-3xl mx-auto border-l-2 border-vallenato-mustard pl-6 text-left drop-shadow-[0_2px_6px_rgba(0,0,0,1)] min-h-[5em] md:min-h-[4em]">
            {renderTypedDescription()}
            <span className={`inline-block w-1.5 h-4 md:h-5 bg-vallenato-mustard ml-1 ${charCount < totalChars ? 'animate-pulse' : 'hidden'}`}></span>
          </h2>
          <div className="mt-2 w-full max-w-4xl flex flex-col items-center">
             <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 p-4 md:p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl w-full">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className={`flex flex-col items-center justify-center bg-black/30 rounded-xl py-3 border border-white/10 transition-all duration-300 ${label === 'seconds' ? 'border-vallenato-mustard/60 scale-105 shadow-[0_0_15px_rgba(234,170,0,0.3)] bg-vallenato-mustard/5' : ''}`}>
                     <span className={`text-2xl md:text-3xl font-mono font-bold mb-1 text-vallenato-mustard ${label === 'seconds' ? 'drop-shadow-[0_0_8px_rgba(234,170,0,0.8)] animate-pulse' : ''}`}>{String(value).padStart(2, '0')}</span>
                     <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold opacity-90 text-white">{labelMap[label]}</span>
                  </div>
                ))}
             </div>
             <p className="text-white text-xs md:text-sm mt-4 uppercase tracking-widest font-bold font-sans mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center">Cuenta regresiva para el inicio del 59° Festival de la Leyenda Vallenata</p>
             <a href="https://festivalvallenato.com/" target="_blank" rel="noopener noreferrer" className="bg-vallenato-mustard text-vallenato-blue hover:bg-white px-8 py-3 rounded-full font-bold uppercase text-xs md:text-sm tracking-widest transition-all duration-300 shadow-2xl flex items-center gap-3 border border-vallenato-mustard/20">Sitio oficial del Festival <Globe size={18} /></a>
          </div>
        </div>
      </section>

      {/* Audios Section */}
      <section className="pt-20 pb-12 bg-white relative z-10">
         <div className="container mx-auto px-6">
             <div className="mb-12">
                <span className="text-vallenato-red font-bold uppercase tracking-widest text-sm">Últimas Estampas</span>
                <h2 className="text-4xl font-serif text-vallenato-blue mt-2">Audios</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recentAudios.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => onPlayAudio?.(item, recentAudios)} 
                    className={`group relative min-h-[220px] bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-gold transition-all duration-500 border-2 ${currentAudioId === item.id ? 'border-vallenato-red bg-vallenato-cream' : 'border-vallenato-mustard/40 hover:border-vallenato-mustard'} cursor-pointer flex flex-col overflow-hidden`}
                  >
                    <div className="absolute top-1/2 -right-10 w-24 h-24 bg-vallenato-blue rounded-full border-4 border-vallenato-mustard/10 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all duration-700 pointer-events-none z-0"></div>
                    <div className="z-10 flex items-center mb-4">
                        <div className="bg-vallenato-mustard/10 text-vallenato-mustard px-2.5 py-1 rounded-full border border-vallenato-mustard/20">
                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{formatBadgeDate(item.fecha_publicacion)}</span>
                        </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-center relative z-10">
                        <h3 className="text-lg md:text-xl font-serif text-vallenato-blue font-bold group-hover:text-vallenato-red transition-colors mb-4 pr-2 leading-tight line-clamp-2">{item.titulo}</h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2.5 bg-vallenato-blue/5 px-3 py-1.5 rounded-xl group-hover:bg-vallenato-blue transition-colors group-hover:text-white border border-vallenato-blue/5 w-fit max-w-full overflow-hidden">
                              <User size={12} className="text-vallenato-mustard shrink-0" />
                              <span className="text-[10px] font-bold uppercase tracking-wider truncate">{item.autor}</span>
                          </div>
                          <div className="flex items-center gap-2.5 bg-vallenato-red/5 px-3 py-1.5 rounded-xl group-hover:bg-vallenato-red transition-colors group-hover:text-white border border-vallenato-red/5 w-fit max-w-full overflow-hidden">
                              <Mic2 size={12} className="text-vallenato-red group-hover:text-white shrink-0" />
                              <span className="text-[10px] font-bold uppercase tracking-wider truncate">{item.cantante}</span>
                          </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
                      <div className="flex flex-col">
                          <span className="text-[7.5px] uppercase font-black text-gray-400 tracking-tighter mb-0.5">ACORDEÓN</span>
                          <span className="text-[11px] font-bold text-vallenato-blue leading-none">{item.acordeonero}</span>
                      </div>
                      <div className={`p-3 rounded-full transition-all duration-500 shadow-lg ${currentAudioId === item.id && isPlaying ? 'bg-vallenato-red text-white scale-110' : 'bg-vallenato-blue text-white group-hover:scale-110 group-hover:bg-vallenato-red'}`}>{currentAudioId === item.id && isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-0.5"/>}</div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-center"><Button variant="outline" onClick={() => setViewState(ViewState.ARCHIVE)} className="group border-vallenato-mustard/30 hover:border-vallenato-mustard">Ver más audios <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button></div>
         </div>
      </section>

      {/* Relatos Section */}
      <section className="py-24 bg-vallenato-beige relative z-10 border-y border-vallenato-mustard/10 overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-vallenato-mustard/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-vallenato-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

         <div className="container mx-auto px-6 relative">
             <div className="mb-16 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-vallenato-red px-4 py-1.5 rounded-full mb-4 shadow-lg animate-pulse">
                   <Star size={12} className="text-white fill-current" />
                   <span className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Nueva Sección</span>
                </div>
                <span className="text-vallenato-red font-bold uppercase tracking-[0.4em] text-xs mb-2 block">Experiencia Inmersiva</span>
                <h2 className="text-4xl md:text-5xl font-serif text-vallenato-blue font-bold">Relatos Legendarios</h2>
                <div className="w-24 h-1 bg-vallenato-mustard mx-auto mt-6"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 max-w-5xl mx-auto">
                {recentRelatos.map((relato) => (
                  <div 
                    key={relato.id} 
                    onClick={() => setViewState(ViewState.TALES)}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-md border border-vallenato-mustard/10 group cursor-pointer hover:shadow-gold transition-all duration-500 flex flex-col"
                  >
                    <div className="aspect-[21/9] relative overflow-hidden bg-vallenato-blue">
                       <img src={relato.imagen} alt={relato.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                       <div className="absolute inset-0 bg-gradient-to-t from-vallenato-blue/90 via-vallenato-blue/40 to-transparent"></div>
                       <div className="absolute top-4 left-4 right-4">
                          <span className="bg-vallenato-mustard text-vallenato-blue text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block backdrop-blur-sm shadow-lg max-w-full truncate">{relato.subtitulo}</span>
                       </div>
                       <div className="absolute bottom-4 left-6">
                          <h3 className="text-xl font-serif text-white font-bold leading-tight drop-shadow-lg">{relato.titulo}</h3>
                       </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                       <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="bg-vallenato-red/10 p-2 rounded-full text-vallenato-red">
                                <BookOpen size={16} />
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/60">{relato.fecha}</span>
                          </div>
                          <button className="text-vallenato-blue font-bold uppercase text-[11px] tracking-widest flex items-center gap-2 group-hover:text-vallenato-red transition-colors">
                             Escuchar <Play size={12} fill="currentColor" />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="flex justify-center">
                <Button variant="outline" onClick={() => setViewState(ViewState.TALES)} className="group border-vallenato-mustard/30 hover:border-vallenato-mustard">
                   Explorar todos los relatos <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>
         </div>
      </section>

      {/* Videos Section */}
      <section className="pt-16 pb-24 bg-vallenato-cream/50 relative z-10">
         <div className="container mx-auto px-6">
             <div className="mb-12">
                <span className="text-vallenato-red font-bold uppercase tracking-widest text-sm">Últimas Estampas</span>
                <h2 className="text-4xl font-serif text-vallenato-blue mt-2">Videos</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recentVideos.map((item) => (
                   <div key={item.id} onClick={() => openMedia(item)} className="bg-white rounded-[2.5rem] shadow-lg border border-gray-100 overflow-hidden flex flex-col group hover:shadow-museum transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                      <div className="aspect-video relative overflow-hidden bg-black">
                        {item.thumbnail_url ? <img src={item.thumbnail_url} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"/> : <div className="w-full h-full bg-vallenato-blue flex items-center justify-center relative"><Video size={48} className="text-white/50" /></div>}
                        <div className="absolute inset-0 flex items-center justify-center"><div className="bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/50 group-hover:scale-110 transition-transform"><Play size={32} className="text-white fill-white" /></div></div>
                      </div>
                      <div className="p-8 flex-grow">
                         <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-4 group-hover:text-vallenato-red transition-colors leading-tight">{item.titulo}</h3>
                         <div className="space-y-1 mb-4">
                            <p className="text-vallenato-mustard text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><User size={14} /> {item.autor}</p>
                            <p className="text-vallenato-red text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><Mic2 size={14} /> {item.interprete}</p>
                         </div>
                         <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                           <Calendar size={12} />
                           <span>{item.fecha_publicacion}</span>
                         </div>
                      </div>
                      <div className="mt-auto bg-vallenato-blue p-5 flex items-center justify-between group-hover:bg-vallenato-red transition-colors duration-300"><span className="text-white text-xs font-bold uppercase tracking-[0.2em]">Ver ahora</span><Play size={14} className="text-white fill-white" /></div>
                   </div>
                ))}
             </div>
             <div className="flex justify-center"><Button variant="outline" onClick={() => {if(onNavigateArchive) onNavigateArchive('video'); else setViewState(ViewState.ARCHIVE);}} className="group border-vallenato-mustard/30">Ver más videos <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button></div>
         </div>
      </section>
      
      <MediaModal item={selectedMedia} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
