import React, { useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  MessageSquareQuote,
  User,
  Headphones,
  Disc,
} from 'lucide-react';
import { AudioItem } from '../types.ts';
import AudioEqualizer from './AudioEqualizer.tsx';

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

        {/* Cuerpo del Dock */}
        <div className="px-3.5 py-2.5 md:px-5 md:py-3.5 flex items-center justify-between gap-3 md:gap-6">
          
          {/* Izquierda: Canción, Autor y Micro-ondas */}
          <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0 flex-1 sm:max-w-xs md:max-w-sm">
            {/* Vinilo decorativo giratorio */}
            <div className="relative shrink-0 hidden xs:block">
              <div
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full bg-stone-900 border border-vallenato-mustard/40 flex items-center justify-center shadow-md ${
                  isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                }`}
              >
                <Disc size={20} className="text-vallenato-mustard/80" />
                <span className="absolute w-2 h-2 rounded-full bg-vallenato-red" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h5 className="text-[12px] md:text-sm font-serif font-bold truncate text-white leading-tight">
                  {currentAudio.titulo}
                </h5>
                <AudioEqualizer isPlaying={isPlaying} size="xs" color="bg-vallenato-mustard" className="shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-vallenato-mustard/90 font-bold uppercase tracking-wider truncate">
                <User size={10} className="shrink-0 text-vallenato-mustard" />
                <span className="truncate">{currentAudio.autor}</span>
                {currentAudio.numero && (
                  <span className="hidden sm:inline-block text-[8px] bg-vallenato-red/80 text-white px-1.5 py-0.2 rounded font-black ml-1">
                    #{currentAudio.numero}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Centro: Controles de Reproducción y Tiempos */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="flex items-center gap-1.5 md:gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={!canGoPrev}
                aria-label="Pista anterior"
                className={`p-1.5 rounded-full text-white/70 hover:text-white transition-all transform hover:scale-110 active:scale-95 ${
                  canGoPrev ? 'cursor-pointer' : 'opacity-25 cursor-not-allowed'
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
                className={`p-1.5 rounded-full text-white/70 hover:text-white transition-all transform hover:scale-110 active:scale-95 ${
                  canGoNext ? 'cursor-pointer' : 'opacity-25 cursor-not-allowed'
                }`}
              >
                <SkipForward size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Timestamps compactos */}
            <div className="hidden xs:flex items-center gap-1.5 text-[9px] font-mono text-white/50 tracking-tighter">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Derecha: Botón de Historia y Cerrar */}
          <div className="flex items-center justify-end gap-1.5 md:gap-2.5 shrink-0">
            {/* Botón de Comentario */}
            <button
              type="button"
              onClick={onToggleStoryCard}
              title={showStoryCard ? 'Ocultar comentario' : 'Ver comentario de la canción'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                showStoryCard
                  ? 'bg-vallenato-red text-white shadow-md scale-105'
                  : 'bg-white/10 text-white hover:bg-vallenato-mustard hover:text-vallenato-blue'
              }`}
            >
              <MessageSquareQuote size={16} />
              <span className="hidden sm:inline text-[10px] uppercase tracking-wider">
                {showStoryCard ? 'Ocultar comentario' : 'Comentario'}
              </span>
            </button>

            {/* Cerrar Reproductor */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar reproductor"
              title="Cerrar reproductor"
              className="p-1.5 md:p-2 rounded-xl text-white/40 hover:text-vallenato-red hover:bg-white/5 transition-all transform hover:rotate-90 active:scale-90"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PersistentPlayerDock;
