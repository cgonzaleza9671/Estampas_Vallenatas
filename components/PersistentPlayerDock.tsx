import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  MessageSquareQuote,
  User,
  Mic2,
  Headphones,
  Disc,
} from 'lucide-react';
import { AudioItem } from '../types.ts';
import AudioEqualizer from './AudioEqualizer.tsx';

const AccordionIcon: React.FC<{ size?: number; className?: string }> = ({ size = 10, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="4" width="4" height="16" rx="1" />
    <rect x="18" y="4" width="4" height="16" rx="1" />
    <path d="M6 5l3 2v10l-3 2" />
    <path d="M9 7l3-2v14l-3-2" />
    <path d="M12 5l3 2v10l-3 2" />
    <path d="M15 7l3-2v14l-3-2" />
  </svg>
);

interface PersistentPlayerDockProps {
  currentAudio: AudioItem;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isTaleActive: boolean;
  showStoryCard: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onToggleStoryCard: () => void;
  onClose: () => void;
}

export const PersistentPlayerDock: React.FC<PersistentPlayerDockProps> = ({
  currentAudio,
  isPlaying,
  currentTime,
  duration,
  isTaleActive,
  showStoryCard,
  canGoNext,
  canGoPrev,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleStoryCard,
  onClose,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const metaContainerRef = useRef<HTMLDivElement>(null);
  const metaContentRef = useRef<HTMLDivElement>(null);
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const commentTextRef = useRef<HTMLSpanElement>(null);
  const [overflowPx, setOverflowPx] = useState<number>(0);
  const [metaOverflowPx, setMetaOverflowPx] = useState<number>(0);
  const [commentOverflowPx, setCommentOverflowPx] = useState<number>(0);

  useEffect(() => {
    const updateDistance = () => {
      if (titleContainerRef.current && titleTextRef.current) {
        const diff = titleTextRef.current.scrollWidth - titleContainerRef.current.clientWidth;
        setOverflowPx(diff > 4 ? diff : 0);
      }
      if (metaContainerRef.current && metaContentRef.current) {
        const diffMeta = metaContentRef.current.scrollWidth - metaContainerRef.current.clientWidth;
        setMetaOverflowPx(diffMeta > 4 ? diffMeta : 0);
      }
      if (commentContainerRef.current && commentTextRef.current) {
        const diffComment = commentTextRef.current.scrollWidth - commentContainerRef.current.clientWidth;
        setCommentOverflowPx(diffComment > 2 ? diffComment : 0);
      }
    };

    const timer = setTimeout(updateDistance, 80);
    window.addEventListener('resize', updateDistance);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDistance);
    };
  }, [currentAudio.titulo, currentAudio.autor, currentAudio.cantante, currentAudio.acordeonero, currentAudio.id, showStoryCard]);

  const marqueeDuration = Math.max(5, Math.min(14, 3 + overflowPx * 0.05));
  const metaMarqueeDuration = Math.max(7, Math.min(18, 5 + metaOverflowPx * 0.04));
  const commentMarqueeDuration = Math.max(4, Math.min(8, 2.5 + commentOverflowPx * 0.08));

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside
      aria-label="Reproductor de audio persistente"
      className={`fixed bottom-3 md:bottom-6 left-0 right-0 mx-auto w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] max-w-4xl z-[90] transition-all duration-500 ${
        isTaleActive ? 'opacity-40 grayscale-[0.6] scale-[0.98]' : 'opacity-100'
      }`}
    >
      {/* Aviso flotante cuando el relato toma control */}
      {isTaleActive && (
        <div className="absolute -top-9 left-0 right-0 mx-auto w-fit bg-vallenato-red text-white text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl animate-bounce border border-white/20 whitespace-nowrap">
          <Headphones size={12} /> Música en pausa por relato
        </div>
      )}

      {/* Dock Container con estilo Stripe / Linear */}
      <div className="relative bg-[#002244]/95 backdrop-blur-2xl border border-white/15 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_0_1px_rgba(234,170,0,0.25)] overflow-hidden">
        
        {/* Línea de progreso interactiva superior */}
        <div
          ref={progressBarRef}
          role="slider"
          aria-label="Línea de tiempo del audio"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration || 0)}
          aria-valuenow={Math.round(currentTime || 0)}
          aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5));
            if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5));
          }}
          className="relative h-1.5 bg-white/10 group cursor-pointer w-full transition-all hover:h-2"
        >
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            aria-label="Barra de desplazamiento de audio"
          />
          <div
            className="h-full bg-gradient-to-r from-vallenato-mustard via-amber-400 to-vallenato-red transition-all duration-100 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* Cuerpo del Dock: 3 zonas estructuradas con controles centrales 100% estáticos */}
        <div className="relative px-3.5 py-2.5 md:px-5 md:py-3.5 flex items-center justify-between gap-3 md:gap-6 min-h-[56px] md:min-h-[64px]">
          
          {/* Izquierda: Canción (en móvil con marquee) y Canción + Autor + Voz + Acordeón completos */}
          <div className="flex items-center gap-2 md:gap-3.5 min-w-0 flex-1 max-w-[calc(50%-48px)] sm:max-w-[calc(50%-65px)] md:max-w-[calc(50%-85px)] z-10">
            {/* Vinilo decorativo giratorio (oculto en pantallas extra pequeñas para maximizar lectura del título) */}
            <div className="relative shrink-0 hidden xs:block">
              <div
                className={`w-8 h-8 md:w-11 md:h-11 rounded-full bg-stone-900 border border-vallenato-mustard/40 flex items-center justify-center shadow-md ${
                  isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                }`}
              >
                <Disc size={18} className="text-vallenato-mustard/80 md:w-5 md:h-5" />
                <span className="absolute w-2 h-2 rounded-full bg-vallenato-red" />
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1 justify-center">
              {/* Título de la Canción con Número Fijo a la Izquierda y auto-scroll marquee para títulos largos */}
              <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                {/* Número de la canción en posición fija a la izquierda */}
                {currentAudio.numero && (
                  <span
                    className="shrink-0 inline-flex items-center justify-center text-[9px] md:text-[10px] font-mono font-black text-white bg-vallenato-red/90 px-1.5 py-0.5 rounded shadow-xs tracking-wider select-none"
                    title={"Canción #" + currentAudio.numero}
                  >
                    #{currentAudio.numero}
                  </span>
                )}
                <div 
                  ref={titleContainerRef} 
                  className="min-w-0 flex-1 overflow-hidden relative"
                  style={{
                    maskImage: overflowPx > 0 ? 'linear-gradient(to right, black calc(100% - 14px), transparent 100%)' : 'none',
                    WebkitMaskImage: overflowPx > 0 ? 'linear-gradient(to right, black calc(100% - 14px), transparent 100%)' : 'none',
                  }}
                >
                  <h5 
                    ref={titleTextRef}
                    style={
                      overflowPx > 0
                        ? ({
                            '--marquee-distance': `-${overflowPx + 8}px`,
                            animation: `player-dock-marquee ${marqueeDuration}s ease-in-out infinite`,
                          } as React.CSSProperties)
                        : undefined
                    }
                    className={`text-[12px] sm:text-[13px] md:text-sm font-serif font-bold text-white leading-tight ${
                      overflowPx > 0 ? 'inline-block whitespace-nowrap' : 'truncate'
                    }`}
                    title={currentAudio.titulo}
                  >
                    {currentAudio.titulo}
                  </h5>
                </div>
                <AudioEqualizer isPlaying={isPlaying} size="xs" color="bg-vallenato-mustard" className="shrink-0" />
              </div>

              {/* Fila de Micro-Insignias: Autor | Voz | Acordeón sin truncado brusco (con auto-marquee suave si excede espacio) */}
              <div 
                ref={metaContainerRef}
                className="hidden sm:block min-w-0 flex-1 overflow-hidden relative mt-1"
                style={{
                  maskImage: metaOverflowPx > 0 ? 'linear-gradient(to right, black calc(100% - 14px), transparent 100%)' : 'none',
                  WebkitMaskImage: metaOverflowPx > 0 ? 'linear-gradient(to right, black calc(100% - 14px), transparent 100%)' : 'none',
                }}
              >
                <div
                  ref={metaContentRef}
                  style={
                    metaOverflowPx > 0
                      ? ({
                          '--meta-marquee-distance': `-${metaOverflowPx + 10}px`,
                          animation: `player-dock-meta-marquee ${metaMarqueeDuration}s ease-in-out infinite`,
                        } as React.CSSProperties)
                      : undefined
                  }
                  className={`flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] leading-none ${
                    metaOverflowPx > 0 ? 'inline-flex whitespace-nowrap' : 'flex-wrap'
                  }`}
                >
                  {/* Autor */}
                  <span
                    className="inline-flex items-center gap-1 text-vallenato-mustard/90 font-bold uppercase tracking-wider shrink-0"
                    title={`Autor: ${currentAudio.autor}`}
                  >
                    <User size={10} className="shrink-0 text-vallenato-mustard" />
                    <span className="whitespace-nowrap">{currentAudio.autor}</span>
                  </span>

                  {/* Cantante / Voz */}
                  {currentAudio.cantante && (
                    <>
                      <span className="text-white/20 select-none text-[9px] shrink-0">|</span>
                      <span
                        className="inline-flex items-center gap-1 text-white/80 font-medium shrink-0"
                        title={`Voz: ${currentAudio.cantante}`}
                      >
                        <Mic2 size={10} className="shrink-0 text-vallenato-red" />
                        <span className="whitespace-nowrap">{currentAudio.cantante}</span>
                      </span>
                    </>
                  )}

                  {/* Acordeonero */}
                  {currentAudio.acordeonero && (
                    <>
                      <span className="text-white/20 select-none text-[9px] shrink-0">|</span>
                      <span
                        className="inline-flex items-center gap-1 text-amber-200/90 font-medium shrink-0"
                        title={`Acordeón: ${currentAudio.acordeonero}`}
                      >
                        <AccordionIcon size={10} className="shrink-0 text-vallenato-mustard" />
                        <span className="whitespace-nowrap">{currentAudio.acordeonero}</span>
                      </span>
                    </>
                  )}


                </div>
              </div>
            </div>
          </div>

          {/* Centro: Controles de Reproducción y Tiempos - 100% Estáticos en el Centro Absoluto */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 md:gap-1 shrink-0 z-20 pointer-events-auto">
            <div className="flex items-center gap-1.5 md:gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={!canGoPrev}
                aria-label="Pista anterior"
                className={`p-1.5 rounded-full text-white/70 hover:text-white transition-colors transform active:scale-95 ${
                  canGoPrev ? 'cursor-pointer hover:scale-110' : 'opacity-25 cursor-not-allowed'
                }`}
              >
                <SkipBack size={18} className="md:w-5 md:h-5" />
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                className="bg-vallenato-mustard text-vallenato-blue p-2.5 md:p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(234,170,0,0.5)] shrink-0"
              >
                {isPlaying ? (
                  <Pause size={18} fill="currentColor" className="md:w-5 md:h-5" />
                ) : (
                  <Play size={18} fill="currentColor" className="ml-0.5 md:w-5 md:h-5" />
                )}
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={!canGoNext}
                aria-label="Pista siguiente"
                className={`p-1.5 rounded-full text-white/70 hover:text-white transition-colors transform active:scale-95 ${
                  canGoNext ? 'cursor-pointer hover:scale-110' : 'opacity-25 cursor-not-allowed'
                }`}
              >
                <SkipForward size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Timestamps compactos */}
            <div className="hidden xs:flex items-center gap-1 text-[9px] font-mono text-white/50 tracking-tighter select-none">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Derecha: Botón de Comentario y Cerrar - Dimensiones Fijas para que NADA se mueva */}
          <div className="flex items-center justify-end gap-1.5 md:gap-2.5 shrink-0 z-10 w-[78px] xs:w-[84px] sm:w-[175px] md:w-[190px]">
            {/* Botón de Comentario con Ancho Fijo para Evitar Desplazamientos */}
            <button
              type="button"
              onClick={onToggleStoryCard}
              title={showStoryCard ? 'Ocultar comentario' : 'Ver comentario de la canción'}
              className={`flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 h-9 w-9 sm:w-[136px] md:w-[146px] px-2 md:px-3 overflow-hidden ${
                showStoryCard
                  ? 'bg-vallenato-red text-white shadow-md ring-1 ring-white/20'
                  : 'bg-white/10 text-white hover:bg-vallenato-mustard hover:text-vallenato-blue'
              }`}
            >
              <MessageSquareQuote size={16} className="shrink-0" />
              <div
                ref={commentContainerRef}
                className="hidden sm:block min-w-0 flex-1 overflow-hidden relative"
                style={{
                  maskImage: commentOverflowPx > 0 ? 'linear-gradient(to right, black calc(100% - 10px), transparent 100%)' : 'none',
                  WebkitMaskImage: commentOverflowPx > 0 ? 'linear-gradient(to right, black calc(100% - 10px), transparent 100%)' : 'none',
                }}
              >
                <span
                  ref={commentTextRef}
                  style={
                    commentOverflowPx > 0
                      ? ({
                          '--comment-marquee-distance': `-${commentOverflowPx + 6}px`,
                          animation: `player-dock-comment-marquee ${commentMarqueeDuration}s ease-in-out infinite`,
                        } as React.CSSProperties)
                      : undefined
                  }
                  className={`text-[10px] uppercase tracking-wider block whitespace-nowrap ${
                    commentOverflowPx > 0 ? 'text-left' : 'text-center'
                  }`}
                >
                  {showStoryCard ? 'Ocultar comentario' : 'Comentario'}
                </span>
              </div>
            </button>

            {/* Cerrar Reproductor */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar reproductor"
              title="Cerrar reproductor"
              className="p-1.5 md:p-2 rounded-xl text-white/40 hover:text-vallenato-red hover:bg-white/5 transition-all transform hover:rotate-90 active:scale-90 shrink-0"
            >
              <X size={18} />
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes player-dock-marquee {
          0%, 20% {
            transform: translateX(0);
          }
          65%, 85% {
            transform: translateX(var(--marquee-distance, 0px));
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes player-dock-meta-marquee {
          0%, 20% {
            transform: translateX(0);
          }
          65%, 85% {
            transform: translateX(var(--meta-marquee-distance, 0px));
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes player-dock-comment-marquee {
          0%, 20% {
            transform: translateX(0);
          }
          65%, 85% {
            transform: translateX(var(--comment-marquee-distance, 0px));
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
};

export default PersistentPlayerDock;
