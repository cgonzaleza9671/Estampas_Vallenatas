
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, AudioItem } from './types.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './components/views/Home.tsx';
import Archive from './components/views/Archive.tsx';
import Bio from './components/views/Bio.tsx';
import Locations from './components/views/Locations.tsx';
import AudioStoryCard from './components/AudioStoryCard.tsx';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, MessageSquareQuote, User, Mic2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [archiveInitialTab, setArchiveInitialTab] = useState<'audio' | 'video'>('audio');
  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showStoryCard, setShowStoryCard] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [currentView]);

  const navigateToArchive = (tab: 'audio' | 'video') => {
    setArchiveInitialTab(tab);
    setCurrentView(ViewState.ARCHIVE);
  };

  const handlePlayAudio = (audio: AudioItem) => {
    if (currentAudio?.id === audio.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
      setCurrentTime(0);
      setShowStoryCard(true);
    }
  };

  /**
   * Detiene la reproducción de audio global.
   * Se invoca cuando se abre cualquier video en la aplicación.
   */
  const handleVideoOpen = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Auto-play blocked by browser, wait for user interaction.", err);
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

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-vallenato-beige selection:bg-vallenato-mustard selection:text-vallenato-blue overflow-x-hidden">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Contenido principal con padding inferior dinámico para el player */}
      <main className={`flex-grow relative transition-all duration-300 ${currentAudio ? 'pb-52 md:pb-40' : 'pb-0'}`}>
        {currentView === ViewState.HOME && (
          <Home 
            setViewState={setCurrentView} 
            onNavigateArchive={navigateToArchive} 
            onPlayAudio={handlePlayAudio} 
            onVideoOpen={handleVideoOpen}
            currentAudioId={currentAudio?.id} 
            isPlaying={isPlaying} 
          />
        )}
        {currentView === ViewState.ARCHIVE && (
          <Archive 
            initialTab={archiveInitialTab} 
            onPlayAudio={handlePlayAudio} 
            onVideoOpen={handleVideoOpen}
            currentAudioId={currentAudio?.id} 
            isPlaying={isPlaying} 
          />
        )}
        {currentView === ViewState.BIO && <Bio />}
        {currentView === ViewState.LOCATIONS && <Locations />}
      </main>

      <Footer onNavigate={setCurrentView} />

      {currentAudio && showStoryCard && <AudioStoryCard audio={currentAudio} onClose={() => setShowStoryCard(false)} />}

      {currentAudio && (
        <div className="fixed bottom-0 left-0 w-full z-[90] animate-fade-in-up shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
          {/* Main Player Bar */}
          <div className="bg-vallenato-blue text-white border-t-4 border-vallenato-mustard relative">
            <audio 
              ref={audioRef} 
              src={currentAudio.url_audio} 
              onTimeUpdate={handleTimeUpdate} 
              onLoadedMetadata={handleTimeUpdate} 
              onEnded={() => setIsPlaying(false)} 
            />
            
            <div className="container mx-auto px-4 md:px-6 py-3 pb-[calc(16px+env(safe-area-inset-bottom,0px))] md:pb-4">
              <div className="flex flex-col gap-2.5">
                
                {/* Progress Bar (Interactive) */}
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
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-3 md:gap-6 w-8/12 md:w-5/12 overflow-hidden">
                    <button 
                      onClick={() => setShowStoryCard(!showStoryCard)} 
                      className="flex items-center gap-2 shrink-0 relative"
                    >
                      <div className={`p-2.5 rounded-xl text-vallenato-blue transition-all duration-300 ${showStoryCard ? 'bg-vallenato-red text-white scale-110 shadow-lg' : 'bg-vallenato-mustard shadow-md hover:bg-white'}`}>
                        <MessageSquareQuote size={20} />
                      </div>
                      <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.2em] text-vallenato-mustard">Comentario</span>
                    </button>

                    <div className="flex flex-col min-w-0">
                      <h5 className="text-[12px] md:text-sm font-serif font-bold truncate text-white leading-tight mb-1">
                        {currentAudio.titulo}
                      </h5>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <User size={10} className="text-vallenato-mustard shrink-0" />
                          <span className="text-[9px] md:text-[10px] text-vallenato-mustard font-bold uppercase tracking-widest truncate max-w-[120px] md:max-w-none">
                            {currentAudio.autor}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mic2 size={10} className="text-vallenato-red shrink-0" />
                          <span className="text-[9px] md:text-[10px] text-vallenato-red font-bold uppercase tracking-widest truncate max-w-[120px] md:max-w-none">
                            {currentAudio.cantante}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-2 md:gap-8 shrink-0">
                    <button className="opacity-30 hover:opacity-100 hover:text-vallenato-mustard hidden sm:block transition-all transform hover:scale-110"><SkipBack size={22}/></button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)} 
                      className="bg-vallenato-mustard text-vallenato-blue p-3 md:p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(234,170,0,0.4)]"
                    >
                      {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="opacity-30 hover:opacity-100 hover:text-vallenato-mustard hidden sm:block transition-all transform hover:scale-110"><SkipForward size={22}/></button>
                  </div>

                  {/* Volume & Exit (Desktop) */}
                  <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <Volume2 size={18} className="opacity-40" />
                      <div className="w-20 h-1 relative flex items-center group">
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: `${volume * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { setCurrentAudio(null); setShowStoryCard(false); }} className="text-white/30 hover:text-vallenato-red transition-all transform hover:rotate-90">
                      <X size={22}/>
                    </button>
                  </div>

                  {/* Exit (Mobile) */}
                  <div className="md:hidden flex items-center ml-2">
                    <button 
                      onClick={() => { setCurrentAudio(null); setShowStoryCard(false); }} 
                      className="p-2 text-white/30 active:text-vallenato-red transition-colors"
                    >
                      <X size={24} />
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

export default App;
