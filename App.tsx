
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, AudioItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/views/Home';
import Archive from './components/views/Archive';
import Bio from './components/views/Bio';
import Locations from './components/views/Locations';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, X, ChevronUp, ChevronDown, MessageSquareQuote } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [archiveInitialTab, setArchiveInitialTab] = useState<'audio' | 'video'>('audio');
  
  // Global Audio State
  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ensure page scrolls to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

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
    }
  };

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback interrupted"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentAudio]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <Home 
            setViewState={setCurrentView} 
            onNavigateArchive={navigateToArchive} 
            onPlayAudio={handlePlayAudio}
            currentAudioId={currentAudio?.id}
            isPlaying={isPlaying}
          />
        );
      case ViewState.ARCHIVE:
        return (
          <Archive 
            initialTab={archiveInitialTab} 
            onPlayAudio={handlePlayAudio}
            currentAudioId={currentAudio?.id}
            isPlaying={isPlaying}
          />
        );
      case ViewState.BIO:
        return <Bio />;
      case ViewState.LOCATIONS:
        return <Locations />;
      default:
        return <Home setViewState={setCurrentView} onNavigateArchive={navigateToArchive} onPlayAudio={handlePlayAudio} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-vallenato-beige selection:bg-vallenato-mustard selection:text-vallenato-blue">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      <Footer />

      {/* GLOBAL STICKY PLAYER */}
      {currentAudio && (
        <>
          {/* Expanded Comments Panel */}
          <div 
            className={`fixed bottom-0 left-0 w-full bg-vallenato-blue/95 backdrop-blur-xl text-white z-[55] transition-all duration-500 ease-in-out border-t-2 border-vallenato-mustard/30 overflow-hidden ${
              isExpanded ? 'h-[320px] pb-24 opacity-100' : 'h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="hidden md:flex bg-white/10 p-6 rounded-2xl border border-white/10 items-center justify-center">
                <MessageSquareQuote size={48} className="text-vallenato-mustard opacity-50" />
              </div>
              <div className="flex-grow">
                <h3 className="text-vallenato-mustard font-serif text-xl md:text-2xl mb-4 flex items-center gap-2">
                  Comentario de Álvaro González Pimienta
                </h3>
                <p className="text-gray-200 font-serif italic text-lg md:text-xl leading-relaxed max-w-4xl">
                  "{currentAudio.descripcion}"
                </p>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Player Bar */}
          <div className="fixed bottom-0 left-0 w-full bg-vallenato-blue text-white z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.3)] border-t-4 border-vallenato-mustard animate-fade-in-up">
            <audio 
              ref={audioRef}
              src={currentAudio.url_audio}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col gap-2">
                {/* Progress Bar */}
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono opacity-60 w-8">{formatTime(currentTime)}</span>
                  <div className="flex-grow relative h-1.5 flex items-center">
                    <input 
                      type="range"
                      min="0"
                      max={duration || 0}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-vallenato-mustard h-full transition-all duration-100 shadow-[0_0_10px_rgba(234,170,0,0.8)]" 
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                      />
                    </div>
                    <div 
                      className="absolute w-3 h-3 bg-white rounded-full border-2 border-vallenato-mustard shadow-md z-10 pointer-events-none"
                      style={{ left: `calc(${(currentTime / duration) * 100 || 0}% - 6px)` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono opacity-60 w-10 text-right">-{formatTime(duration - currentTime)}</span>
                </div>

                <div className="flex items-center justify-between">
                  {/* Track Info & Expand Button */}
                  <div className="flex items-center gap-6 md:gap-10 w-1/2 md:w-5/12">
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-2 group transition-all duration-300 hover:scale-105 shrink-0"
                    >
                      <div className={`bg-vallenato-mustard p-1.5 rounded-lg text-vallenato-blue transition-transform duration-500 shadow-lg ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronUp size={16} />
                      </div>
                      <span className="text-[6.5px] md:text-[8px] font-bold uppercase tracking-[0.15em] text-vallenato-mustard animate-pulse whitespace-nowrap">
                        {isExpanded ? 'Cerrar Comentario' : 'Ver Comentario'}
                      </span>
                    </button>
                    
                    <div className="hidden xs:block w-px h-10 bg-white/10 mx-2 md:mx-4 shrink-0"></div>

                    <div className="overflow-hidden">
                      <h5 className="text-xs md:text-sm font-serif font-bold truncate leading-none mb-1.5">{currentAudio.titulo}</h5>
                      <p className="text-[9px] md:text-[10px] text-vallenato-mustard/80 font-bold uppercase tracking-widest truncate">{currentAudio.autor}</p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 md:gap-6">
                    <button className="opacity-50 hover:opacity-100 transition-opacity hidden sm:block"><SkipBack size={20}/></button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-vallenato-mustard text-vallenato-blue p-3 rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(234,170,0,0.4)]"
                    >
                      {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
                    </button>
                    <button className="opacity-50 hover:opacity-100 transition-opacity hidden sm:block"><SkipForward size={20}/></button>
                  </div>

                  {/* Volume Slider */}
                  <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                    <div className="flex items-center gap-3">
                      <Volume2 size={18} className="opacity-60" />
                      <div className="w-24 h-1.5 relative flex items-center group">
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-white h-full transition-all duration-75" 
                            style={{ width: `${volume * 100}%` }}
                          />
                        </div>
                        <div 
                          className="absolute w-2 h-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ left: `calc(${volume * 100}% - 4px)` }}
                        />
                      </div>
                    </div>
                    <button onClick={() => { setCurrentAudio(null); setIsExpanded(false); }} className="hover:text-vallenato-red transition-colors opacity-60 hover:opacity-100"><X size={18}/></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
