
import React, { useEffect, useState, useRef } from 'react';
import { X, Quote, User, ListMusic, Mic2, Loader2, ChevronDown } from 'lucide-react';
import { AudioItem } from '../types';
import { fetchAudioDescription } from '../services/supabaseClient.ts';

interface AudioStoryCardProps {
  audio: AudioItem;
  onClose: () => void;
}

const AudioStoryCard: React.FC<AudioStoryCardProps> = ({ audio, onClose }) => {
  const [description, setDescription] = useState<string>(audio.descripcion || "");
  const [loading, setLoading] = useState(!audio.descripcion);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar descripción si no existe
  useEffect(() => {
    if (!audio.descripcion) {
      setLoading(true);
      fetchAudioDescription(audio.id).then(desc => {
        setDescription(desc);
        setLoading(false);
      });
    } else {
      setDescription(audio.descripcion);
      setLoading(false);
    }
  }, [audio.id, audio.descripcion]);

  // Detectar si el texto es lo suficientemente largo para requerir scroll
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const hasOverflow = scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };

    if (!loading) {
      // Pequeño timeout para esperar a que el DOM se asiente
      const timer = setTimeout(checkOverflow, 100);
      window.addEventListener('resize', checkOverflow);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkOverflow);
      };
    }
  }, [loading, description]);

  return (
    <div className="fixed bottom-28 md:bottom-32 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[70] animate-fade-in-up">
      <div className="bg-[#E5E2D0] backdrop-blur-2xl border-l-8 border-vallenato-mustard shadow-[0_25px_60px_rgba(0,0,0,0.5)] rounded-r-3xl overflow-hidden relative group border border-white/20 transition-all duration-500">
        
        {/* Marca de agua decorativa */}
        <div className="absolute -right-6 -bottom-6 opacity-[0.05] text-vallenato-blue transform rotate-12 pointer-events-none">
          <Quote size={140} />
        </div>

        {/* Botón Cerrar Mejorado */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-vallenato-blue/40 hover:text-vallenato-red transition-all z-20"
          title="Cerrar comentario"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8 relative z-10">
          {/* Metadatos del Audio */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
            <div className="flex items-center gap-1.5 text-vallenato-blue/60">
              <User size={12} className="shrink-0" />
              <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Autor: {audio.autor}</span>
            </div>
            <div className="flex items-center gap-1.5 text-vallenato-red/60">
              <Mic2 size={12} className="shrink-0" />
              <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Voz: {audio.cantante}</span>
            </div>
          </div>

          <div className="relative">
            <Quote size={24} className="text-vallenato-red/10 absolute -left-3 -top-3" />
            <h4 className="text-vallenato-blue font-serif text-xl md:text-2xl font-bold leading-tight mb-4 pr-8">
              {audio.titulo}
            </h4>
            
            {/* Contenedor de Texto con Lógica de Scroll */}
            <div className="relative">
              <div 
                ref={scrollRef}
                className="max-h-48 md:max-h-64 overflow-y-auto pr-3 custom-story-scrollbar"
                style={{
                  maskImage: isOverflowing ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'none',
                  WebkitMaskImage: isOverflowing ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'none'
                }}
              >
                {loading ? (
                  <div className="flex items-center gap-3 text-vallenato-blue/40 py-6 animate-pulse">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm italic font-serif">Consultando la memoria del Maestro...</span>
                  </div>
                ) : (
                  <p className="text-gray-900 font-serif text-base md:text-lg leading-relaxed font-medium italic mb-4">
                    {description || "Este tesoro sonoro es testimonio vivo del folclor que el Maestro Álvaro González ha preservado con celo para la posteridad."}
                  </p>
                )}
              </div>

              {/* Indicador de "Más contenido" */}
              {isOverflowing && !loading && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-vallenato-mustard animate-bounce pointer-events-none opacity-80">
                  <ChevronDown size={20} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-vallenato-blue/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-vallenato-red animate-pulse"></div>
               <span className="text-[9px] font-bold text-vallenato-blue/50 uppercase tracking-[0.2em]">Comentario de Álvaro González</span>
            </div>
            <ListMusic size={14} className="text-vallenato-mustard opacity-50" />
          </div>
        </div>
      </div>

      <style>{`
        .custom-story-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-story-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.03);
          border-radius: 10px;
        }
        .custom-story-scrollbar::-webkit-scrollbar-thumb {
          background: #EAAA00;
          border-radius: 10px;
        }
        .custom-story-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #EAAA00 transparent;
        }
      `}</style>
    </div>
  );
};

export default AudioStoryCard;
