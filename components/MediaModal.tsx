
import React, { useEffect, useRef } from 'react';
import { X, Calendar, User, Mic2, FileText, Music, Video, ListMusic, Info, Share2, Award } from 'lucide-react';
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

      <div className="relative bg-[#0a1120] w-full max-w-6xl h-full md:h-auto md:max-h-[92vh] md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-fade-in-up border border-white/5">
        
        {/* Header Superior Flotante */}
        <div className="absolute top-0 left-0 w-full z-20 p-4 md:p-8 flex justify-between items-start pointer-events-none">
           <div className="pointer-events-auto">
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-2">
                 {isVideo ? <Video className="text-vallenato-mustard w-4 h-4" /> : <Music className="text-vallenato-mustard w-4 h-4" />}
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                   {isVideo ? 'Archivo Fílmico' : 'Tesoro Sonoro'}
                 </span>
              </div>
              <h2 className="text-2xl md:text-5xl font-serif text-white font-bold drop-shadow-2xl leading-tight max-w-2xl">{item.titulo}</h2>
           </div>
           
           <div className="flex gap-3 pointer-events-auto">
              <button 
                onClick={onClose}
                className="bg-white/10 hover:bg-vallenato-red text-white backdrop-blur-md p-3 md:p-4 rounded-full transition-all border border-white/20 shadow-xl group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
           </div>
        </div>

        {/* Contenido Principal */}
        <div ref={scrollContainerRef} className="overflow-y-auto flex-grow custom-scrollbar">
          
          {/* Player de Gran Formato */}
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
               <div className="w-full h-full flex flex-col items-center justify-center bg-vallenato-blue text-white p-10 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                    <div className="mb-8 p-8 rounded-full bg-white/5 border border-white/10 shadow-2xl animate-pulse">
                       <Music size={80} className="text-vallenato-mustard" />
                    </div>
                    <audio controls autoPlay className="w-full h-12 md:h-16 invert opacity-90" src={audioItem.url_audio} />
                 </div>
               </div>
            ) : null}
          </div>

          {/* Grid de Información Moderna (Bento Style) */}
          <div className="p-6 md:p-12 bg-vallenato-dark">
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* Metadatos Principales */}
                <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   
                   {/* Tarjeta Compositor */}
                   <div className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 hover:border-vallenato-mustard/50 transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="bg-vallenato-mustard/20 p-3 rounded-2xl text-vallenato-mustard group-hover:scale-110 transition-transform">
                            <User size={24} />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Compositor</span>
                      </div>
                      <p className="font-serif text-xl md:text-2xl text-white font-bold">{item.autor}</p>
                   </div>

                   {/* Tarjeta Intérprete */}
                   <div className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 hover:border-vallenato-red/50 transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="bg-vallenato-red/20 p-3 rounded-2xl text-vallenato-red group-hover:scale-110 transition-transform">
                            <Mic2 size={24} />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{isVideo ? 'Interpretación' : 'Voz Líder'}</span>
                      </div>
                      <p className="font-serif text-xl md:text-2xl text-white font-bold">{isVideo ? videoItem?.interprete : audioItem?.cantante}</p>
                   </div>

                   {/* Tarjeta Acordeón / Registro */}
                   <div className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 hover:border-vallenato-blue/50 transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="bg-vallenato-blue/40 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            {audioItem ? <ListMusic size={24} /> : <Calendar size={24} />}
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{audioItem ? 'Acordeonero' : 'Registro Histórico'}</span>
                      </div>
                      <p className="font-serif text-xl md:text-2xl text-white font-bold">
                        {audioItem ? audioItem.acordeonero : `Año ${videoItem?.anio}`}
                      </p>
                   </div>

                   {/* Tarjeta Descripción (Ocupa más espacio) */}
                   <div className="sm:col-span-2 lg:col-span-3 bg-vallenato-mustard/5 border border-vallenato-mustard/20 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-vallenato-mustard">
                         <FileText size={120} />
                      </div>
                      <div className="flex items-center gap-3 mb-6">
                         <Info className="text-vallenato-mustard" size={20} />
                         <h3 className="font-serif text-2xl text-vallenato-mustard font-bold italic">Nota del Curador</h3>
                      </div>
                      <p className="text-gray-300 font-serif leading-relaxed text-lg md:text-2xl italic relative z-10">
                         {item.descripcion || "Este tesoro del folclor vallenato forma parte del archivo vivo del Maestro Álvaro González Pimienta, preservado para las futuras generaciones."}
                      </p>
                      <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-vallenato-blue flex items-center justify-center text-white border border-white/10 shadow-lg">
                            <Award size={18} />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Autenticidad Garantizada por Estampas Vallenatas</span>
                      </div>
                   </div>
                </div>

                {/* Sidebar de Acciones / Adicionales */}
                <div className="space-y-4">
                   <div className="bg-vallenato-red/10 p-6 rounded-[2rem] border border-vallenato-red/20 text-center flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-vallenato-red mb-4 block">Preservación Digital</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-vallenato-red animate-ping mb-4"></div>
                      <p className="text-white/60 text-xs font-serif italic mb-6">"La música es el alma de los pueblos, y el vallenato es el alma de Colombia."</p>
                      <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-tighter">
                         <Share2 size={16} /> Compartir Hallazgo
                      </button>
                   </div>
                   
                   {audioItem && (
                     <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-vallenato-mustard mb-4 block">Registro</span>
                        <div className="flex items-center gap-3">
                           <Calendar className="text-white/40" size={18} />
                           <p className="text-white font-serif font-bold">{audioItem.fecha_publicacion}</p>
                        </div>
                     </div>
                   )}
                </div>

             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
