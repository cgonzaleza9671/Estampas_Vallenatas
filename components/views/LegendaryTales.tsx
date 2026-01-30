
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StoryItem } from '../../types.ts';
import { fetchRelatos } from '../../services/supabaseClient.ts';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Clock, BookOpen, ArrowRight, Loader2, AlertCircle, Volume2, Award, Headphones, Info, Sparkles, X, Settings2, Star, Quote, Timer, Gauge, ChevronDown } from 'lucide-react';
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
    const baseClasses = "inline-block mr-[0.3em] px-1 rounded transition-all duration-700 cursor-pointer select-none relative";
    
    if (!isPlaying) {
      if (index === currentWordIndex) {
         return `${baseClasses} text-vallenato-blue font-bold border-b-2 border-vallenato-mustard/30`;
      }
      return `${baseClasses} text-vallenato-blue opacity-100`;
    }

    const wordInfo = storyData.wordWeights[index];
    const isSameParagraph = wordInfo?.paragraphIndex === currentParagraphIndex;
    const diff = Math.abs(index - currentWordIndex);

    if (index === currentWordIndex) {
      return `${baseClasses} bg-vallenato-mustard text-vallenato-blue font-bold scale-110 shadow-[0_10px_30px_rgba(234,170,0,0.6)] z-20 ring-2 ring-vallenato-mustard/50`;
    } else if (diff === 1) {
      return `${baseClasses} text-vallenato-blue font-bold opacity-100 scale-105 z-10`;
    } else if (isSameParagraph) {
      return `${baseClasses} text-vallenato-blue/40`;
    } else {
      return `${baseClasses} text-vallenato-blue/10 blur-[1px]`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-vallenato-blue">
        <Loader2 size={48} className="animate-spin mb-4 text-vallenato-mustard" />
        <p className="font-serif italic text-lg">Invocando el espíritu de los juglares...</p>
      </div>
    );
  }

  if (selectedStory) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] animate-fade-in pb-40">
        {selectedStory.audio_url && (
          <audio 
            ref={audioRef} 
            src={selectedStory.audio_url} 
            onEnded={() => setIsPlaying(false)}
            preload="none"
          />
        )}

        <div className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-vallenato-mustard/10 h-16 md:h-20 flex items-center">
           <div className="container mx-auto px-6 flex items-center justify-between">
              <button 
                onClick={() => setSelectedStory(null)}
                className="flex items-center gap-3 text-vallenato-blue hover:text-vallenato-red transition-all font-bold uppercase text-[10px] tracking-[0.2em] group"
              >
                <div className="p-2 rounded-full border border-vallenato-blue/10 group-hover:border-vallenato-red transition-colors">
                  <ArrowLeft size={16} />
                </div>
                <span className="hidden sm:inline">Regresar al Archivo</span>
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-vallenato-red mb-1 text-center">Crónica Digital</span>
                <h2 className="text-sm font-serif font-bold text-vallenato-blue truncate max-w-[200px] md:max-w-xs text-center">{selectedStory.titulo}</h2>
              </div>

              <div className="bg-vallenato-blue/5 rounded-full px-4 py-2 flex items-center gap-3">
                <Volume2 size={14} className={isPlaying ? "text-vallenato-red animate-pulse" : "text-vallenato-blue/30"} />
                <span className="text-[10px] font-mono font-bold text-vallenato-blue">{progressValue}%</span>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 h-[2px] bg-vallenato-mustard/20 w-full">
              <div className="h-full bg-vallenato-mustard transition-all duration-500 shadow-[0_0_10px_#EAAA00]" style={{ width: `${progressValue}%` }}></div>
           </div>
        </div>

        {/* Hero Section Cinematográfica con Efectos de Entrada */}
        <section className="relative w-full h-[55vh] md:h-[75vh] overflow-hidden">
           <img src={selectedStory.imagen} alt={selectedStory.titulo} className="w-full h-full object-cover transform scale-105" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-[#FDFCF7]"></div>
           <div className="absolute inset-0 flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
              <div className="container mx-auto max-w-4xl">
                 <h1 className="text-5xl md:text-8xl font-serif text-white font-bold leading-tight mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] animate-fade-in-up tracking-tight">
                    <span className="relative inline-block">
                      {selectedStory.titulo}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none"></span>
                    </span>
                 </h1>
                 <p className="text-base md:text-xl font-sans font-extrabold text-vallenato-mustard uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-reveal-blur">
                    {selectedStory.subtitulo}
                 </p>
              </div>
           </div>
        </section>

        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-vallenato-dark/60 backdrop-blur-md animate-in fade-in duration-500">
             <div className="bg-white rounded-[3rem] shadow-2xl max-w-sm w-full overflow-hidden border border-vallenato-mustard/20 animate-fade-in-up">
                <div className="p-8 text-center bg-vallenato-blue relative">
                   <button onClick={() => setShowInstructions(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X size={20}/></button>
                   <div className="bg-vallenato-mustard p-3 rounded-full w-fit mx-auto mb-4 shadow-gold">
                      <Headphones className="text-vallenato-blue" size={24} />
                   </div>
                   <h3 className="text-white font-serif text-2xl font-bold">Instrucciones de Lectura</h3>
                </div>
                <div className="p-8 space-y-6">
                   <div className="flex gap-4 items-center">
                      <div className="bg-vallenato-mustard/10 p-2.5 rounded-2xl text-vallenato-mustard"><Play size={16} fill="currentColor" /></div>
                      <p className="text-vallenato-blue/70 text-sm font-medium leading-tight">Pulsa <b>Play</b> para iniciar la experiencia sonora.</p>
                   </div>
                   <div className="flex gap-4 items-center">
                      <div className="bg-vallenato-red/10 p-2.5 rounded-2xl text-vallenato-red"><Pause size={16} fill="currentColor" /></div>
                      <p className="text-vallenato-blue/70 text-sm font-medium leading-tight">Puedes <b>pausar</b> con los controles o el botón que sigue el texto.</p>
                   </div>
                   <div className="flex gap-4 items-center">
                      <div className="bg-vallenato-blue/10 p-2.5 rounded-2xl text-vallenato-blue"><Gauge size={16} /></div>
                      <p className="text-vallenato-blue/70 text-sm font-medium leading-tight">Ajusta la <b>velocidad</b> en el panel inferior para seguir tu propio ritmo.</p>
                   </div>
                   <div className="pt-4">
                      <Button fullWidth onClick={() => setShowInstructions(false)} className="shadow-gold py-4 text-xs">Comenzar Inmersión</Button>
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
              left: isMobile ? 'auto' : 'calc(50% + 420px)',
              right: isMobile ? '20px' : 'auto',
              transition: 'top 0.5s cubic-bezier(0.16, 1, 0.3, 1)' 
            }}
            className="flex flex-col items-center z-50 pointer-events-none"
          >
            <button
              onClick={togglePlay}
              className={`
                pointer-events-auto p-4 md:p-5 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95
                ${isPlaying ? 'bg-vallenato-red text-white' : 'bg-vallenato-mustard text-vallenato-blue shadow-gold'}
              `}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <div className={`w-0.5 h-16 mt-3 bg-gradient-to-b from-vallenato-mustard/60 to-transparent transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        )}

        <main className="container mx-auto px-6 relative mt-16 md:mt-24">
           <div className="max-w-3xl mx-auto">
              <div className="prose prose-2xl font-serif text-vallenato-blue leading-[2.4] selection:bg-vallenato-mustard/30 relative">
                 <div className="absolute -left-16 top-0 hidden xl:block opacity-[0.03] text-vallenato-blue pointer-events-none">
                    <Quote size={120} />
                 </div>

                 {storyData.paragraphs.map((para, pIdx) => (
                   <p 
                    key={pIdx} 
                    className={`mb-5 text-justify transition-all duration-1000 
                      ${isPlaying && currentParagraphIndex !== -1 && currentParagraphIndex !== pIdx 
                        ? 'opacity-10 blur-[2px] scale-[0.98]' 
                        : 'opacity-100 scale-100 blur-0'
                      }
                    `}
                   >
                     {pIdx === 0 && (
                       <span className="float-left text-7xl md:text-8xl font-serif font-bold text-vallenato-mustard leading-none mr-4 mt-2 drop-shadow-sm">
                         {para.words[0]?.text.charAt(0)}
                       </span>
                     )}
                     
                     {para.words.map((word, wIdx) => {
                       const wordText = (pIdx === 0 && wIdx === 0) ? word.text.slice(1) : word.text;
                       return (
                         <span 
                          key={word.index}
                          ref={el => wordsRef.current[word.index] = el}
                          onClick={() => handleWordClick(word.index)}
                          className={getWordClasses(word.index)}
                         >
                           {wordText}
                         </span>
                       );
                     })}
                   </p>
                 ))}
              </div>

              <div className="mt-4 pt-2 border-t border-vallenato-mustard/10 text-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-vallenato-red mb-4 block">Relato por:</span>
                 <h4 className="text-vallenato-blue font-calligraphy text-6xl md:text-8xl leading-none mb-10">Álvaro González Pimienta</h4>
                 <Button variant="outline" onClick={() => setSelectedStory(null)} className="min-w-[240px] hover:border-vallenato-red">
                    Finalizar y Volver a la Galería
                 </Button>
              </div>
           </div>
        </main>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] w-full max-w-lg px-6">
           <div className="bg-vallenato-blue/85 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button onClick={() => skipSeconds(-5)} className="text-white/40 hover:text-white transition-colors" title="Retroceder 5s"><SkipBack size={24} /></button>
                    <button 
                      onClick={togglePlay}
                      className={`p-5 rounded-full shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-vallenato-red' : 'bg-vallenato-mustard text-vallenato-blue'}`}
                    >
                      {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>
                    <button onClick={() => skipSeconds(5)} className="text-white/40 hover:text-white transition-colors" title="Adelantar 5s"><SkipForward size={24} /></button>
                 </div>

                 <div className="h-10 w-[1px] bg-white/10"></div>

                 <div className="flex-grow pl-6">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                          <Timer size={12} className="text-vallenato-mustard" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Progreso y Velocidad de lectura</span>
                       </div>
                       <span className="text-[10px] font-mono font-bold text-vallenato-mustard">{progressValue}%</span>
                    </div>
                    <div className="flex gap-2">
                       {[1, 1.25, 1.5].map(speed => (
                         <button 
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${playbackSpeed === speed ? 'bg-vallenato-mustard text-vallenato-blue' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
                         >
                           {speed}x
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={64} className="text-vallenato-red mb-6" />
        <h2 className="text-2xl font-serif font-bold text-vallenato-blue mb-2">No pudimos cargar los relatos</h2>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vallenato-beige pt-8 pb-32 animate-fade-in-up">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-vallenato-red px-4 py-1.5 rounded-full mb-6 shadow-lg animate-pulse">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Archivo Vivo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-vallenato-blue mb-4 font-bold tracking-tight text-center">Relatos Legendarios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-serif italic text-base md:text-lg text-center">
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
                 <img src={story.imagen} alt={story.titulo} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                 <div className="absolute inset-0 bg-gradient-to-t from-vallenato-blue via-transparent to-transparent opacity-60"></div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-vallenato-mustard p-6 rounded-full text-vallenato-blue shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                       <BookOpen size={32} />
                    </div>
                 </div>
              </div>
              <div className="p-10 flex-grow flex flex-col">
                 <h2 className="text-3xl font-serif text-vallenato-blue font-bold mb-4 group-hover:text-vallenato-red transition-colors">{story.titulo}</h2>
                 <p className="text-vallenato-mustard font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest line-clamp-2 mb-8">{story.subtitulo}</p>
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
      <style>{`
        @keyframes revealBlur {
          0% { filter: blur(10px); opacity: 0; letter-spacing: 0.5em; }
          100% { filter: blur(0); opacity: 1; letter-spacing: normal; }
        }
        .animate-reveal-blur {
          animation: revealBlur 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LegendaryTales;
