
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './components/views/Home.tsx';
import Archive from './components/views/Archive.tsx';
import Bio from './components/views/Bio.tsx';
import LegendaryTales from './components/views/LegendaryTales.tsx';
import Journey from './components/views/Journey.tsx';
import AudioStoryCard from './components/AudioStoryCard.tsx';
import PersistentPlayerDock from './components/PersistentPlayerDock.tsx';
import { SEOMeta } from './components/SEOMeta.tsx';
import { Play, Pause, SkipBack, SkipForward, X, MessageSquareQuote, User, Headphones, Youtube, Star, ChevronRight } from 'lucide-react';
import { AudioItem } from './types.ts';
import { incrementAudioPlayCount } from './services/supabaseClient.ts';

// Componente para gestionar el scroll al cambiar de ruta
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

// Componente Invitación Flotante YouTube
const YouTubeFloatingInvite = ({ onClose, hasAudioPlaying }: { onClose: () => void; hasAudioPlaying?: boolean }) => {
  return (
    <div className={`fixed ${hasAudioPlaying ? 'bottom-28 md:bottom-28' : 'bottom-6 md:bottom-6'} right-4 md:right-6 z-[150] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-96 animate-fade-in-up transition-all duration-500`}>
      <div className="relative overflow-hidden bg-vallenato-dark/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-vallenato-red/20 blur-3xl rounded-full group-hover:bg-vallenato-red/40 transition-colors duration-700"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/20 hover:text-vallenato-red transition-all p-1 z-20"
        >
          <X size={18} />
        </button>
        <div className="flex gap-5 relative z-10">
          <div className="relative flex-shrink-0">
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black">
                <img src="https://i.imgur.com/wIBYz82.jpeg" className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[5s]" alt="YT" />
             </div>
          </div>
          <div className="flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-1">
                <Youtube size={14} className="text-vallenato-red fill-vallenato-red" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-vallenato-mustard">Colección en Video</span>
                <Star size={8} className="text-vallenato-mustard fill-current animate-pulse" />
             </div>
             <h4 className="text-white font-serif text-lg font-bold leading-tight mb-2">Lo invitamos a seguirnos en YouTube</h4>
             <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed font-serif italic mb-3">Suscríbase para ver los tesoros audiovisuales que preservamos.</p>
             <a href="https://www.youtube.com/@EstampasVallenatasColombia" target="_blank" rel="noopener noreferrer" onClick={onClose} className="inline-flex items-center gap-2 bg-vallenato-red text-white px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-vallenato-blue transition-all shadow-xl group/btn active:scale-95">clic para ir al canal <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const archiveTab = (queryParams.get('tab') as 'audio' | 'video') || 'audio';

  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [playlist, setPlaylist] = useState<AudioItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume] = useState(1);
  const [showStoryCard, setShowStoryCard] = useState(false);
  const [isTaleActive, setIsTaleActive] = useState(false);
  const [showYouTubeInvite, setShowYouTubeInvite] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playStartTimeRef = useRef<number | null>(null);
  const incrementedIdsRef = useRef<Set<number>>(new Set());

  // Lógica de invitación flotante
  useEffect(() => {
    let hasSeenInvite = false;
    try {
      hasSeenInvite = Boolean(sessionStorage.getItem('vallenato_yt_invite'));
    } catch (e) {
      hasSeenInvite = false;
    }
    if (!hasSeenInvite) {
      const timer = setTimeout(() => setShowYouTubeInvite(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (showYouTubeInvite) {
      const autoCloseTimer = setTimeout(() => closeYouTubeInvite(), 7000);
      return () => clearTimeout(autoCloseTimer);
    }
  }, [showYouTubeInvite]);

  const closeYouTubeInvite = () => {
    setShowYouTubeInvite(false);
    try {
      sessionStorage.setItem('vallenato_yt_invite', 'true');
    } catch (e) { /* silent */ }
  };

  const handlePlayAudio = (audio: AudioItem, list?: AudioItem[]) => {
    window.dispatchEvent(new CustomEvent('musicPlay'));
    if (list) setPlaylist(list);
    else if (playlist.length === 0 || !playlist.find(a => a.id === audio.id)) setPlaylist([audio]);

    if (currentAudio?.id === audio.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
      setCurrentTime(0);
      setShowStoryCard(true);
      // Resetear rastreador de reproducción para el nuevo audio
      playStartTimeRef.current = Date.now();
    }
  };

  // Lógica para registrar reproducción válida (>5s)
  useEffect(() => {
    if (isPlaying && currentAudio && !incrementedIdsRef.current.has(currentAudio.id)) {
      const checkThreshold = setInterval(() => {
        if (audioRef.current && audioRef.current.currentTime > 5) {
          incrementAudioPlayCount(currentAudio.id);
          incrementedIdsRef.current.add(currentAudio.id);
          // Emitir evento para refrescar UI si es necesario
          window.dispatchEvent(new CustomEvent('audioPlayIncremented', { detail: { id: currentAudio.id } }));
          clearInterval(checkThreshold);
        }
      }, 1000);
      return () => clearInterval(checkThreshold);
    }
  }, [isPlaying, currentAudio?.id]);

  const handleVideoOpen = () => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  };

  useEffect(() => {
    const handleTaleStart = () => { setIsPlaying(false); setIsTaleActive(true); };
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
    if (currentIndex > 0) handlePlayAudio(playlist[currentIndex - 1]);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(console.warn);
      else audioRef.current.pause();
    }
  }, [isPlaying, currentAudio]);

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

  const canGoNext = Boolean(currentAudio && playlist.findIndex(a => a.id === currentAudio.id) < playlist.length - 1);
  const canGoPrev = Boolean(currentAudio && (playlist.findIndex(a => a.id === currentAudio.id) > 0 || currentTime > 3));

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-vallenato-beige selection:bg-vallenato-mustard selection:text-vallenato-blue transition-colors duration-300 overflow-x-hidden">
      <ScrollToTop />
      <SEOMeta />
      <Header />
      {showYouTubeInvite && <YouTubeFloatingInvite onClose={closeYouTubeInvite} hasAudioPlaying={!!currentAudio} />}
      <main className={`flex-grow relative transition-all duration-300 ${currentAudio ? 'pb-32 md:pb-28' : 'pb-0'}`}>
        <Routes>
          <Route path="/" element={<Home onPlayAudio={handlePlayAudio} onVideoOpen={handleVideoOpen} currentAudioId={currentAudio?.id} isPlaying={isPlaying} />} />
          <Route path="/la-memoria-del-acordeon" element={<Archive initialTab={archiveTab} onPlayAudio={handlePlayAudio} onVideoOpen={handleVideoOpen} currentAudioId={currentAudio?.id} isPlaying={isPlaying} />} />
          <Route path="/relatos-legendarios" element={<LegendaryTales />} />
          <Route path="/el-viaje-del-vallenato" element={<Journey />} />
          <Route path="/acerca-del-autor" element={<Bio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {currentAudio && showStoryCard && <AudioStoryCard audio={currentAudio} onClose={() => setShowStoryCard(false)} />}
      {currentAudio && (
        <>
          <audio
            ref={audioRef}
            src={currentAudio.url_audio}
            preload="none"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={goToNext}
          />
          <PersistentPlayerDock
            currentAudio={currentAudio}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            isTaleActive={isTaleActive}
            showStoryCard={showStoryCard}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onNext={goToNext}
            onPrev={goToPrev}
            onSeek={(newTime) => {
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            onToggleStoryCard={() => setShowStoryCard(!showStoryCard)}
            onClose={() => {
              setCurrentAudio(null);
              setShowStoryCard(false);
            }}
          />
        </>
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
