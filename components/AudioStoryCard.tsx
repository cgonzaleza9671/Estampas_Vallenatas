
import React from 'react';
import { X, Quote, User, ListMusic, Mic2 } from 'lucide-react';
import { AudioItem } from '../types';

interface AudioStoryCardProps {
  audio: AudioItem;
  onClose: () => void;
}

const AudioStoryCard: React.FC<AudioStoryCardProps> = ({ audio, onClose }) => {
  return (
    <div className="fixed bottom-28 md:bottom-32 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[70] animate-fade-in-up">
      <div className="bg-[#E5E2D0] backdrop-blur-2xl border-l-8 border-vallenato-mustard shadow-[0_25px_60px_rgba(0,0,0,0.45)] rounded-r-2xl overflow-hidden relative group border border-white/10 transition-colors duration-300">
        
        <div className="absolute -right-4 -bottom-4 opacity-[0.07] text-vallenato-blue transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
          <Quote size={120} />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5 text-gray-500 hover:text-vallenato-red transition-all z-10"
        >
          <X size={18} />
        </button>

        <div className="p-5 md:p-7 relative z-0">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2 text-vallenato-blue/70">
              <User size={12} className="shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Autor: {audio.autor}</span>
            </div>
            <div className="flex items-center gap-2 text-vallenato-red/70">
              <Mic2 size={12} className="shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Voz: {audio.cantante}</span>
            </div>
            <div className="flex items-center gap-2 text-vallenato-mustard">
              <ListMusic size={12} className="shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Acordeón: {audio.acordeonero}</span>
            </div>
          </div>

          <div className="relative">
            <Quote size={24} className="text-vallenato-red/10 absolute -left-2 -top-2" />
            <h4 className="text-vallenato-blue font-serif text-xl md:text-2xl font-bold leading-tight mb-3 pr-6">
              {audio.titulo}
            </h4>
            <div className="max-h-48 md:max-h-60 overflow-y-auto scrollbar-hide pr-2">
              <p className="text-gray-900 font-serif text-base md:text-lg leading-relaxed font-medium italic">
                {audio.descripcion}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-black/10 flex items-center justify-between">
            <span className="text-[9px] font-bold text-vallenato-blue/50 uppercase tracking-[0.2em]">Comentario de Álvaro González Pimienta</span>
            <div className="w-1.5 h-1.5 rounded-full bg-vallenato-red animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioStoryCard;
