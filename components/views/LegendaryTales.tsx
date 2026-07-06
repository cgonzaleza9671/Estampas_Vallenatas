
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StoryItem } from '../../types.ts';
import { fetchRelatos } from '../../services/supabaseClient.ts';
import { LEGENDARY_TALES } from '../../constants.ts';
import ScrollReveal from '../ScrollReveal.tsx';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Quote, Timer, ChevronRight, Volume2, Loader2, Clock, Feather, Volume1, VolumeX, BookOpen, RotateCcw, CheckCircle2, FastForward } from 'lucide-react';

// Marcas de tiempo de alta precisión sincronizadas a 1x.
const STORY_TIMESTAMPS: Record<string, number[]> = {
  "Rafael Escalona": [
    0.0,   // Párrafo 1
    20.0,  // Párrafo 2
    40.0,  // Párrafo 3
    69.0,  // Párrafo 4
    84.0,  // Párrafo 5
    143.0, // Párrafo 6
    155.0, // Párrafo 7
    190.0, // Párrafo 8
    219.0, // Párrafo 9
    233.0, // Párrafo 10
    243.0, // Párrafo 11
    253.0  // Párrafo 12
  ],
  "Tobías Enrique Pumarejo": [
    0.0,   // Párrafo 1: 0.0 - 20.0
    21.0,  // Párrafo 2: 21.0 - 38.0
    39.0,  // Párrafo 3: 39.0 - 1.15.0 (75s)
    76.0,  // Párrafo 4: 1.16.0 (76s) - 1.37.0 (97s)
    98.0,  // Párrafo 5: 1.38.0 (98s) - 2.0.0 (120s)
    121.0, // Párrafo 6: 2.01.0 (121s) - 2.33.0 (153s)
    154.0, // Párrafo 7: 2.34.0 (154s) - 2.52.0 (172s)
    173.0, // Párrafo 8: 2.53.0 (173s) - 3.19.0 (199s)
    200.0  // Párrafo 9: 3.20.0 (200s) - Final
  ],
  "La Gota Fría": [0, 14.8, 29.3, 45.7, 62.1, 78.5, 95.0, 112.0],
  "Pablo López": [
    0.0, 42.0, 72.0, 106.0, 146.0, 180.0, 208.0, 230.0, 252.0
  ],
  "Guillermo Buitrago": [
    0.0,   // Párrafo 1
    22.0,  // Párrafo 2
    40.0,  // Párrafo 3
    68.0,  // Párrafo 4
    94.0,  // Párrafo 5
    131.0, // Párrafo 6
    160.0, // Párrafo 7
    192.0, // Párrafo 8
    236.0, // Párrafo 9
    253.0, // Párrafo 10
    282.0, // Párrafo 11
    312.0  // Párrafo 12
  ],
  "Leandro": [
    0.0,   // Párrafo 1: 0 - 32:00
    33.0,  // Párrafo 2: 33:00 - 1:06:00
    67.0,  // Párrafo 3: 1:07:00 - 1:39:00
    100.0, // Párrafo 4: 1:40:00 - 2:04:00
    125.0, // Párrafo 5: 2:05:00 - 2:30:00
    151.0, // Párrafo 6: 2:31:00 - 2:43:00
    164.0, // Párrafo 7: 2:44:00 - 3:08:00
    189.0, // Párrafo 8: 3:09:00 - 3:30:00
    211.0, // Párrafo 9: 3:31:00 - 3:38:00
    219.0, // Párrafo 10: 3:39:00 - 3:55:00
    236.0, // Párrafo 11: 3:56:00 - 4:28:00
    269.0  // Párrafo 12: 4:29:00 - fin
  ],
  "Lorenzo Morales": [
    0.0,   // Párrafo 1: 0 - 3:00
    4.0,   // Párrafo 2: 4:00 - 27:00
    28.0,  // Párrafo 3: 28:00 - 51:00 
    52.0,  // Párrafo 4: 52:00 - 54:00
    55.0,  // Párrafo 5: 55:00 - 1:10:00
    71.0,  // Párrafo 6: 1:11:00 - 1:30:00
    91.0,  // Párrafo 7: 1:31:00 - 1:51:00
    112.0, // Párrafo 8: 1:52:00 - 1:57:00
    118.0, // Párrafo 9: 1:58:00 - 2:12:00
    133.0, // Párrafo 10: 2:13:00 - 2:44:00
    165.0, // Párrafo 11: 2:45:00 - 3:08:00
    189.0, // Párrafo 12: 3:09:00 - 3:12:00
    193.0, // Párrafo 13: 3:13:00 - 3:21:00
    202.0  // Párrafo 14: 3:22:00
  ],
  "Emiliano Zuleta": [
    0.0,   // Párrafo 1: 0:00 - 4:50
    5.0,   // Párrafo 2: 5:00 - 35:00
    36.0,  // Párrafo 3: 36:00 - 1:06:00
    66.5,  // Párrafo 4: 1:06:50 - 1:38:00
    98.5,  // Párrafo 5: 1:38:50 - 1:57:00
    118.0, // Párrafo 6: 1:58:00 - 2:16:00
    136.5, // Párrafo 7: 2:16:50 - 2:58:00
    178.5, // Párrafo 8: 2:58:50 - 3:14:00
    195.0, // Párrafo 9: 3:15:00 - 3:22:00
    203.0, // Párrafo 10: 3:23:00 - 3:51:00
    231.5, // Párrafo 11: 3:51:50 - 3:57:00
    237.5, // Párrafo 12: 3:57:50 - 4:05:00
    246.0  // Párrafo 13: 4:06:00 - fin
  ]
};

