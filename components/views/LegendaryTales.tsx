
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StoryItem } from '../../types.ts';
import { fetchRelatos } from '../../services/supabaseClient.ts';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Clock, BookOpen, ArrowRight, Loader2, AlertCircle, Volume2, Award, Headphones, Info, Sparkles, X, Settings2, Star, Quote, Timer, Gauge } from 'lucide-react';
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

  const LATENCY_OFFSET = -0.30; 

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

  // Lógica de coexistencia: si el App inicia música, pausamos el relato
  useEffect(() => {
    const handleMusicPlay = () => {
      if (isPlaying) {
        setIsPlaying(false);
      }
    };
    window.addEventListener('musicPlay', handleMusicPlay);
    return () => window.removeEventListener('musicPlay', handleMusicPlay);
  }, [isPlaying]);

  const storyData = useMemo(() => {
    if (!selectedStory) return { paragraphs: [], totalWeight: 0, wordWeights: [] };
    
    let globalIdx = 0;
    let totalWeight = 0;
    const wordWeights: { index: number; cumulativeWeight: number; paragraphIndex: number; text: string }[] = [];

    const paragraphs = selectedStory.contenido.split(/\n\s*\n/).filter(p => p.trim()).map((p, pIdx) => {
      if (pIdx > 0) totalWeight += 180;

      const pWords = p.split(/\s+/).filter(w => w.trim()).map(word => {
        let weight = Math.max(word.length * 1.8, 12);
        
        if (word.endsWith('.') || word.endsWith(':')) weight += 80; 
        else if (word.endsWith(';') || word.endsWith('...')) weight += 50;
        else if (word.endsWith(',')) weight += 35;
        else if (word.endsWith('?') || word.endsWith('!')) weight += 60;
        
        totalWeight += weight;
        const currentIdx = globalIdx++;
        
        wordWeights.push({
          index: currentIdx,
          cumulativeWeight: totalWeight,
          paragraphIndex: pIdx,
          text: word
        });

        return { text: word, index: currentIdx, weight };
      });
      return { words: pWords, paragraphIndex: pIdx };
    });

    return { paragraphs, totalWeight, wordWeights };
  }, [selectedStory]);

  const findActiveWordIndex = (targetWeight: number) => {
    const arr = storyData.wordWeights;
    if (!arr || arr.length === 0) return -1;
    
    let start = 0; 
    let end = arr.length - 1;
    let ans = -1;

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
      
      if (duration > 0 && storyData.totalWeight > 0) {
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
      window.dispatchEvent(new CustomEvent('talePlay'));
      requestRef.current = requestAnimationFrame(syncPlayback);
    } else {
      window.dispatchEvent(new CustomEvent('talePause'));
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
    if (audioRef.current && audioRef.current.duration && storyData.totalWeight > 0) {
      const word = storyData.wordWeights[index];
      if (word) {
        const prevWeight = index > 0 ? storyData.wordWeights[index - 1].cumulativeWeight : 0;
        const weightProgress = prevWeight / storyData.totalWeight;
        audioRef.current.currentTime = weightProgress * audioRef.current.duration;
        setCurrentWordIndex(index);
        if (!isPlaying) setIsPlaying(true);
      }
    }
  };

  const progressValue = useMemo(() => {
    if (storyData.totalWeight > 0 && currentWordIndex >= 0 && storyData.wordWeights[currentWordIndex]) {
      return Math.round((storyData.wordWeights[currentWordIndex].cumulativeWeight / storyData.totalWeight) * 100);
    }
    return 0;
  }, [currentWordIndex, storyData]);

  const currentParagraphIndex = currentWordIndex >= 0 
    ? storyData.wordWeights[currentWordIndex]?.paragraphIndex 
    : -1;

  const getWordClasses = (index: number) => {
    const baseClasses = "inline-block mr-[0.3em] px-1 rounded transition-all duration-300 cursor-pointer select-none";
    
    if (!isPlaying) {
      if (index === currentWordIndex) {
         return `${baseClasses} bg-vallenato-mustard/30 text-vallenato-blue font-bold border-b-2 border-vallenato-mustard`;
      }
      return `${baseClasses} text-vallenato-blue opacity-100`;
    }

    const wordInfo = storyData.wordWeights[index];
    const isSameParagraph = wordInfo?.paragraphIndex === currentParagraphIndex;
    const diff = Math.abs(index - currentWordIndex);

    if (index === currentWordIndex) {
      return `${baseClasses} bg-vallenato-mustard text-vallenato-blue font-bold scale-110 shadow-[0_5px_15px_rgba(234,170,0,0.5)] relative z-20 ring-2 ring-vallenato-mustard/30`;
    } else if (diff === 1) {
      return `${baseClasses} text-vallenato-blue font-bold opacity-100 scale-105 z-10`;
    } else if (diff === 2) {
      return `${baseClasses} text-vallenato-blue font-semibold opacity-70`;
    } else if (isSameParagraph) {
      return `${baseClasses} text-vallenato-blue/40`;
    } else {
      return `${baseClasses} text-vallenato-blue/10 blur-[0.6px]`;
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
      <>
        <div className="min-h-screen bg-vallenato-beige animate-fade-in-up pb-32">
          {selectedStory.audio_url && (
            <audio 
              ref={audioRef} 
              src={selectedStory.audio_url} 
              onEnded={() => setIsPlaying(false)}
              preload="none"
            />
          )}

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
                     <h3 className="text-white font-serif text-xl font-bold">Instrucciones de Lectura</h3>
                  </div>
                  <div className="p-6 space-y-6">
                     <div className="flex gap-4 items-center group">
                        <div className="bg-vallenato-mustard p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                          <Play size={14} className="text-vallenato-blue fill-current" />
                        </div>
                        <p className="text-gray-700 text-sm font-medium leading-tight">Pulsa <b>Play</b> para iniciar la experiencia sonora.</p>
                     </div>
                     
                     <div className="flex gap-4 items-center group">
                        <div className="bg-vallenato-red p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                          <Pause size={14} className="text-white fill-current" />
                        </div>
                        <p className="text-gray-700 text-sm font-medium leading-tight">Puedes <b>pausar</b> el relato en cualquier momento desde los controles laterales.</p>
                     </div>

                     <div className="flex gap-4 items-center group">
                        <div className="bg-vallenato-blue p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                          <Gauge size={14} className="text-vallenato-mustard" />
                        </div>
                        <p className="text-gray-700 text-sm font-medium leading-tight">Ajusta el <b>ritmo de la lectura</b> para adaptarlo a tu velocidad preferida.</p>
                     </div>

                     <div className="pt-4">
                        <Button fullWidth onClick={() => setShowInstructions(false)} className="text-xs py-4 shadow-gold">
                           Comenzar Crónica
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
              >
                {isPlaying ? <Pause size={isMobile ? 20 : 24} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
              <div className={`w-0.5 h-10 md:h-12 mt-2 transition-opacity duration-500 bg-gradient-to-b from-vallenato-mustard to-transparent ${isPlaying ? 'opacity-60' : 'opacity-20'}`}></div>
            </div>
          )}

          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-vallenato-mustard/20 shadow-sm overflow-hidden">
            <div className="absolute bottom-0 left-0 h-1 bg-vallenato-mustard/20 w-full">
              <div 
                className="h-full bg-vallenato-mustard transition-all duration-500 shadow-[0_0_10px_rgba(234,170,0,0.8)]" 
                style={{ width: `${progressValue}%` }}
              />
            </div>

            <div className="container mx-auto p-4 flex items-center justify-between">
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
                <div className="flex items-center gap-2 text-vallenato-blue/40 font-mono text-[10px] bg-vallenato-blue/5 px-3 py-1.5 rounded-full">
                  <Volume2 size={12} className={isPlaying ? "animate-pulse text-vallenato-red" : ""} /> 
                  <span className="font-bold">{progressValue}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-8">
                <div className="space-y-6">
                  <div className="relative rounded-[1.5rem] overflow-hidden shadow-xl border-2 border-white w-2/3 mx-auto lg:w-full">
                    <img src={selectedStory.imagen} alt={selectedStory.titulo} className="w-full h-auto aspect-square object-cover" loading="lazy" />
                  </div>

                  <div className="bg-vallenato-blue text-white p-6 rounded-[2rem] shadow-xl space-y-6 border border-white/5 max-w-[320px] mx-auto lg:max-w-none">
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Controles de Escucha</span>
                      <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold">
                         {isPlaying ? (
                            <div className="flex gap-0.5 items-end h-2.5 mb-0.5 mr-1">
                               {[0.6, 0.9, 0.7, 1.1].map((d, i) => (
                                 <div key={i} className="w-0.5 bg-vallenato-mustard rounded-full" style={{ animation: `wave ${d}s infinite ease-in-out` }}></div>
                               ))}
                            </div>
                         ) : (
                            <Timer size={10} className="text-vallenato-mustard" />
                         )}
                         {progressValue}%
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-2">
                      <button onClick={() => skipSeconds(-5)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all active:scale-90 text-white/60 hover:text-white" title="Retroceder 5s"><SkipBack size={20} /></button>
                      <button 
                        onClick={togglePlay} 
                        className={`p-5 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 ${isPlaying ? 'bg-vallenato-red' : 'bg-vallenato-mustard text-vallenato-blue'}`}
                      >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                      </button>
                      <button onClick={() => skipSeconds(5)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all active:scale-90 text-white/60 hover:text-white" title="Adelantar 5s"><SkipForward size={20} /></button>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center gap-2">
                         <Gauge size={14} className="text-vallenato-mustard" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ritmo de Lectura</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`flex-1 min-w-[45px] py-1.5 rounded-lg font-bold text-[10px] transition-all shadow-sm active:scale-90 ${
                              playbackSpeed === speed 
                                ? 'bg-white text-vallenato-blue scale-105 shadow-gold font-bold ring-1 ring-vallenato-mustard' 
                                : 'bg-vallenato-mustard/20 text-white/60 hover:bg-vallenato-mustard/40 hover:text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-vallenato-mustard/10 flex items-center gap-4 group">
                    <div className="bg-vallenato-blue/5 p-3 rounded-xl text-vallenato-blue group-hover:bg-vallenato-blue group-hover:text-white transition-colors">
                      <Info size={20} />
                    </div>
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-vallenato-blue/40 block">Tip del Maestro</span>
                      <p className="text-[10px] font-serif italic text-vallenato-blue/80">"Pulsa cualquier palabra para saltar directamente a ese momento del relato."</p>
                    </div>
                  </div>
                </div>
              </aside>

              <main className="lg:col-span-8 relative">
                <div className="max-w-3xl mx-auto">
                  <header className="mb-12">
                     <div className="flex items-center gap-3 mb-4">
                        <span className="text-vallenato-red font-bold uppercase tracking-[0.4em] text-xs">Relatos Legendarios</span>
                        <div className="h-[1px] bg-vallenato-red/20 flex-grow"></div>
                     </div>
                     <h1 className="text-4xl md:text-5xl font-serif text-vallenato-blue font-bold leading-tight mb-6">{selectedStory.titulo}</h1>
                     <p className="text-xl text-vallenato-blue font-serif italic border-l-4 border-vallenato-mustard pl-6 leading-relaxed opacity-90 transition-all duration-700">
                       {selectedStory.subtitulo}
                     </p>
                  </header>

                  <div className="prose prose-xl font-serif text-vallenato-blue leading-[2.4] relative">
                     {storyData.paragraphs.map((para, pIdx) => (
                       <p 
                          key={pIdx} 
                          className={`mb-16 text-justify transition-opacity duration-1000 ${currentParagraphIndex !== -1 && currentParagraphIndex !== pIdx ? 'opacity-30 grayscale-[0.6]' : 'opacity-100'}`}
                       >
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

                  <div className="mt-10 py-8 text-center border-t border-vallenato-mustard/10">
                     <div className="mb-6">
                        <h4 className="text-vallenato-blue font-calligraphy text-5xl md:text-7xl tracking-wide leading-none">
                          Relato por: Álvaro González
                        </h4>
                     </div>
                     <Button variant="outline" onClick={() => setSelectedStory(null)} className="min-w-[240px]">
                        Volver a la Galería de Relatos
                     </Button>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes wave {
            0%, 100% { height: 4px; transform: scaleY(1); opacity: 0.5; }
            50% { height: 18px; transform: scaleY(1.2); opacity: 1; }
          }
        `}</style>
      </>
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
                  className="w-full h-auto object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                  loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-vallenato-blue via-transparent to-transparent opacity-60"></div>
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
