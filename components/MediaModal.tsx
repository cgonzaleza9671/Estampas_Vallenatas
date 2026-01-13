
import React, { useEffect, useRef } from 'react';
import { X, Calendar, User, Mic2, FileText, Music, Video, ListMusic } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:pt-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      ></div>

      <div className="relative bg-vallenato-beige w-full max-w-4xl rounded-2xl md:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-fade-in-down border border-white/10 transition-colors duration-300">
        
        <div className="p-4 md:p-6 bg-vallenato-cream border-b border-vallenato-mustard/20 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-3 md:gap-5">
             <div className="bg-vallenato-blue p-2.5 md:p-3.5 rounded-2xl shadow-lg transform -rotate-3">
                {isVideo ? <Video className="text-vallenato-mustard w-5 h-5 md:w-6 md:h-6" /> : <Music className="text-vallenato-mustard w-5 h-5 md:w-6 md:h-6" />}
             </div>
             <div className="min-w-0">
               <h2 className="text-xl md:text-3xl font-serif text-vallenato-blue leading-none font-bold line-clamp-1">{item.titulo}</h2>
               <div className="flex items-center gap-2 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-vallenato-red animate-pulse"></span>
                  <p className="text-vallenato-red font-bold uppercase text-[9px] md:text-xs tracking-[0.2em]">
                    {isVideo ? 'Archivo Fílmico Exclusivo' : 'Tesoro Sonoro Digital'}
                  </p>
               </div>
             </div>
           </div>
           <button 
             onClick={onClose}
             className="text-vallenato-blue hover:text-white hover:bg-vallenato-red transition-all p-2.5 bg-white rounded-full shadow-md hover:shadow-xl shrink-0 ml-4 group"
           >
             <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
           </button>
        </div>

        <div ref={scrollContainerRef} className="overflow-y-auto p-4 md:p-8 space-y-8 flex-grow custom-scrollbar">
          
          <div ref={playerRef} className="w-full bg-black rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border-2 border-vallenato-blue/30 relative aspect-video">
            {isVideo && videoItem ? (
               <video 
                 key={videoItem.url_video}
                 controls 
                 autoPlay 
                 playsInline
                 preload="auto"
                 className="w-full h-full object-contain" 
                 poster={videoItem.thumbnail_url}
               >
                 <source src={videoItem.url_video} type="video/mp4" />
                 Tu navegador no soporta la reproducción de video MP4 o la URL es inválida.
               </video>
            ) : audioItem ? (
               <div className="p-10 md:p-16 flex flex-col items-center justify-center bg-vallenato-blue text-white w-full h-full relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
                    <div className="mb-6 bg-white/10 p-5 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl animate-pulse text-vallenato-mustard">
                       <Music size={48} className="md:w-16 md:h-16" />
                    </div>
                    <audio controls autoPlay className="w-full h-10 md:h-14" src={audioItem.url_audio} />
                    <p className="mt-5 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-vallenato-mustard/60">Sello de Calidad Estampas Vallenatas</p>
                 </div>
               </div>
            ) : null}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 space-y-4">
               <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-vallenato-mustard hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-1 opacity-60">
                    <User size={14} className="text-vallenato-blue" />
                    <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest">Compositor</p>
                  </div>
                  <p className="font-serif text-lg md:text-xl text-vallenato-blue font-bold">{item.autor}</p>
               </div>
               
               <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-vallenato-red hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-1 opacity-60">
                    <Mic2 size={14} className="text-vallenato-red" />
                    <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest">{isVideo ? 'Interpretación' : 'Voz Líder'}</p>
                  </div>
                  <p className="font-serif text-lg md:text-xl text-vallenato-blue font-bold">{isVideo ? videoItem?.interprete : audioItem?.cantante}</p>
               </div>

               {audioItem && (
                 <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-vallenato-blue hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-1 opacity-60">
                      <ListMusic size={14} className="text-vallenato-blue" />
                      <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest">Maestro Acordeonero</p>
                    </div>
                    <p className="font-serif text-lg md:text-xl text-vallenato-blue font-bold">{audioItem.acordeonero}</p>
                 </div>
               )}

               <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-vallenato-mustard/40 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-1 opacity-60">
                    <Calendar size={14} className="text-vallenato-blue" />
                    <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest">Registro</p>
                  </div>
                  <p className="font-serif text-lg md:text-xl text-vallenato-blue font-bold">{isVideo ? `Año ${videoItem?.anio}` : audioItem?.fecha_publicacion}</p>
               </div>
            </div>

            <div className="md:w-2/3">
              <div className="h-full bg-vallenato-cream/60 backdrop-blur-sm p-6 md:p-10 rounded-[2rem] border-2 border-dashed border-vallenato-mustard/30 relative transition-colors">
                <div className="absolute -top-4 -left-4 bg-vallenato-blue text-white p-3 rounded-2xl shadow-lg">
                   <FileText size={20} />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-vallenato-blue mb-5 font-bold">Descripción</h3>
                <div className="prose prose-vallenato">
                  <p className="text-gray-800 font-serif leading-relaxed text-lg md:text-xl italic">
                     {item.descripcion || "Este tesoro del folclor vallenato forma parte del archivo vivo del Maestro Álvaro González Pimienta, preservado para las futuras generaciones."}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-vallenato-mustard/20 flex items-center justify-between opacity-40">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Estampas Vallenatas &copy;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
