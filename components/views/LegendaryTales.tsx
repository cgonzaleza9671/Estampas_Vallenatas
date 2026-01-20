
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StoryItem } from '../../types.ts';
import { fetchRelatos } from '../../services/supabaseClient.ts';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Clock, BookOpen, ArrowRight, Loader2, AlertCircle, Volume2, Award, Headphones, Info, Sparkles, X, Settings2, Star } from 'lucide-react';
import Button from '../Button.tsx';

const LegendaryTales: React.FC = () => {
  const [relatos, setRelatos] = useState<StoryItem[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inlineButtonTop, setInlineButtonTop] = useState(0);
  const [showInlineButton, setShowInlineButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number>(0);

  // Offset de latencia optimizado para una sincronía perfecta (-0.22s de pre-fetch visual)
  const LATENCY_OFFSET = -0.22; 

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const loadRelatos = async () => {
      setLoading(true);
      try {
        const data = await fetchRelatos();
        setRelatos(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadRelatos();
  }, []);

  const storyData = useMemo(() => {
    if (!selectedStory) return { paragraphs: [], totalWeight: 0, wordWeights: [] };
    
    let globalIdx = 0;
    let totalWeight = 0;
    const wordWeights: { index: number; cumulativeWeight: number }[] = [];

    const paragraphs = selectedStory.contenido.split(/\n\s*\n/).filter(p => p.trim()).map((p, pIdx) => {
      // Peso de Párrafo: 45 unidades para simular la pausa de respiración natural del orador
      if (pIdx > 0) totalWeight += 45;

      const pWords = p.split(/\s+/).filter(w => w.trim()).map(word => {
        // Normalización de peso: las palabras no pueden durar "cero"
        let weight = Math.max(word.length, 6);
        
        // Pesos de puntuación rítmica enfáticos
        if (word.endsWith('.') || word.endsWith(':')) weight += 32; 
        else if (word.endsWith(';') || word.endsWith('...')) weight += 20;
        else if (word.endsWith(',')) weight += 15;
        else if (word.endsWith('?') || word.endsWith('!')) weight += 22;
        
        totalWeight += weight;
        const currentIdx = globalIdx++;
        
        wordWeights.push({
          index: currentIdx,
          cumulativeWeight: totalWeight
        });

        return { text: word, index: currentIdx, weight };
      });
      return { words: pWords };
    });

    return { paragraphs, totalWeight, wordWeights };
  }, [selectedStory]);

  const findActiveWordIndex = (targetWeight: number) => {
    const arr = storyData.wordWeights;
    let start = 0;
    let end = arr.length - 1;
    let ans = -1;

    // Búsqueda binaria ultra-rápida
    while (start <= end) {
      let mid = Math.floor((start + end) / 2);
      if (arr[mid].cumulativeWeight >= targetWeight) {
        ans = arr[mid].index;
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
    return ans;
  };

  const syncPlayback = () => {
    if (audioRef.current && isPlaying) {
      const currentTime = Math.max(0, audioRef.current.currentTime + LATENCY_OFFSET);
      const duration = audioRef.current.duration;
      
      if (duration > 0) {
        const progress = currentTime / duration;
        const targetWeight = progress * storyData.totalWeight;
        
        const activeIdx = findActiveWordIndex(targetWeight);
        
        if (activeIdx !== -1 && activeIdx !== currentWordIndex) {
          setCurrentWordIndex(activeIdx);
        }
      }
      requestRef.current = requestAnimationFrame(syncPlayback);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(syncPlayback);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, storyData, currentWordIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, playbackSpeed, selectedStory]);

  useEffect(() => {
    if (currentWordIndex >= 0 && wordsRef.current[currentWordIndex]) {
      const activeWord = wordsRef.current[currentWordIndex];
      if (activeWord) {
        activeWord.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        const rect = activeWord.getBoundingClientRect();
        setInlineButtonTop(rect.top + window.scrollY - 10);
        setShowInlineButton(true);
      }
    } else if (currentWordIndex === -1 && !isPlaying) {
      setShowInlineButton(false);
    }
  }, [currentWordIndex, isPlaying]);

  const handleStartStory = (story: StoryItem) => {
    setSelectedStory(story);
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    setPlaybackSpeed(1.25);
    setShowInstructions(true); 
    window.scrollTo(0, 0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipSeconds = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
    }
  };

  const handleWordClick = (index: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const word = storyData.wordWeights.find(w => w.index === index);
      if (word) {
        // Al hacer click, nos posicionamos justo antes de la palabra
        const prevWeight = index > 0 ? storyData.wordWeights[index - 1].cumulativeWeight : 0;
        const weightProgress = prevWeight / storyData.totalWeight;
        audioRef.current.currentTime = weightProgress * audioRef.current.duration;
        setCurrentWordIndex(index);
        if (!isPlaying) setIsPlaying(true);
      }
    }
  };

  const progress = storyData.totalWeight > 0 && currentWordIndex >= 0 
    ? Math.round((storyData.wordWeights[currentWordIndex].cumulativeWeight / storyData.totalWeight) * 100) 
    : 0;

  const getWordClasses = (index: number) => {
    const baseClasses = "inline-block mr-[0.3em] px-1 rounded transition-all duration-200 cursor-pointer select-none";
    if (!isPlaying) {
      if (index === currentWordIndex) {
         return `${baseClasses} bg-vallenato-mustard/30 text-vallenato-blue font-bold border-b-2 border-vallenato-mustard`;
      }
      return `${baseClasses} text-vallenato-blue opacity-100`;
    }
    const diff = Math.abs(index - currentWordIndex);
    if (index === currentWordIndex) {
      return `${baseClasses} bg-vallenato-mustard text-vallenato-blue font-bold scale-110 shadow-[0_5px_15px_rgba(234,170,0,0.4)] relative z-20 ring-2 ring-vallenato-mustard/20`;
    } else if (diff === 1) {
      return `${baseClasses} text-vallenato-blue font-bold opacity-100 scale-105 z-10`;
    } else if (diff === 2) {
      return `${baseClasses} text-vallenato-blue font-semibold opacity-70`;
    } else if (diff < 15) {
      return `${baseClasses} text-vallenato-blue/40`;
    } else {
      return `${baseClasses} text-vallenato-blue/10 blur-[0.4px]`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-vallenato-blue">
        <Loader2 size={48} className="animate-spin mb-4 text-vallenato-mustard" />
        <p className="font-serif italic text-lg">Abriendo los folios de las leyendas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <AlertCircle size={64} className="text-vallenato-red mb-6" />
        <h2 className="text-2xl font-serif font-bold text-vallenato-blue mb-2">No pudimos leer los relatos</h2>
        <p className="text-gray-600 mb-8">Hubo un problema al conectar con el archivo digital.</p>
        <Button onClick={() => window.location.reload()}>Reintentar lectura</Button>
      </div>
    );
  }

  if (selectedStory) {
    return (
      <div className="min-h-screen bg-vallenato-beige animate-fade-in-up pb-32">
        {selectedStory.audio_url && (
          <audio 
            ref={audioRef} 
            src={selectedStory.audio_url} 
            onEnded={() => setIsPlaying(false)}
            preload="auto"
          />
        )}

        {/* Modal Instructivo Compacto - Posición Alta */}
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-vallenato-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden border border-vallenato-mustard/30 mt-16 md:mt-24 animate-fade-in-down">
                <div className="bg-vallenato-blue p-5 text-center relative">
                   <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                      <X size={20} />
                   </button>
                   <div className="bg-vallenato-mustard p-2 rounded-full w-fit mx-auto mb-2 shadow-lg">
                      <Headphones className="text-vallenato-blue" size={18} />
                   </div>
                   <h3 className="text-white font-serif text-xl font-bold">Lectura Guiada</h3>
                </div>
                <div className="p-6 space-y-4">
                   <div className="flex gap-3 items-center">
                      <div className="bg-vallenato-mustard p-1.5 rounded-full shadow-sm">
                        <Play size={12} className="text-vallenato-blue fill-current" />
                      </div>
                      <p className="text-gray-700 text-sm font-medium">Pulsa <b>Play</b> para iniciar la crónica.</p>
                   </div>
                   <div className="flex gap-3 items-center">
                      <BookOpen className="text-vallenato-red flex-shrink-0" size={18} />
                      <p className="text-gray-700 text-sm">El texto seguirá el ritmo exacto de la voz.</p>
                   </div>
                   <div className="flex gap-3 items-center">
                      <Settings2 className="text-vallenato-blue flex-shrink-0" size={18} />
                      <p className="text-gray-700 text-sm">Puedes pulsar cualquier palabra para saltar allí.</p>
                   </div>
                   <div className="pt-2">
                      <Button fullWidth onClick={() => setShowInstructions(false)} className="text-xs py-3 shadow-gold">
                         Comenzar Experiencia
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {showInlineButton && (
          <div
            style={{ 
              position: 'absolute',
              top: `${inlineButtonTop}px`,
              left: isMobile ? 'auto' : 'calc(50% + 400px)',
              right: isMobile ? '12px' : 'auto',
              transition: 'top 0.4s cubic-bezier(0.22, 1, 0.36, 1)' 
            }}
            className="flex flex-col items-center z-50 group"
          >
            <button
              onClick={togglePlay}
              className={`
                group relative p-3.5 md:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-90
                ${isPlaying ? 'bg-vallenato-red text-white' : 'bg-vallenato-mustard text-vallenato-blue shadow-gold'}
              `}
              title={isPlaying ? "Pausar relato" : "Continuar relato"}
            >
              {isPlaying ? <Pause size={isMobile ? 20 : 24} fill="currentColor" /> : <Play size={isMobile ? 20 : 24} fill="currentColor" className="ml-1" />}
              {!isMobile && (
                <span className="absolute right-full mr-4 px-3 py-1 bg-vallenato-blue text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {isPlaying ? 'Pausar Relato' : 'Seguir Escuchando'}
                </span>
              )}
            </button>
            <div className={`w-0.5 h-10 md:h-12 mt-2 transition-opacity duration-500 bg-gradient-to-b from-vallenato-mustard to-transparent ${isPlaying ? 'opacity-60' : 'opacity-20'}`}></div>
          </div>
        )}

        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-vallenato-mustard/20 p-4 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            <button 
              onClick={() => setSelectedStory(null)}
              className="flex items-center gap-2 text-vallenato-blue hover:text-vallenato-red transition-colors font-bold uppercase text-[10px] tracking-widest"
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <div className="hidden md:block text-center">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-vallenato-red block mb-0.5">Crónica Narrada</span>
              <h2 className="text-sm font-serif font-bold text-vallenato-blue truncate max-w-xs">{selectedStory.titulo}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-vallenato-blue/40 font-mono text-[10px]">
                <Volume2 size={12} className={isPlaying ? "animate-pulse text-vallenato-red" : ""} /> {isPlaying ? "Escuchando..." : "En pausa"}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-vallenato-mustard/20 w-full">
            <div className="h-full bg-vallenato-mustard transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-6">
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-xl border-2 border-white group w-2/3 mx-auto lg:w-full">
                <img src={selectedStory.imagen} alt={selectedStory.titulo} className="w-full h-auto aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                   <span className="bg-vallenato-red text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">{selectedStory.fecha}</span>
                </div>
              </div>

              <div className="bg-vallenato-blue text-white p-4 rounded-[1.5rem] shadow-xl space-y-4 border border-white/5 max-w-[280px] mx-auto lg:max-w-none">
                <div>
                   <span className="text-[8px] font-bold uppercase tracking-widest text-vallenato-mustard opacity-80 block mb-2">Avance de lectura</span>
                   <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-vallenato-mustard transition-all duration-500" style={{ width: `${progress}%` }}></div>
                   </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                   <span className="text-[8px] font-bold uppercase tracking-widest text-vallenato-mustard opacity-80 block mb-2 text-center">Ritmo de voz</span>
                   <div className="grid grid-cols-5 gap-1">
                      {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button 
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`py-1.5 rounded-lg text-[8px] font-bold transition-all border ${playbackSpeed === speed ? 'bg-vallenato-mustard border-vallenato-mustard text-vallenato-blue' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                   <button onClick={() => skipSeconds(-5)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all active:scale-90" title="Retroceder 5s"><SkipBack size={16} /></button>
                   <button 
                    onClick={togglePlay} 
                    className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 ${isPlaying ? 'bg-vallenato-red' : 'bg-vallenato-mustard text-vallenato-blue'}`}
                   >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                   </button>
                   <button onClick={() => skipSeconds(5)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all active:scale-90" title="Adelantar 5s"><SkipForward size={16} /></button>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-8 relative">
              <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                   <span className="text-vallenato-red font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Relatos Legendarios</span>
                   <h1 className="text-4xl md:text-5xl font-serif text-vallenato-blue font-bold leading-tight mb-6">{selectedStory.titulo}</h1>
                   <p className="text-xl text-vallenato-blue font-serif italic border-l-4 border-vallenato-mustard pl-6 leading-relaxed opacity-90 transition-all duration-700">
                     {selectedStory.subtitulo}
                   </p>
                </header>

                <div className="prose prose-xl font-serif text-vallenato-blue leading-[2.2] relative">
                   {storyData.paragraphs.map((para, pIdx) => (
                     <p key={pIdx} className="mb-12 text-justify">
                       {para.words.map((word) => (
                         <span 
                          key={word.index}
                          ref={el => wordsRef.current[word.index] = el}
                          onClick={() => handleWordClick(word.index)}
                          className={getWordClasses(word.index)}
                         >
                           {word.text}
                         </span>
                       ))}
                     </p>
                   ))}
                </div>

                <div className="mt-16 pt-8 border-t border-vallenato-mustard/30 flex flex-col items-end">
                   <div className="flex items-center gap-3 text-vallenato-blue/60 mb-2">
                      <Award size={20} className="text-vallenato-mustard" />
                      <span className="text-sm font-serif italic font-bold">Crónica por Álvaro González</span>
                   </div>
                   <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-vallenato-mustard"></div>
                </div>

                <div className="mt-20 py-16 text-center">
                   <Button variant="outline" onClick={() => setSelectedStory(null)} className="min-w-[240px]">
                      Volver a la Galería
                   </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vallenato-beige pt-8 pb-32 animate-fade-in-up">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-vallenato-red px-4 py-1.5 rounded-full mb-6 shadow-lg animate-pulse">
            <Star size={12} className="text-white fill-current" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Nueva Sección</span>
          </div>
          <span className="text-vallenato-red font-bold uppercase tracking-widest text-[10px] md:text-xs">Archivo Vivo</span>
          <h1 className="text-4xl md:text-6xl font-serif text-vallenato-blue mb-4 font-bold tracking-tight">Relatos Legendarios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-serif italic text-base md:text-lg">
             Una experiencia inmersiva para conectar con las raíces del Magdalena Grande.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {relatos.map((story) => (
            <div 
              key={story.id} 
              onClick={() => handleStartStory(story)}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-museum border border-vallenato-mustard/10 hover:shadow-gold transition-all duration-500 cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-vallenato-blue">
                 <img 
                  src={story.imagen} 
                  alt={story.titulo} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-vallenato-blue via-transparent to-transparent opacity-60"></div>
                 <div className="absolute top-6 left-6">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30">
                       <span className="text-white text-[10px] font-bold uppercase tracking-widest">{story.fecha}</span>
                    </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-vallenato-mustard p-6 rounded-full text-vallenato-blue shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                       <BookOpen size={32} />
                    </div>
                 </div>
              </div>
              <div className="p-10 flex-grow flex flex-col">
                 <h2 className="text-3xl font-serif text-vallenato-blue font-bold mb-4 group-hover:text-vallenato-red transition-colors">{story.titulo}</h2>
                 <p className="text-gray-500 font-serif italic line-clamp-2 mb-8">{story.subtitulo}</p>
                 <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-vallenato-blue/5 border border-vallenato-blue/10 flex items-center justify-center text-vallenato-blue">
                          <Play size={16} fill="currentColor" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">{story.fecha}</span>
                    </div>
                    <button className="text-vallenato-blue font-bold uppercase text-[11px] tracking-widest flex items-center gap-2 group-hover:text-vallenato-red transition-colors">
                       Explorar Relato <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
            </div>
          ))}

          <div className="bg-white/40 border-2 border-dashed border-vallenato-mustard/20 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center opacity-60">
             <div className="bg-vallenato-mustard/10 p-6 rounded-full text-vallenato-mustard mb-6">
                <Clock size={40} />
             </div>
             <h3 className="text-2xl font-serif font-bold text-vallenato-blue mb-2">Próximamente un nuevo relato...</h3>
             <p className="text-sm text-gray-400 font-serif italic">Estamos documentando nuevas crónicas para preservar la historia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegendaryTales;
