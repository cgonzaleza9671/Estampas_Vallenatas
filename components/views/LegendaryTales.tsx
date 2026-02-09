import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StoryItem } from '../../types.ts';
import { fetchRelatos } from '../../services/supabaseClient.ts';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Quote, Timer, ChevronRight, Volume2, Loader2, Clock, Feather, Volume1, VolumeX, BookOpen, RotateCcw, CheckCircle2, FastForward } from 'lucide-react';

// Marcas de tiempo de alta precisión sincronizadas a 1x.
const STORY_TIMESTAMPS: Record<string, number[]> = {
  "Rafael Escalona": [
    0.0,   // Párrafo 1: 0.0 - 19.0
    20.0,  // Párrafo 2: 20.0 - 39.0
    40.0,  // Párrafo 3: 40.0 - 1.08.0
    69.0,  // Párrafo 4: 1.09.0 - 1.23.0
    84.0,  // Párrafo 5: 1.24.0 - 2.22.0
    143.0, // Párrafo 6: 2.23.0 - 2.34.0
    155.0, // Párrafo 7: 2.35.0 - 3.09.0
    190.0, // Párrafo 8: 3.10.0 - 3.38.0
    219.0, // Párrafo 9: 3.39.0 - 3.52.0
    233.0, // Párrafo 10: 3.53.0 - 4.02.0
    243.0, // Párrafo 11: 4.03.0 - 4.12.0
    253.0  // Párrafo 12: 4.13.0 - Final
  ],
  "Tobías Enrique Pumarejo": [
    0.0,   // Párrafo 1: 0.0 - 20.0
    21.0,  // Párrafo 2: 21.0 - 36.0
    37.0,  // Párrafo 3: 37.0 - 1.12.0 (72s)
    73.0,  // Párrafo 4: 1.13.0 (73s) - 1.32.0 (92s)
    93.0,  // Párrafo 5: 1.33.0 (93s) - 1.56.0 (116s)
    117.0, // Párrafo 6: 1.57.0 (117s) - 2.30.0 (150s)
    151.0, // Párrafo 7: 2.31.0 (151s) - 2.48.0 (168s)
    169.0, // Párrafo 8: 2.49.0 (169s) - 3.14.0 (194s)
    195.0  // Párrafo 9: 3.15.0 (195s) - Final
  ],
  "La Gota Fría": [0, 14.8, 29.3, 45.7, 62.1, 78.5, 95.0, 112.0],
  "Pablo López": [
    0.0,    // Párrafo 1
    42.0,   // Párrafo 2
    72.0,   // Párrafo 3 (1:12.0)
    106.0,  // Párrafo 4 (1:46.0)
    146.0,  // Párrafo 5 (2:26.0)
    180.0,  // Párrafo 6 (3:00.0)
    208.0,  // Párrafo 7 (3:28.0)
    230.0,  // Párrafo 8 (3:50.0)
    252.0   // Párrafo 9 (4:12.0)
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
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    const loadRelatos = async () => {
      setLoading(true);
      try {
        const data = await fetchRelatos();
        setRelatos(data);
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
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsFinished(true);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isFinished && activeParagraphIndex >= 0 && paragraphsRef.current[activeParagraphIndex]) {
      paragraphsRef.current[activeParagraphIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeParagraphIndex, isFinished]);

  const restartStory = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setActiveParagraphIndex(0);
      setIsFinished(false);
      setIsPlaying(true);
      audioRef.current.play().catch(console.error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo(0, 0);
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
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
      if (isFinished && audioRef.current.currentTime < audioRef.current.duration) {
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
           <img src={selectedStory.imagen} className="w-full h-full object-cover opacity-30 scale-105" alt="" />
           <div className="absolute inset-0 bg-gradient-to-b from-vallenato-dark/40 via-vallenato-dark/80 to-vallenato-dark"></div>
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="container mx-auto max-w-4xl pt-10">
                 <h1 className="text-3xl md:text-6xl font-serif font-bold leading-tight mb-3 drop-shadow-2xl animate-fade-in-up">
                    {selectedStory.titulo}
                 </h1>
                 <p className="text-vallenato-mustard font-sans font-extrabold uppercase tracking-[0.25em] text-[8px] md:text-xs max-w-xl mx-auto opacity-70">
                    {selectedStory.subtitulo}
                 </p>
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
                    ref={el => paragraphsRef.current[idx] = el}
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

              {/* Mensaje de Finalización y Firma */}
              {isFinished ? (
                 <div className="pt-24 pb-12 text-center animate-fade-in-up">
                    <div className="inline-block relative">
                       <div className="absolute inset-0 bg-vallenato-mustard/5 blur-3xl rounded-full"></div>
                       <div className="relative z-10 bg-white/[0.03] border border-vallenato-mustard/20 px-8 py-10 rounded-[2.5rem] backdrop-blur-md">
                          <div className="flex items-center justify-center gap-3 mb-6">
                             <CheckCircle2 size={24} className="text-vallenato-mustard" />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-vallenato-mustard">Relato completado</span>
                          </div>
                          
                          <div className="mb-6">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vallenato-red block mb-2">Relato por:</span>
                             <h4 className="text-white font-calligraphy text-4xl md:text-6xl mb-2">Álvaro González Pimienta</h4>
                             <div className="w-12 h-0.5 bg-vallenato-red/30 mx-auto mt-4 rounded-full"></div>
                          </div>

                          <button 
                            onClick={restartStory}
                            className="inline-flex items-center gap-3 bg-vallenato-mustard text-vallenato-blue px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95"
                          >
                             <RotateCcw size={16} /> Volver a escuchar desde el inicio
                          </button>
                       </div>
                    </div>
                 </div>
              ) : (
                <div className="pt-24 pb-12 opacity-30 text-center filter grayscale transition-opacity duration-1000">
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 block mb-2">Relato por:</span>
                   <h4 className="text-white font-calligraphy text-4xl md:text-6xl">Álvaro González Pimienta</h4>
                </div>
              )}
           </div>
        </main>

        {/* REPRODUCTOR DE AUDIO POTENCIADO - ISLA FLOTANTE */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-xl">
           <div className="bg-[#001a33]/90 backdrop-blur-3xl p-5 md:p-6 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col gap-5">
              
              {/* Barra de Búsqueda y Tiempos */}
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
                   <span className="text-vallenato-mustard/60">Sincronización 1x</span>
                   <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controles Principales */}
              <div className="flex items-center justify-between gap-2">
                 
                 {/* Volumen Section */}
                 <div className="flex flex-col items-center gap-1.5 w-16 group">
                    <div className="flex items-center gap-2">
                       <button onClick={() => setVolume(v => v > 0 ? 0 : 1)} className="text-white/40 hover:text-vallenato-mustard transition-colors">
                          {volume === 0 ? <VolumeX size={16} /> : volume < 0.5 ? <Volume1 size={16} /> : <Volume2 size={16} />}
                       </button>
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
                         {/* Aura animada */}
                         {isPlaying && <div className="absolute inset-0 rounded-full bg-vallenato-red/30 animate-ping"></div>}
                         
                         <div className="relative z-10">
                           {isFinished ? (
                              <RotateCcw size={24} />
                           ) : isPlaying ? (
                             <Pause size={24} fill="currentColor" />
                           ) : (
                             <Play size={24} fill="currentColor" className="ml-1" />
                           )}
                         </div>
                       </button>
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{isFinished ? 'Reiniciar' : isPlaying ? 'Pausa' : 'Play'}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 group">
                       <button onClick={() => skipSeconds(15)} className="text-white/30 hover:text-white transition-all hover:scale-110 active:scale-90">
                          <SkipForward size={20} />
                       </button>
                       <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 group-hover:text-white transition-colors">+15s</span>
                    </div>
                 </div>

                 {/* Speed Section */}
                 <div className="flex flex-col items-center gap-1.5 w-16 group">
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
              <div className="w-full sm:w-[40%] aspect-[3/4] relative overflow-hidden bg-vallenato-dark">
                 <img src={story.imagen} alt={story.titulo} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2s]" />
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
                    <p className="text-gray-500 font-serif italic text-sm md:text-base leading-relaxed line-clamp-[6] mb-6">
                      {story.subtitulo}
                    </p>
                 </div>

                 <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-7 h-7 rounded-full bg-vallenato-blue/5 flex items-center justify-center text-vallenato-blue/30">
                          <Clock size={12} />
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-widest text-vallenato-blue/40">{story.fecha}</span>
                    </div>
                    <button className="text-vallenato-blue font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 group-hover:text-vallenato-red transition-all">
                       Leer más <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegendaryTales;