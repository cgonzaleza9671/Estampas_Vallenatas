
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, AudioItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/views/Home';
import Archive from './components/views/Archive';
import Bio from './components/views/Bio';
import Locations from './components/views/Locations';
import AudioStoryCard from './components/AudioStoryCard';
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

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
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
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-vallenato-beige selection:bg-vallenato-mustard selection:text-vallenato-blue">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      <main className={`flex-grow relative ${currentAudio ? 'pb-44 md:pb-32' : ''}`}>
        {currentView === ViewState.HOME && <Home setViewState={setCurrentView} onNavigateArchive={navigateToArchive} onPlayAudio={handlePlayAudio} currentAudioId={currentAudio?.id} isPlaying={isPlaying} />}
        {currentView === ViewState.ARCHIVE && <Archive initialTab={archiveInitialTab} onPlayAudio={handlePlayAudio} currentAudioId={currentAudio?.id} isPlaying={isPlaying} />}
        {currentView === ViewState.BIO && <Bio />}
        {currentView === ViewState.LOCATIONS && <Locations />}
      </main>

      <Footer />

      {currentAudio && showStoryCard && <AudioStoryCard audio={currentAudio} onClose={() => setShowStoryCard(false)} />}

      {currentAudio && (
        <div className="fixed bottom-0 left-0 w-full z-[99999] animate-fade-in-up">
          {/* Main Player Bar - Solid Background for Mobile Visibility */}
          <div className="bg-vallenato-blue text-white shadow-[0_-10px_50px_rgba(0,0,0,0.8)] border-t-4 border-vallenato-mustard player-safe-area">
            <audio 
              ref={audioRef} 
              src={currentAudio.url_audio} 
              onTimeUpdate={handleTimeUpdate} 
              onLoadedMetadata={handleTimeUpdate} 
              onEnded={() => setIsPlaying(false)} 
            />
            
            <div className="container mx-auto px-4 md:px-6 py-3">
              <div className="flex flex-col gap-2.5">
                
                {/* Progress Bar Container */}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono opacity-60 w-8">{formatTime(currentTime)}</span>
                  <div className="flex-grow relative h-2 flex items-center">
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
                      <div className="bg-vallenato-mustard h-full transition-all duration-100" style={{ width: `${(currentTime / duration) * 100 || 0}%` }} />
                    </div>
                  </div>
                  <span className="text-[9px] font-mono opacity-60 w-8 text-right">-{formatTime(duration - currentTime)}</span>
                </div>

                {/* Main Controls and Metadata */}
                <div className="flex items-center justify-between gap-2">
                  
                  {/* Metadata and Story Trigger */}
                  <div className="flex items-center gap-3 md:gap-5 w-8/12 md:w-5/12 overflow-hidden">
                    <button 
                      onClick={() => setShowStoryCard(!showStoryCard)} 
                      className="flex items-center gap-2 shrink-0"
                    >
                      <div className={`p-2 rounded-lg text-vallenato-blue transition-all ${showStoryCard ? 'bg-vallenato-red text-white scale-110 shadow-lg' : 'bg-vallenato-mustard shadow-md hover:scale-105'}`}>
                        <MessageSquareQuote size={20} />
                      </div>
                      <span className="hidden sm:block text-[8px] font-bold uppercase tracking-[0.15em] text-vallenato-mustard">Comentario</span>
                    </button>

                    {/* Meta Info Layout: Always Vertical */}
                    <div className="flex flex-col min-w-0">
                      <h5 className="text-[11px] md:text-sm font-serif font-bold truncate text-white leading-tight mb-0.5">
                        {currentAudio.titulo}
                      </h5>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <User size={10} className="text-vallenato-mustard shrink-0" />
                          <span className="text-[8px] md:text-[10px] text-vallenato-mustard font-bold uppercase tracking-widest truncate">
                            {currentAudio.autor}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Mic2 size={10} className="text-vallenato-red shrink-0" />
                          <span className="text-[8px] md:text-[10px] text-vallenato-red font-bold uppercase tracking-widest truncate">
                            {currentAudio.cantante}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Playback Controls Container */}
                  <div className="flex items-center gap-1 md:gap-6 shrink-0">
                    <button className="opacity-40 hover:opacity-100 hidden sm:block transition-opacity p-1"><SkipBack size={20}/></button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)} 
                      className="bg-vallenato-mustard text-vallenato-blue p-2.5 md:p-3.5 rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(234,170,0,0.5)]"
                    >
                      {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button className="opacity-40 hover:opacity-100 hidden sm:block transition-opacity p-1"><SkipForward size={20}/></button>
                  </div>

                  {/* Desktop Volume and Exit */}
                  <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                    <div className="flex items-center gap-3">
                      <Volume2 size={18} className="opacity-40" />
                      <div className="w-24 h-1.5 relative flex items-center">
                        <input 
                          type="range" min="0" max="1" step="0.01" value={volume} 
                          onChange={(e) => setVolume(parseFloat(e.target.value))} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: `${volume * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setCurrentAudio(null); setShowStoryCard(false); }} 
                      className="text-white/40 hover:text-vallenato-red transition-colors"
                    >
                      <X size={20}/>
                    </button>
                  </div>

                  {/* Mobile Exit Button */}
                  <div className="md:hidden flex items-center ml-1">
                    <button 
                      onClick={() => { setCurrentAudio(null); setShowStoryCard(false); }} 
                      className="p-1.5 text-white/30 hover:text-vallenato-red transition-colors"
                    >
                      <X size={22} />
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
