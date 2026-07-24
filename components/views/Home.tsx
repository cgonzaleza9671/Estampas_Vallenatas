
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioItem, VideoItem, StoryItem } from '../../types.ts';
import { HERO_GALLERY } from '../../constants.ts';
import Button from '../Button.tsx';
import MediaModal from '../MediaModal.tsx';
import { Play, Sparkles, ArrowRight, User, Video, Calendar, Pause, Mic2, Globe, BookOpen, Headphones, X, Star, Feather, ChevronRight, Disc, ListMusic, Quote } from 'lucide-react';
import { fetchLatestAudio, fetchRecentAudios, fetchRecentVideos, fetchRelatos } from '../../services/supabaseClient.ts';
import { AccordionPlayIcon } from '../CustomIcons.tsx';
import ScrollReveal from '../ScrollReveal.tsx';

interface HomeProps {
  onPlayAudio?: (audio: AudioItem, list?: AudioItem[]) => void;
  onVideoOpen?: () => void;
  currentAudioId?: number;
  isPlaying?: boolean;
}

const Home: React.FC<HomeProps> = ({ onPlayAudio, onVideoOpen, currentAudioId, isPlaying }) => {
  const navigate = useNavigate();
  const [latestAudio, setLatestAudio] = useState<AudioItem | null>(null);
  const [recentAudios, setRecentAudios] = useState<AudioItem[]>([]);
  const [recentVideos, setRecentVideos] = useState<VideoItem[]>([]);
  const [recentRelatos, setRecentRelatos] = useState<StoryItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<number[]>([0]);
  const [novedadIndex, setNovedadIndex] = useState(0); // 0: Audio, 1: Relato
  const [selectedMedia, setSelectedMedia] = useState<AudioItem | VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((prev) => (prev + 1) % HERO_GALLERY.length), 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoadedImages((prev) => {
      const nextIndex = (heroIndex + 1) % HERO_GALLERY.length;
      if (!prev.includes(heroIndex) || !prev.includes(nextIndex)) {
        return Array.from(new Set([...prev, heroIndex, nextIndex]));
      }
      return prev;
    });
  }, [heroIndex]);

  useEffect(() => {
    if (latestAudio && recentRelatos.length > 0) {
      const interval = setInterval(() => setNovedadIndex((prev) => (prev === 0 ? 1 : 0)), 6000);
      return () => clearInterval(interval);
    }
  }, [latestAudio, recentRelatos]);

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
        setRecentRelatos(relatos);
      } catch (error) {
        console.error("Home fetch error", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleIncremented = (e: any) => {
      const { id } = e.detail;
      setRecentAudios(prev => prev.map(a => a.id === id ? { ...a, reproducciones: (a.reproducciones || 0) + 1 } : a));
    };
    window.addEventListener('audioPlayIncremented', handleIncremented);
    return () => window.removeEventListener('audioPlayIncremented', handleIncremented);
  }, []);

  const openMedia = (item: AudioItem | VideoItem) => {
    if ('interprete' in item) {
      onVideoOpen?.(); 
      setSelectedMedia(item);
      setIsModalOpen(true);
    } else onPlayAudio?.(item as AudioItem, recentAudios);
  };

  const formatPlays = (num: number = 0) => {
    if (num < 1000) return num;
    if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
    return (num / 1000000).toFixed(1) + 'M';
  };

  const latestRelato = recentRelatos.length > 0 ? recentRelatos[0] : null;

  return (
    <div className="animate-fade-in-up relative">
      {!loadingData && (latestAudio || latestRelato) && (
        <div className="bg-vallenato-blue text-white relative overflow-hidden border-b border-white/10 min-h-[70px] flex items-center">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="container mx-auto px-6 py-4 md:py-3 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-10 transition-all duration-700">
                {novedadIndex === 0 && latestAudio ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-10 w-full animate-fade-in">
                    <div className="flex items-center gap-3 max-w-2xl">
                       <div className="bg-vallenato-mustard p-1.5 rounded-full animate-pulse flex-shrink-0"><AccordionPlayIcon size={16} className="text-vallenato-blue" /></div>
                       <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-center sm:text-left">
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-vallenato-mustard whitespace-nowrap mb-1 sm:mb-0">Canción más reciente:</span>
                          {latestAudio.numero && (
                             <span className="text-[10px] font-black uppercase tracking-widest text-white bg-vallenato-red px-2 py-0.5 rounded-md self-center shadow-sm">#{latestAudio.numero}</span>
                          )}
                          <span className="font-serif italic text-base md:text-lg line-clamp-2 md:line-clamp-1 leading-tight">"{latestAudio.titulo}" - {latestAudio.autor}</span>
                       </div>
                    </div>
                    <button onClick={() => onPlayAudio?.(latestAudio, [latestAudio])} className={`relative overflow-hidden px-7 py-3 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 border flex-shrink-0 group/btn shadow-xl ${currentAudioId === latestAudio.id && isPlaying ? 'bg-vallenato-red border-vallenato-red text-white shadow-[0_0_25px_rgba(200,16,46,0.5)]' : 'bg-gradient-to-tr from-[#9a7b0c] via-[#FFD700] to-[#EAAA00] border-[#FDE68A] text-vallenato-blue hover:scale-105'}`}>
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer transition-transform duration-1000 pointer-events-none"></div>
                      <span className="relative z-10 flex items-center gap-2">{currentAudioId === latestAudio.id && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}<span>{currentAudioId === latestAudio.id && isPlaying ? 'Pausar' : 'Escuchar'}</span></span>
                    </button>
                  </div>
                ) : latestRelato ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-10 w-full animate-fade-in">
                    <div className="flex items-center gap-3 max-w-2xl">
                       <div className="bg-vallenato-mustard p-1.5 rounded-full animate-pulse flex-shrink-0"><Feather size={16} className="text-vallenato-blue" /></div>
                       <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-center sm:text-left">
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-vallenato-mustard whitespace-nowrap mb-1 sm:mb-0">Último Relato:</span>
                          <span className="font-serif italic text-base md:text-lg line-clamp-2 md:line-clamp-1 leading-tight">"{latestRelato.titulo}"</span>
                       </div>
                    </div>
                    <button onClick={() => navigate('/relatos-legendarios')} className="relative overflow-hidden px-7 py-3 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 border bg-gradient-to-tr from-[#9a7b0c] via-[#FFD700] to-[#EAAA00] border-[#FDE68A] text-vallenato-blue hover:scale-105 active:scale-95 active:brightness-90 group/btn shadow-xl"><div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer transition-transform duration-1000 pointer-events-none"></div><span className="relative z-10 flex items-center gap-2"><span>Leer Crónica</span><ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></span></button>
                  </div>
                ) : null}
              </div>
              <div className="flex justify-center gap-1.5 mt-2 sm:mt-1">
                 <div className={`w-1 h-1 rounded-full transition-all duration-500 ${novedadIndex === 0 ? 'bg-vallenato-mustard scale-125 w-3' : 'bg-white/20'}`}></div>
                 <div className={`w-1 h-1 rounded-full transition-all duration-500 ${novedadIndex === 1 ? 'bg-vallenato-mustard scale-125 w-3' : 'bg-white/20'}`}></div>
              </div>
           </div>
        </div>
      )}

      <section className="relative min-h-[85vh] md:min-h-[90vh] w-full overflow-hidden flex items-center justify-center pt-12 pb-8 md:pb-12">
        {HERO_GALLERY.map((img, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: loadedImages.includes(index) ? `url("${img}")` : 'none', filter: (img === "https://i.imgur.com/H7JgO73.jpeg" || img === "https://i.imgur.com/l4iOgsO.jpeg" || img === "https://i.imgur.com/wDz7qUP.jpeg" || img === "https://i.imgur.com/MxktqOB.png") ? 'brightness(0.7) contrast(1.05)' : 'none' }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 z-10"></div>
        <div className="relative z-20 text-center max-w-5xl px-4 flex flex-col items-center">
          <span className="text-white font-sans font-light tracking-[0.3em] uppercase mb-4 text-sm md:text-base animate-fade-in-down drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Estampas Vallenatas</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-[1.1]"><span className="text-vallenato-mustard italic block text-3xl md:text-5xl mb-2">El Museo Digital del</span><span className="text-vallenato-red">Folclor Vallenato</span></h1>
          
          <div className="flex flex-col items-center justify-center my-6 md:my-8 animate-fade-in-up">
            <p className="text-gray-200 font-sans text-xs md:text-sm uppercase tracking-[0.3em] mb-2 font-medium drop-shadow-md">Hemos llegado ya a</p>
            <div className="relative group">
              <div className="absolute inset-0 bg-vallenato-mustard blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse rounded-full"></div>
              <span className="relative text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-[#FFD700] to-[#EAAA00] drop-shadow-[0_2px_15px_rgba(234,170,0,0.6)] tracking-tight leading-none px-4">
                100 CANCIONES
              </span>
            </div>
            <p className="text-vallenato-mustard font-calligraphy text-2xl md:text-4xl mt-3 md:mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              joyas de nuestra memoria vallenata
            </p>
          </div>
          
          <div className="mt-6 md:mt-8 w-[95%] md:w-4/5 lg:max-w-3xl bg-black/30 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl flex flex-col md:flex-row group/cta p-1.5 md:p-2">
            <div className="md:w-5/12 p-4 md:p-5 flex flex-col justify-center items-center md:items-start text-center md:text-left relative overflow-hidden bg-white/5 rounded-[1.5rem] border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-vallenato-mustard/20 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-1000"></div>
                <div className="bg-white/10 p-1.5 rounded-full mb-2 border border-white/10 relative z-10 hidden md:block">
                   <Sparkles size={16} className="text-vallenato-mustard animate-pulse" />
                </div>
                <h3 className="text-lg md:text-xl font-serif text-white font-bold mb-1.5 relative z-10 leading-tight">Empiece su recorrido <br/><span className="text-vallenato-mustard italic">histórico</span></h3>
                <p className="text-gray-300 text-[10px] font-light mb-3 relative z-10 leading-relaxed hidden md:block">Descubra la esencia del folclor a través de nuestra colección de relatos y joyas musicales.</p>
                <button 
                  onClick={() => navigate('/la-memoria-del-acordeon')}
                  className="bg-vallenato-mustard text-vallenato-blue hover:bg-white px-4 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_4px_20px_rgba(234,170,0,0.4)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.6)] flex items-center gap-1.5 relative z-10 hover:scale-105 active:scale-95"
                >
                  Explorar Archivo <ArrowRight size={12} />
                </button>
            </div>

            <div className="md:w-7/12 p-1.5 md:p-2 grid grid-cols-2 gap-1.5 md:gap-2">
                <div onClick={() => navigate('/relatos-legendarios')} className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-[1.5rem] border border-white/10 hover:border-vallenato-mustard/40 hover:bg-vallenato-mustard/10 cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-center relative overflow-hidden group/card shadow-sm">
                   <BookOpen size={18} className="text-vallenato-mustard mb-1.5 group-hover/card:scale-110 transition-transform relative z-10" />
                   <h4 className="text-white font-serif font-bold text-sm md:text-[15px] mb-0.5 relative z-10 leading-tight group-hover/card:text-vallenato-mustard transition-colors">Relatos<br/>Legendarios</h4>
                   <p className="text-gray-400 text-[9px] hidden md:block relative z-10 font-light leading-relaxed">Crónicas y vivencias invaluables.</p>
                </div>
                <div onClick={() => navigate('/la-memoria-del-acordeon')} className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-[1.5rem] border border-white/10 hover:border-vallenato-red/40 hover:bg-vallenato-red/10 cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-center relative overflow-hidden group/card shadow-sm">
                   <Headphones size={18} className="text-vallenato-red mb-1.5 group-hover/card:scale-110 transition-transform relative z-10" />
                   <h4 className="text-white font-serif font-bold text-sm md:text-[15px] mb-0.5 relative z-10 leading-tight group-hover/card:text-vallenato-red transition-colors">Audios<br/>Inéditos</h4>
                   <p className="text-gray-400 text-[9px] hidden md:block relative z-10 font-light leading-relaxed">Joyas musicales del folclor.</p>
                </div>
                <div onClick={() => navigate('/la-memoria-del-acordeon?tab=video')} className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-[1.5rem] border border-white/10 hover:border-white/40 hover:bg-white/10 cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-center relative overflow-hidden group/card shadow-sm">
                   <Video size={18} className="text-white mb-1.5 group-hover/card:scale-110 transition-transform relative z-10" />
                   <h4 className="text-white font-serif font-bold text-sm md:text-[15px] mb-0.5 relative z-10 leading-tight group-hover/card:text-white transition-colors">Videoteca<br/>Histórica</h4>
                   <p className="text-gray-400 text-[9px] hidden md:block relative z-10 font-light leading-relaxed">Presentaciones inolvidables.</p>
                </div>
                <div onClick={() => navigate('/acerca-del-autor')} className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-[1.5rem] border border-white/10 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/10 cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-center relative overflow-hidden group/card shadow-sm">
                   <User size={18} className="text-[#3b82f6] mb-1.5 group-hover/card:scale-110 transition-transform relative z-10" />
                   <h4 className="text-white font-serif font-bold text-sm md:text-[15px] mb-0.5 relative z-10 leading-tight group-hover/card:text-[#3b82f6] transition-colors">Acerca<br/>del Autor</h4>
                   <p className="text-gray-400 text-[9px] hidden md:block relative z-10 font-light leading-relaxed">Álvaro González Pimienta.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-12 bg-white relative z-10">
         <ScrollReveal>
         <div className="container mx-auto px-6">
             <div className="mb-12">
                <span className="text-vallenato-red font-bold uppercase tracking-widest text-sm">Últimas Estampas</span>
                <h2 className="text-4xl font-serif text-vallenato-blue mt-2">Audios</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
                {recentAudios.map((item) => {
                  const isActive = currentAudioId === item.id;
                  return (
                    <div key={item.id} onClick={() => onPlayAudio?.(item, recentAudios)} className={`group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 border-2 ${isActive ? 'border-vallenato-red bg-vallenato-cream shadow-gold' : 'border-white hover:border-vallenato-mustard shadow-museum hover:-translate-y-2'} cursor-pointer`}>
                      <div className="h-28 bg-vallenato-blue/5 relative overflow-hidden flex items-center justify-center">
                         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                         <Disc className={`text-vallenato-mustard/20 w-32 h-32 absolute -right-8 -top-8 transform rotate-12 transition-transform duration-1000 ${isActive && isPlaying ? 'animate-[spin_10s_linear_infinite]' : 'group-hover:rotate-45'}`} />
                         <div className="absolute top-4 left-4 z-10">
                           {item.numero && (
                             <div className="bg-vallenato-red text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-vallenato-red/20 shadow-md">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">#{item.numero}</span>
                             </div>
                           )}
                         </div>
                         <div className="absolute top-4 right-6 z-10 flex gap-2">
                            {(item.reproducciones || 0) > 0 && (
                              <div className="bg-vallenato-blue/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-vallenato-blue/10 flex items-center gap-1">
                                <Headphones size={8} className="text-vallenato-blue" />
                                <span className="text-[7px] font-black text-vallenato-blue/60">{formatPlays(item.reproducciones)}</span>
                              </div>
                            )}
                            <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-vallenato-mustard/20 shadow-sm">
                               <span className="text-[8px] font-black uppercase tracking-[0.1em] text-vallenato-blue/60">{item.fecha_publicacion}</span>
                            </div>
                         </div>
                         <div className={`p-4 rounded-full transition-all duration-500 shadow-2xl relative z-0 ${isActive && isPlaying ? 'bg-vallenato-red text-white scale-110' : 'bg-vallenato-blue text-white group-hover:bg-vallenato-red group-hover:scale-110'}`}>
                           {isActive && isPlaying ? <Pause size={28} fill="currentColor"/> : <Play size={28} fill="currentColor" className="ml-1"/>}
                         </div>
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                         <h4 className={`text-xl md:text-2xl font-serif font-bold mb-6 leading-tight transition-colors line-clamp-2 ${isActive ? 'text-vallenato-red' : 'text-vallenato-blue group-hover:text-vallenato-red'}`}>{item.titulo}</h4>
                         <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-vallenato-mustard/10 flex items-center justify-center text-vallenato-mustard"><User size={14} /></div>
                               <div className="flex flex-col"><span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Autor</span><span className="text-[11px] font-bold text-vallenato-blue/80 uppercase tracking-wider truncate">{item.autor}</span></div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-vallenato-red/10 flex items-center justify-center text-vallenato-red"><Mic2 size={14} /></div>
                               <div className="flex flex-col"><span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Voz Principal</span><span className="text-[11px] font-bold text-vallenato-blue/80 uppercase tracking-wider truncate">{item.cantante}</span></div>
                            </div>
                         </div>
                         <div className="mt-auto pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between group/acordeon">
                               <div className="flex flex-col">
                                  <span className="text-[8px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1.5">Maestro del Acordeón</span>
                                  <span className="text-sm md:text-base font-serif font-bold text-vallenato-blue leading-tight group-hover/acordeon:text-vallenato-red transition-colors">{item.acordeonero}</span>
                               </div>
                               <ListMusic size={20} className="text-vallenato-mustard/30 group-hover/acordeon:text-vallenato-mustard transition-colors" />
                            </div>
                         </div>
                      </div>
                    </div>
                  );
                })}
             </div>
             <div className="flex justify-center"><Button variant="outline" onClick={() => navigate('/la-memoria-del-acordeon')} className="group border-vallenato-mustard/30 hover:border-vallenato-mustard">Ver más audios <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button></div>
         </div>
         </ScrollReveal>
      </section>

      <section className="py-24 bg-vallenato-beige relative z-10 border-y border-vallenato-mustard/10 overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-vallenato-mustard/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-vallenato-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
         <ScrollReveal direction="up" delay={0.1}>
         <div className="container mx-auto px-6 relative">
             <div className="mb-16 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-vallenato-red px-4 py-1.5 rounded-full mb-4 shadow-lg animate-pulse"><Star size={12} className="text-white fill-current" /><span className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Nueva Sección</span></div>
                <span className="text-vallenato-red font-bold uppercase tracking-[0.4em] text-xs mb-2 block">experiencia de audio</span>
                <h2 className="text-4xl md:text-5xl font-serif text-vallenato-blue font-bold">Relatos Legendarios</h2>
                <div className="w-24 h-1 bg-vallenato-mustard mx-auto mt-6"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 max-w-6xl mx-auto">
                {recentRelatos.slice(0, 2).map((relato) => (
                  <div key={relato.id} onClick={() => navigate('/relatos-legendarios')} className="bg-white rounded-[2.5rem] overflow-hidden shadow-museum border border-vallenato-mustard/10 group cursor-pointer hover:shadow-gold transition-all duration-500 flex flex-col md:flex-row">
                    <div className="w-full md:w-[45%] flex-shrink-0 aspect-[3/4] relative overflow-hidden bg-vallenato-dark"><img src={relato.imagen} alt={relato.titulo} className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-[2s] opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-vallenato-dark/80 via-transparent to-transparent"></div></div>
                    <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
                       <div>
                         <h3 className="text-2xl md:text-3xl font-serif text-vallenato-blue font-bold leading-tight mb-4 group-hover:text-vallenato-red transition-colors">{relato.titulo}</h3>
                         <div className="w-10 h-0.5 bg-vallenato-mustard mb-6"></div>
                         <div className="relative mb-6 pl-6 py-4.5 pr-5 bg-vallenato-beige/20 border-l-4 border-vallenato-mustard rounded-r-[1.5rem] shadow-[inset_1px_1px_5px_rgba(234,170,0,0.05)] transition-all duration-500 group-hover:bg-vallenato-mustard/[0.08]">
                            <Quote className="absolute right-4 bottom-3 text-vallenato-mustard/10 pointer-events-none transform rotate-180 transition-transform duration-700 group-hover:scale-110 group-hover:text-vallenato-mustard/15" size={24} fill="currentColor" />
                            <p className="text-vallenato-blue font-serif italic text-[14px] md:text-[15px] leading-relaxed line-clamp-4 md:line-clamp-[6] relative z-10 font-medium">
                              {relato.subtitulo}
                            </p>
                         </div>
                       </div>
                       <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3"><div className="bg-vallenato-blue/5 p-2 rounded-full text-vallenato-blue/40"><BookOpen size={16} /></div><span className="text-[9px] font-bold uppercase tracking-widest text-vallenato-blue/40">{relato.fecha}</span></div>
                          <button className="bg-vallenato-blue text-white p-3 rounded-2xl group-hover:bg-vallenato-red transition-all shadow-lg active:scale-95"><Play size={14} fill="currentColor" /></button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-center"><Button variant="outline" onClick={() => navigate('/relatos-legendarios')} className="group border-vallenato-mustard/30 hover:border-vallenato-mustard">Explorar todos los relatos <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button></div>
         </div>
         </ScrollReveal>
      </section>

      <section className="pt-16 pb-24 bg-vallenato-cream/50 relative z-10">
         <ScrollReveal direction="up" delay={0.1}>
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
                        <div className="absolute top-4 left-4 z-10">
                          {item.numero && (
                            <div className="bg-vallenato-red text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-vallenato-red/20 shadow-md">
                               <span className="text-[10px] font-black uppercase tracking-widest text-white">#{item.numero}</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/50 group-hover:scale-110 transition-transform"><Play size={32} className="text-white fill-white" /></div>
                        </div>
                      </div>
                      <div className="p-8 flex-grow">
                         <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-4 group-hover:text-vallenato-red transition-colors leading-tight">{item.titulo}</h3>
                         <div className="space-y-1 mb-4">
                            <p className="text-vallenato-mustard text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><User size={14} /> {item.autor}</p>
                            <p className="text-vallenato-red text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><Mic2 size={14} /> {item.interprete}</p>
                         </div>
                         <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-widest"><Calendar size={12} /><span>{item.fecha_publicacion}</span></div>
                      </div>
                      <div className="mt-auto bg-vallenato-blue p-5 flex items-center justify-between group-hover:bg-vallenato-red transition-colors duration-300"><span className="text-white text-xs font-bold uppercase tracking-[0.2em]">Ver ahora</span><Play size={14} className="text-white fill-white" /></div>
                   </div>
                ))}
             </div>
             <div className="flex justify-center"><Button variant="outline" onClick={() => navigate('/la-memoria-del-acordeon?tab=video')} className="group border-vallenato-mustard/30">Ver más videos <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Button></div>
         </div>
         </ScrollReveal>
      </section>
       <MediaModal item={selectedMedia} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