const LegendaryTales: React.FC = () => {
  const [relatos, setRelatos] = useState<StoryItem[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const dynamicLatency = useMemo(() => {
    return -0.3 * playbackSpeed; 
  }, [playbackSpeed]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const paragraphsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    const loadRelatos = async () => {
      setLoading(true);
      try {
        const data = await fetchRelatos();
        // Combinar datos de Supabase con locales para asegurar que Leandro Díaz aparezca
        const combined = [...data];
        LEGENDARY_TALES.forEach(local => {
          if (!combined.find(c => c.id === local.id || c.titulo === local.titulo)) {
            combined.push(local);
          }
        });
        setRelatos(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRelatos();
  }, []);

  const paragraphs = useMemo(() => {
    if (!selectedStory) return [];
    return selectedStory.contenido.split(/\n\s*\n/).filter(p => p.trim());
  }, [selectedStory]);

  const timestamps = useMemo(() => {
    if (!selectedStory) return [];
    const matchKey = Object.keys(STORY_TIMESTAMPS).find(key => 
      selectedStory.titulo.toLowerCase().includes(key.toLowerCase())
    );
    const baseTimestamps = matchKey ? STORY_TIMESTAMPS[matchKey] : [0];
    const finalTimestamps = [...baseTimestamps];
    while (finalTimestamps.length < paragraphs.length) {
      const lastTime = finalTimestamps[finalTimestamps.length - 1];
      finalTimestamps.push(lastTime + 15);
    }
    return finalTimestamps;
  }, [selectedStory, paragraphs.length]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    
    if (isFinished) return;
    
    updateParagraphFromTime(time);
  };

  const updateParagraphFromTime = (time: number) => {
    const adjustedTime = time + dynamicLatency;
    let index = 0;
    for (let i = timestamps.length - 1; i >= 0; i--) {
      if (adjustedTime >= timestamps[i]) {
        index = i;
        break;
      }
    }
    if (index !== activeParagraphIndex && index < paragraphs.length) {
      setActiveParagraphIndex(index);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsFinished(true);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isFinished && selectedStory && activeParagraphIndex >= 0 && paragraphsRef.current[activeParagraphIndex]) {
      paragraphsRef.current[activeParagraphIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeParagraphIndex, isFinished, selectedStory]);

  const restartStory = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setActiveParagraphIndex(0);
      setIsFinished(false);
      setIsPlaying(true);
      audioRef.current.play().catch(console.error);
      setTimeout(() => {
        paragraphsRef.current[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const togglePlay = () => {
    if (isFinished) {
      restartStory();
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleStartStory = (story: StoryItem) => {
    setSelectedStory(story);
    setActiveParagraphIndex(0);
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentTime(0);
    setTimeout(() => {
      paragraphsRef.current[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  };

  const jumpToParagraph = (index: number) => {
    if (audioRef.current && timestamps[index] !== undefined) {
      audioRef.current.currentTime = timestamps[index];
      setActiveParagraphIndex(index);
      setIsFinished(false);
      if (!isPlaying) setIsPlaying(true);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      updateParagraphFromTime(newTime);
      if (isFinished && newTime < audioRef.current.duration) {
        setIsFinished(false);
      }
    }
  };

  const readingProgress = useMemo(() => {
    if (paragraphs.length === 0) return 0;
    if (isFinished) return 100;
    return Math.round(((activeParagraphIndex + 1) / paragraphs.length) * 100);
  }, [activeParagraphIndex, paragraphs.length, isFinished]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-vallenato-blue">
        <Loader2 size={48} className="animate-spin mb-4 text-vallenato-mustard" />
        <p className="font-serif italic text-lg">Abriendo el archivo del Maestro...</p>
      </div>
    );
  }

  if (selectedStory) {
    return (
      <div className="min-h-screen bg-vallenato-dark text-white animate-fade-in pb-48">
        <audio 
          ref={audioRef} 
          src={selectedStory.audio_url} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Pantalla de Finalización (Overlay Centrado) */}
        {isFinished && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-6 animate-fade-in backdrop-blur-md bg-vallenato-dark/60">
             <div className="max-w-xl w-full bg-[#001a33]/80 border border-vallenato-mustard/30 p-10 md:p-16 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] text-center animate-fade-in-up relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vallenato-mustard to-transparent opacity-50"></div>
                
                <div className="flex flex-col items-center gap-8 relative z-10">
                   <div className="relative">
                      <div className="absolute inset-0 bg-vallenato-mustard/20 blur-3xl rounded-full scale-150"></div>
                      <div className="bg-vallenato-mustard/10 p-6 rounded-full border border-vallenato-mustard/20 text-vallenato-mustard relative z-10">
                         <Feather size={48} className="animate-pulse" />
                      </div>
                   </div>

                   <div>
                      <span className="text-vallenato-mustard text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Relato completado</span>
                      <div className="w-12 h-0.5 bg-vallenato-red/40 mx-auto mb-6"></div>
                      
                      <h3 className="text-white text-2xl md:text-4xl font-serif font-bold mb-2 leading-tight drop-shadow-lg animate-fade-in">
                        {selectedStory.titulo}
                      </h3>
                      <p className="text-vallenato-mustard/90 font-serif italic text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        "{selectedStory.subtitulo}"
                      </p>

                      <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em] block mb-2">Escrito original de:</span>
                      <h4 className="text-white font-calligraphy text-5xl md:text-7xl mb-8 leading-tight drop-shadow-lg">Álvaro González Pimienta</h4>
                   </div>

                   <div className="flex flex-col gap-4 w-full">
                      <button 
                        onClick={restartStory}
                        className="w-full flex items-center justify-center gap-3 bg-vallenato-mustard text-vallenato-blue px-8 py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl active:scale-95"
                      >
                         <RotateCcw size={18} /> Volver a escuchar
                      </button>
                      <button 
                        onClick={() => setSelectedStory(null)}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 text-white/60 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                         Salir al archivo
                      </button>
                   </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vallenato-red to-transparent opacity-30"></div>
             </div>
          </div>
        )}

        {/* Barra de Progreso de Lectura Superior */}
        <div className="fixed top-16 left-0 w-full h-1 z-[60] bg-white/5">
           <div 
             className="h-full bg-vallenato-mustard transition-all duration-700 ease-out shadow-[0_0_10px_rgba(234,170,0,0.5)]"
             style={{ width: `${readingProgress}%` }}
           ></div>
        </div>

        <nav className="fixed top-0 left-0 w-full z-50 bg-vallenato-dark/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4">
           <div className="container mx-auto grid grid-cols-3 items-center w-full">
              <div className="flex justify-start">
                <button 
                  onClick={() => setSelectedStory(null)} 
                  className="flex items-center gap-2 text-white/60 hover:text-vallenato-mustard transition-all font-bold uppercase text-[9px] tracking-widest group"
                >
                  <ArrowLeft size={14} /> <span className="hidden sm:inline">Volver</span>
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-vallenato-red mb-0.5 whitespace-nowrap">Relato Legendario</span>
                <h2 className="text-xs font-serif font-bold text-white truncate max-w-[120px] sm:max-w-xs">{selectedStory.titulo}</h2>
              </div>

              <div className="flex justify-end invisible pointer-events-none"></div>
           </div>
        </nav>

        <div className="relative w-full h-[50vh] overflow-hidden">
           <img src={selectedStory.imagen} className="w-full h-full object-cover opacity-30 scale-105 grayscale" alt="" />
           <div className="absolute inset-0 bg-gradient-to-b from-vallenato-dark/40 via-vallenato-dark/80 to-vallenato-dark"></div>
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="container mx-auto max-w-4xl pt-10">
                 <h1 className="text-3xl md:text-6xl font-serif font-bold leading-tight mb-3 drop-shadow-2xl animate-fade-in-up">
                    {selectedStory.titulo}
                 </h1>
                 <div className="max-w-2xl mx-auto">
                    <div className="mt-4">
                       <p className="text-vallenato-mustard font-serif italic text-base md:text-xl md:leading-relaxed drop-shadow-md">
                          "{selectedStory.subtitulo}"
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <main className="container mx-auto px-6 mt-6 relative z-10 pb-16">
           <div className="max-w-2xl mx-auto space-y-10">
              {paragraphs.map((para, idx) => {
                const isActive = activeParagraphIndex === idx && !isFinished;
                const isReadable = isFinished || activeParagraphIndex === idx;

                return (
                  <div 
                    key={idx}
                    // Fix: Wrap ref assignment in braces to avoid returning the HTMLDivElement, which causes TS error
                    ref={(el) => { paragraphsRef.current[idx] = el; }}
                    onClick={() => jumpToParagraph(idx)}
                    className={`group relative transition-all duration-1000 cursor-pointer pl-4 md:pl-0
                      ${isReadable 
                        ? 'opacity-100 blur-0 scale-[1.01] md:scale-[1.02]' 
                        : 'opacity-10 blur-[1px] md:blur-[1.5px] scale-95 hover:opacity-25'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-vallenato-mustard rounded-full animate-pulse"></div>
                    )}

                    {isActive && (
                      <div className="absolute -inset-4 bg-vallenato-mustard/5 rounded-[2rem] blur-xl -z-10 animate-pulse"></div>
                    )}

                    <div className="flex gap-4 items-start">
                      <div className={`mt-1 transition-all duration-700 ${isActive ? 'text-vallenato-red' : 'text-white/10'}`}>
                        {isActive ? <Feather size={16} className="animate-bounce" /> : <Quote size={16} fill="currentColor" />}
                      </div>
                      
                      <div className="flex-grow">
                        <p className={`font-serif text-base md:text-lg leading-relaxed text-justify transition-colors duration-1000 ${isReadable ? 'text-white font-medium' : 'text-white/30'}`}>
                          {idx === 0 && (
                            <span className="text-3xl md:text-4xl font-bold text-vallenato-mustard float-left mr-2.5 -mt-1 leading-none">
                              {para.charAt(0)}
                            </span>
                          )}
                          {idx === 0 ? para.slice(1) : para}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pie de página sutil */}
              {!isFinished && (
                <div className="pt-24 pb-12 opacity-30 text-center filter grayscale transition-opacity duration-1000">
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 block mb-2">Escrito original de:</span>
                   <h4 className="text-white font-calligraphy text-4xl md:text-6xl">Álvaro González Pimienta</h4>
                </div>
              )}
           </div>
        </main>

        {/* REPRODUCTOR DE AUDIO - ISLA FLOTANTE CON VOLUMEN */}
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-xl transition-all duration-700 ${isFinished ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}>
           <div className="bg-[#001a33]/90 backdrop-blur-3xl p-5 md:p-6 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <div className="relative w-full group">
                  <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => {
                      const time = parseFloat(e.target.value);
                      if(audioRef.current) audioRef.current.currentTime = time;
                      setCurrentTime(time);
                      updateParagraphFromTime(time);
                      if (isFinished && time < (duration || 0)) {
                        setIsFinished(false);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-vallenato-mustard to-vallenato-red transition-all duration-150 relative"
                      style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/40 font-bold px-1">
                   <span>{formatTime(currentTime)}</span>
                   <span className="text-vallenato-mustard/60">Avance del relato: {readingProgress}%</span>
                   <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 md:gap-4">
                 {/* Sección de Volumen (Ajustada para no solapar) */}
                 <div className="flex flex-col items-center gap-1.5 w-16 md:w-20 group">
                    <div className="flex items-center gap-1.5 w-full">
                       <button onClick={() => setVolume(v => v > 0 ? 0 : 1)} className="text-white/40 hover:text-vallenato-mustard transition-colors flex-shrink-0">
                          {volume === 0 ? <VolumeX size={14} /> : volume < 0.5 ? <Volume1 size={14} /> : <Volume2 size={14} />}
                       </button>
                       <input 
                         type="range"
                         min="0"
                         max="1"
                         step="0.05"
                         value={volume}
                         onChange={(e) => setVolume(parseFloat(e.target.value))}
                         className="flex-grow h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-vallenato-mustard min-w-[30px]"
                         title="Ajustar volumen"
                       />
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 group-hover:text-vallenato-mustard transition-colors">Volumen</span>
                 </div>

                 {/* Playback Controls */}
                 <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-center gap-1 group">
                       <button onClick={() => skipSeconds(-15)} className="text-white/30 hover:text-white transition-all hover:scale-110 active:scale-90">
                          <SkipBack size={20} />
                       </button>
                       <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 group-hover:text-white transition-colors">-15s</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                       <button 
                         onClick={togglePlay} 
                         className={`relative p-5 rounded-full transition-all duration-500 shadow-2xl active:scale-90 group ${isPlaying ? 'bg-vallenato-red text-white' : 'bg-vallenato-mustard text-vallenato-blue'}`}
                       >
                         {isPlaying && <div className="absolute inset-0 rounded-full bg-vallenato-red/30 animate-ping"></div>}
                         <div className="relative z-10">
                           {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                         </div>
                       </button>
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{isPlaying ? 'Pausa' : 'Play'}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 group">
                       <button onClick={() => skipSeconds(15)} className="text-white/30 hover:text-white transition-all hover:scale-110 active:scale-90">
                          <SkipForward size={20} />
                       </button>
                       <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 group-hover:text-white transition-colors">+15s</span>
                    </div>
                 </div>

                 {/* Speed Section */}
                 <div className="flex flex-col items-center gap-1.5 w-14 md:w-16 group">
                    <button 
                      onClick={() => setPlaybackSpeed(prev => prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${playbackSpeed > 1 ? 'bg-vallenato-mustard/20 border-vallenato-mustard text-vallenato-mustard' : 'bg-white/5 border-white/10 text-white/40 group-hover:text-white'}`}
                    >
                      {playbackSpeed}x
                    </button>
                    <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 group-hover:text-vallenato-mustard transition-colors">Velocidad</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vallenato-beige pt-8 pb-32 animate-fade-in-up">
      <ScrollReveal direction="up" delay={0.1}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-vallenato-red px-4 py-1.5 rounded-full mb-6 shadow-lg">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Experiencia de Audio</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-vallenato-blue mb-4 font-bold tracking-tight text-center">Relatos Legendarios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-serif italic text-base md:text-lg text-center leading-relaxed">
             Escucha las crónicas del Maestro Álvaro González Pimienta acerca de los grandes de la historia del vallenato
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {relatos.map((story) => (
            <div 
              key={story.id} 
              onClick={() => handleStartStory(story)} 
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-museum border border-vallenato-mustard/10 hover:shadow-gold transition-all duration-700 cursor-pointer flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-[45%] flex-shrink-0 aspect-[3/4] relative overflow-hidden bg-vallenato-dark">
                 <img src={story.imagen} alt={story.titulo} className="w-full h-full object-cover opacity-80 grayscale group-hover:scale-110 transition-transform duration-[2s]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-vallenato-dark/80 via-transparent to-transparent opacity-60"></div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/20 backdrop-blur-xl p-5 rounded-full border border-white/30 text-white shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                       <Play size={24} fill="currentColor" />
                    </div>
                 </div>
              </div>

              <div className="p-8 flex-grow flex flex-col justify-between">
                 <div>
                    <h2 className="text-2xl font-serif text-vallenato-blue font-bold mb-3 group-hover:text-vallenato-red transition-colors leading-tight">{story.titulo}</h2>
                    <div className="w-8 h-0.5 bg-vallenato-mustard mb-4 opacity-50"></div>
                    <div className="relative mb-6 pl-6 py-4.5 pr-5 bg-vallenato-beige/20 border-l-4 border-vallenato-mustard rounded-r-[1.5rem] shadow-[inset_1px_1px_5px_rgba(234,170,0,0.05)] transition-all duration-500 group-hover:bg-vallenato-mustard/[0.08]">
                       <Quote className="absolute right-4 bottom-3 text-vallenato-mustard/10 pointer-events-none transform rotate-180 transition-transform duration-700 group-hover:scale-110 group-hover:text-vallenato-mustard/15" size={28} fill="currentColor" />
                       <p className="text-vallenato-blue font-serif italic text-[15px] md:text-[16px] leading-relaxed line-clamp-[6] relative z-10 font-medium">
                         {story.subtitulo}
                       </p>
                    </div>
                 </div>

                 <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                       <div className="w-7 h-7 rounded-full bg-vallenato-blue/5 flex items-center justify-center text-vallenato-blue/30">
                          <Clock size={12} />
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-widest text-vallenato-blue/40">{story.fecha}</span>
                    </div>
                    <div className="flex justify-end">
                      <button className="text-vallenato-blue font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 group-hover:text-vallenato-red transition-all">
                         Leer más <ChevronRight size={14} />
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
};

export default LegendaryTales;
