
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ViewState, AudioItem } from './types.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './components/views/Home.tsx';
import Archive from './components/views/Archive.tsx';
import Bio from './components/views/Bio.tsx';
import LegendaryTales from './components/views/LegendaryTales.tsx';
import AudioStoryCard from './components/AudioStoryCard.tsx';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, MessageSquareQuote, User, Mic2, Headphones, Youtube, ExternalLink, Star, ChevronRight } from 'lucide-react';

// Componente para gestionar el scroll al cambiar de ruta
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

// Componente Invitación Flotante YouTube
const YouTubeFloatingInvite = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[150] w-[calc(100%-3rem)] md:w-96 animate-fade-in-up">
      <div className="relative overflow-hidden bg-vallenato-dark/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
        {/* Fondo decorativo con brillo */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-vallenato-red/20 blur-3xl rounded-full group-hover:bg-vallenato-red/40 transition-colors duration-700"></div>
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/20 hover:text-vallenato-red transition-all p-1 z-20"
        >
          <X size={18} />
        </button>

        <div className="flex gap-5 relative z-10">
          {/* Miniatura / Icono */}
          <div className="relative flex-shrink-0">
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img src="https://i.imgur.com/wIBYz82.jpeg" className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[5s]" alt="YT" />
                <div className="absolute inset-0 bg-vallenato-red/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Youtube size={24} className="text-white fill-white" />
                </div>
             </div>
             {/* Se elimina el distintivo rojo que estaba aquí para limpiar la visual según solicitud */}
          </div>

          <div className="flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-1">
                <Youtube size={14} className="text-vallenato-red fill-vallenato-red" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-vallenato-mustard">Colección en Video</span>
                <Star size={8} className="text-vallenato-mustard fill-current animate-pulse" />
             </div>
             <h4 className="text-white font-serif text-lg font-bold leading-tight mb-2">
                Lo invitamos a seguirnos en YouTube
             </h4>
             <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed font-serif italic mb-3">
                Suscríbase para ver los tesoros audiovisuales que preservamos.
             </p>
             
             <a 
               href="https://www.youtube.com/@EstampasVallenatasColombia" 
               target="_blank" 
               rel="noopener noreferrer"
               onClick={onClose}
               className="inline-flex items-center gap-2 bg-vallenato-red text-white px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-vallenato-blue transition-all shadow-xl group/btn active:scale-95"
             >
                clic para ir al canal <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Extraer parámetros de búsqueda para la pestaña del archivo
  const queryParams = new URLSearchParams(location.search);
  const archiveTab = (queryParams.get('tab') as 'audio' | 'video') || 'audio';

  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [playlist, setPlaylist] = useState<AudioItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showStoryCard, setShowStoryCard] = useState(false);
  const [isTaleActive, setIsTaleActive] = useState(false);
  const [showYouTubeInvite, setShowYouTubeInvite] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lógica de Invitación una vez por sesión (Alternativa 2)
  useEffect(() => {
    const hasSeenInvite = sessionStorage.getItem('vallenato_yt_invite');
    if (!hasSeenInvite) {
      const timer = setTimeout(() => {
        setShowYouTubeInvite(true);
      }, 4000); // Aparece a los 4 segundos
      return () => clearTimeout(timer);
    }
  }, []);

  const closeYouTubeInvite = () => {
    setShowYouTubeInvite(false);
    sessionStorage.setItem('vallenato_yt_invite', 'true');
  };

  const handlePlayAudio = (audio: AudioItem, list?: AudioItem[]) => {
    window.dispatchEvent(new CustomEvent('musicPlay'));
    
    if (list) {
      setPlaylist(list);
    } else if (playlist.length === 0 || !playlist.find(a => a.id === audio.id)) {
      setPlaylist([audio]);
    }

    if (currentAudio?.id === audio.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
      setCurrentTime(0);
      setShowStoryCard(true);
    }
  };

  const handleVideoOpen = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    const handleTaleStart = () => {
      setIsPlaying(false);
      setIsTaleActive(true);
    };
    const handleTaleStop = () => setIsTaleActive(false);

    window.addEventListener('talePlay', handleTaleStart);
    window.addEventListener('talePause', handleTaleStop);
    return () => {
      window.removeEventListener('talePlay', handleTaleStart);
      window.removeEventListener('talePause', handleTaleStop);
    };
  }, []);

  const goToNext = () => {
    if (!currentAudio || playlist.length <= 1) return;
    const currentIndex = playlist.findIndex(a => a.id === currentAudio.id);
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      handlePlayAudio(playlist[currentIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (!currentAudio || !audioRef.current) return;
    
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) setIsPlaying(true);
      return;
    }

    const currentIndex = playlist.findIndex(a => a.id === currentAudio.id);
    if (currentIndex > 0) {
      handlePlayAudio(playlist[currentIndex - 1]);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Auto-play blocked by browser", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudio]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume, currentAudio]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const canGoNext = currentAudio && playlist.findIndex(a => a.id === currentAudio.id) < playlist.length - 1;
  const canGoPrev = currentAudio && (playlist.findIndex(a => a.id === currentAudio.id) > 0 || currentTime > 3);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-vallenato-beige selection:bg-vallenato-mustard selection:text-vallenato-blue transition-colors duration-300 overflow-x-hidden">
      <ScrollToTop />
      <Header />
      
      {/* Invitación Flotante YouTube */}
      {showYouTubeInvite && <YouTubeFloatingInvite onClose={closeYouTubeInvite} />}

      <main className={`flex-grow relative transition-all duration-300 ${currentAudio ? 'pb-52 md:pb-40' : 'pb-0'}`}>
        <Routes>
          <Route path="/" element={
            <Home 
              onPlayAudio={handlePlayAudio} 
              onVideoOpen={handleVideoOpen}
              currentAudioId={currentAudio?.id} 
              isPlaying={isPlaying} 
            />
          } />
          <Route path="/la-memoria-del-acordeon" element={
            <Archive 
              initialTab={archiveTab} 
              onPlayAudio={handlePlayAudio} 
              onVideoOpen={handleVideoOpen}
              currentAudioId={currentAudio?.id} 
              isPlaying={isPlaying} 
            />
          } />
          <Route path="/relatos-legendarios" element={<LegendaryTales />} />
          <Route path="/acerca-del-autor" element={<Bio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {currentAudio && showStoryCard && <AudioStoryCard audio={currentAudio} onClose={() => setShowStoryCard(false)} />}

      {currentAudio && (
        <div className={`fixed bottom-0 left-0 w-full z-[90] animate-fade-in-up shadow-[0_-20px_60px_rgba(0,0,0,0.5)] transition-all duration-700 ${isTaleActive ? 'opacity-40 grayscale-[0.5] scale-[0.98] origin-bottom' : 'opacity-100'}`}>
          <div className="bg-vallenato-blue text-white border-t-4 border-vallenato-mustard relative">
            <audio 
              ref={audioRef} 
              src={currentAudio.url_audio} 
              preload="none"
              onTimeUpdate={handleTimeUpdate} 
              onLoadedMetadata={handleTimeUpdate} 
              onEnded={goToNext} 
            />
            
            <div className="container mx-auto px-4 md:px-6 py-3 pb-[calc(16px+env(safe-area-inset-bottom,0px))] md:pb-4">
              <div className="flex flex-col gap-2.5">
                
                {/* Indicador de Modo Relato */}
                {isTaleActive && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-vallenato-red text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-t-xl flex items-center gap-2 shadow-lg animate-bounce">
                    <Headphones size={12} /> Música en espera por relato
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono opacity-50 w-8">{formatTime(currentTime)}</span>
                  <div className="flex-grow relative h-2 flex items-center group">
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 0} 
                      step="0.1" 
                      value={currentTime} 
                      onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value); }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                    />
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-vallenato-mustard h-full transition-all duration-100 group-hover:bg-vallenato-red" style={{ width: `${(currentTime / duration) * 100 || 0}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono opacity-50 w-8 text-right">-{formatTime(duration - currentTime)}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-6 w-8/12 md:w-5/12 overflow-hidden">
                    <button 
                      onClick={() => setShowStoryCard(!showStoryCard)} 
                      className="flex items-center gap-2 shrink-0 relative"
                    >
                      <div className={`p-2.5 rounded-xl text-vallenato-blue transition-all duration-300 ${showStoryCard ? 'bg-vallenato-red text-white scale-110 shadow-lg' : 'bg-vallenato-mustard shadow-md hover:bg-white'}`}>
                        <MessageSquareQuote size={20} />
                      </div>
                    </button>

                    <div className="flex flex-col min-w-0">
                      <h5 className="text-[12px] md:text-sm font-serif font-bold truncate text-white leading-tight mb-1">
                        {currentAudio.titulo}
                      </h5>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <User size={10} className="text-vallenato-mustard shrink-0" />
                          <span className="text-[9px] md:text-[10px] text-vallenato-mustard font-bold uppercase tracking-widest truncate">
                            {currentAudio.autor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-8 shrink-0">
                    <button 
                      onClick={goToPrev}
                      disabled={!canGoPrev}
                      className={`transition-all transform hover:scale-110 hidden sm:block ${canGoPrev ? 'text-white hover:text-vallenato-mustard' : 'opacity-20 cursor-not-allowed'}`}
                    >
                      <SkipBack size={22}/>
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)} 
                      className="bg-vallenato-mustard text-vallenato-blue p-3 md:p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                      {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button 
                      onClick={goToNext}
                      disabled={!canGoNext}
                      className={`transition-all transform hover:scale-110 hidden sm:block ${canGoNext ? 'text-white hover:text-vallenato-mustard' : 'opacity-20 cursor-not-allowed'}`}
                    >
                      <SkipForward size={22}/>
                    </button>
                  </div>

                  <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                    <button onClick={() => { setCurrentAudio(null); setShowStoryCard(false); }} className="text-white/30 hover:text-vallenato-red transition-all transform hover:rotate-90">
                      <X size={22}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
