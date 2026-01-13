
import React, { useEffect, useRef } from 'react';
import { X, Calendar, User, Mic2, FileText, Music, Video, ListMusic, Info, Award } from 'lucide-react';
import { AudioItem, VideoItem } from '../types.ts';

interface MediaModalProps {
  item: AudioItem | VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ item, isOpen, onClose }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && item) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      
      const timer = setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const isVideo = 'interprete' in item;
  const audioItem = !isVideo ? (item as AudioItem) : null;
  const videoItem = isVideo ? (item as VideoItem) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Backdrop con desenfoque profundo */}
      <div 
        className="absolute inset-0 bg-vallenato-dark/95 backdrop-blur-2xl transition-opacity duration-700 animate-in fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#0a1120] w-full max-w-5xl h-full md:h-auto md:max-h-[92vh] md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-fade-in-up border border-white/5">
        
        {/* Header Superior Flotante - Más compacto en mobile */}
        <div className="absolute top-0 left-0 w-full z-20 p-4 md:p-8 flex justify-between items-start pointer-events-none">
           <div className="pointer-events-auto">
              <div className="flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 mb-1 md:mb-2">
                 {isVideo ? <Video className="text-vallenato-mustard w-3 h-3 md:w-4 md:h-4" /> : <Music className="text-vallenato-mustard w-3 h-3 md:w-4 md:h-4" />}
                 <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/80">
                   {isVideo ? 'Archivo Fílmico' : 'Tesoro Sonoro'}
                 </span>
              </div>
              <h2 className="text-base md:text-3xl font-serif text-white font-bold drop-shadow-2xl leading-tight max-w-[200px] md:max-w-2xl">{item.titulo}</h2>
           </div>
           
           <div className="flex gap-2 pointer-events-auto">
              <button 
                onClick={onClose}
                className="bg-white/10 hover:bg-vallenato-red text-white backdrop-blur-md p-2.5 md:p-4 rounded-full transition-all border border-white/20 shadow-xl group"
              >
                <X size={20} className="md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
           </div>
        </div>

        {/* Contenido Principal */}
        <div ref={scrollContainerRef} className="overflow-y-auto flex-grow custom-scrollbar">
          
          {/* Player de Gran Formato - Ocupa más visual inicial en mobile */}
          <div ref={playerRef} className="w-full relative aspect-video bg-black flex items-center justify-center">
            {/* Gradiente para lectura de título */}
            <div className="absolute inset-0 bg-gradient-to-b from-vallenato-dark/80 via-transparent to-vallenato-dark/60 z-10 pointer-events-none"></div>
            
            {isVideo && videoItem ? (
               <video 
                 key={videoItem.url_video}
                 controls 
                 autoPlay 
                 playsInline
                 preload="auto"
                 className="w-full h-full object-contain relative z-0" 
                 poster={videoItem.thumbnail_url}
               >
                 <source src={videoItem.url_video} type="video/mp4" />
               </video>
            ) : audioItem ? (
               <div className="w-full h-full flex flex-col items-center justify-center bg-vallenato-blue text-white p-6 md:p-10 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                    <div className="mb-4 md:mb-8 p-6 md:p-8 rounded-full bg-white/5 border border-white/10 shadow-2xl animate-pulse">
                       <Music size={40} className="md:w-20 md:h-20 text-vallenato-mustard" />
                    </div>
                    <audio controls autoPlay className="w-full h-10 md:h-16 invert opacity-90" src={audioItem.url_audio} />
                 </div>
               </div>
            ) : null}
          </div>

          {/* Grid de Información Moderna (Bento Style) - Compactado en mobile */}
          <div className="p-4 md:p-10 bg-vallenato-dark">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                
                {/* Tarjeta Autor */}
                <div className="bg-white/5 backdrop-blur-sm p-3.5 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/10 hover:border-vallenato-mustard/50 transition-all group">
                   <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <div className="bg-vallenato-mustard/20 p-2 md:p-2.5 rounded-lg md:rounded-xl text-vallenato-mustard group-hover:scale-110 transition-transform">
                         <User size={16} className="md:w-5 md:h-5" />
                      </div>
                      <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">Autor</span>
                   </div>
                   <p className="font-serif text-sm md:text-lg text-white font-bold">{item.autor}</p>
                </div>

                {/* Tarjeta Intérprete */}
                <div className="bg-white/5 backdrop-blur-sm p-3.5 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/10 hover:border-vallenato-red/50 transition-all group">
                   <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <div className="bg-vallenato-red/20 p-2 md:p-2.5 rounded-lg md:rounded-xl text-vallenato-red group-hover:scale-110 transition-transform">
                         <Mic2 size={16} className="md:w-5 md:h-5" />
                      </div>
                      <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">{isVideo ? 'Interpretación' : 'Voz Líder'}</span>
                   </div>
                   <p className="font-serif text-sm md:text-lg text-white font-bold">{isVideo ? videoItem?.interprete : audioItem?.cantante}</p>
                </div>

                {/* Tarjeta Registro Histórico */}
                <div className="bg-white/5 backdrop-blur-sm p-3.5 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/10 hover:border-vallenato-blue/50 transition-all group">
                   <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <div className="bg-vallenato-blue/40 p-2 md:p-2.5 rounded-lg md:rounded-xl text-white group-hover:scale-110 transition-transform">
                         {audioItem ? <ListMusic size={16} className="md:w-5 h-5" /> : <Calendar size={16} className="md:w-5 md:h-5" />}
                      </div>
                      <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">{audioItem ? 'Acordeonero' : 'Registro Histórico'}</span>
                   </div>
                   <p className="font-serif text-sm md:text-lg text-white font-bold">
                     {audioItem ? audioItem.acordeonero : (videoItem?.fecha_publicacion || `${videoItem?.anio}`)}
                   </p>
                </div>

                {/* Tarjeta Descripción (Ocupa todo el ancho inferior) - Más compacta en mobile */}
                <div className="md:col-span-3 bg-vallenato-mustard/5 border border-vallenato-mustard/20 p-5 md:p-9 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 md:p-6 opacity-[0.03] text-vallenato-mustard">
                      <FileText size={80} className="md:w-[100px] md:h-[100px]" />
                   </div>
                   <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                      {/* FIX: Merged duplicated className attributes into a single string */}
                      <Info className="text-vallenato-mustard md:w-[18px] md:h-[18px]" size={16} />
                      <h3 className="font-serif text-base md:text-lg text-vallenato-mustard font-bold italic">Descripción</h3>
                   </div>
                   <p className="text-gray-300 font-serif leading-relaxed text-xs md:text-lg italic relative z-10">
                      {item.descripcion || "Este tesoro del folclor vallenato forma parte del archivo vivo del Maestro Álvaro González Pimienta, preservado para las futuras generaciones."}
                   </p>
                   <div className="mt-5 md:mt-7 pt-4 md:pt-5 border-t border-white/10 flex items-center gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-vallenato-blue flex items-center justify-center text-white border border-white/10 shadow-lg">
                         <Award size={12} className="md:w-[14px] md:h-[14px]" />
                      </div>
                      <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-white/30">Archivo digital de Estampas Vallenatas</span>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000814;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EAAA00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MediaModal;
