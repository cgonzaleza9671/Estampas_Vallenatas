import React from 'react';
import { X, Calendar, User, Mic2, FileText, Music, Video, Tv, ListMusic, UserCheck } from 'lucide-react';
import { AudioItem, VideoItem } from '../types';

interface MediaModalProps {
  item: AudioItem | VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const isVideo = 'url_video' in item;
  // Type guards/casting for specific properties
  const audioItem = !isVideo ? (item as AudioItem) : null;
  const videoItem = isVideo ? (item as VideoItem) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop: Black 90% with blur */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-vallenato-beige w-full max-w-4xl rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="p-4 md:p-6 bg-vallenato-cream border-b border-vallenato-mustard/20 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-3 md:gap-4">
             <div className="bg-vallenato-cream p-2 md:p-3 rounded-xl border border-vallenato-mustard/50 shadow-sm">
                {isVideo ? <Video className="text-vallenato-blue w-5 h-5 md:w-6 md:h-6" /> : <Music className="text-vallenato-blue w-5 h-5 md:w-6 md:h-6" />}
             </div>
             <div>
               <h2 className="text-xl md:text-3xl font-serif text-vallenato-blue leading-none line-clamp-1 max-w-[200px] md:max-w-none">{item.titulo}</h2>
               <p className="text-vallenato-red font-bold uppercase text-[10px] md:text-xs tracking-widest mt-1">
                  {isVideo ? 'Archivo Fílmico' : 'Fonoteca Histórica'}
               </p>
             </div>
           </div>
           <button 
             onClick={onClose}
             className="text-gray-400 hover:text-vallenato-red transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md"
           >
             <X size={20} className="md:w-6 md:h-6" />
           </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
          
          {/* Player Section */}
          <div className="w-full bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border-2 border-vallenato-blue/20 shrink-0">
            {isVideo && videoItem ? (
               <video 
                 controls 
                 autoPlay
                 className="w-full aspect-video object-cover"
                 src={videoItem.url_video}
                 poster={videoItem.thumbnail_url}
               />
            ) : audioItem ? (
               <div className="p-6 md:p-12 flex flex-col items-center justify-center bg-vallenato-blue text-white aspect-video md:aspect-[21/9] relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
                    <div className="mb-4 md:mb-6 bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-md border border-white/20 shadow-xl animate-pulse">
                       <Music size={32} className="text-vallenato-mustard md:w-12 md:h-12" />
                    </div>
                    <audio 
                      controls 
                      autoPlay
                      className="w-full h-8 md:h-12"
                      src={audioItem.url_audio}
                    />
                    <p className="mt-4 text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-vallenato-mustard opacity-80 hidden md:block">Archivo Digital de Estampas Vallenatas</p>
                 </div>
               </div>
            ) : null}
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Metadata Sidebar */}
            <div className="md:w-1/3 space-y-3 md:space-y-4">
               
               {/* Field 1: Autor */}
               <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                    <User className="text-vallenato-mustard w-3 h-3 md:w-4 md:h-4" />
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">Autor</p>
                  </div>
                  <p className="font-serif text-base md:text-lg text-vallenato-blue leading-tight">
                     {item.autor}
                  </p>
               </div>
               
               {/* Field 2: Acordeonero (Audio) / Año (Video) */}
               {audioItem ? (
                 <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <ListMusic className="text-vallenato-mustard w-3 h-3 md:w-4 md:h-4" />
                      <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">Acordeonero</p>
                    </div>
                    <p className="font-serif text-base md:text-lg text-vallenato-blue leading-tight">{audioItem.acordeonero}</p>
                 </div>
               ) : (
                 <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <Calendar className="text-vallenato-mustard w-3 h-3 md:w-4 md:h-4" />
                      <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">Año</p>
                    </div>
                    <p className="font-serif text-base md:text-lg text-vallenato-blue leading-tight">{videoItem?.anio}</p>
                 </div>
               )}

               {/* Field 3: Fecha Publicación (Audio only) */}
               {audioItem && (
                 <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <Calendar className="text-vallenato-mustard w-3 h-3 md:w-4 md:h-4" />
                      <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">Fecha de Publicación</p>
                    </div>
                    <p className="font-serif text-base md:text-lg text-vallenato-blue capitalize leading-tight">{audioItem.fecha_publicacion}</p>
                 </div>
               )}
            </div>

            {/* Description Section */}
            <div className="md:w-2/3 pb-4 md:pb-0">
              <div className="h-full bg-vallenato-cream p-4 md:p-6 rounded-xl md:rounded-2xl border-l-4 border-vallenato-mustard">
                <h3 className="font-serif text-xl md:text-2xl text-vallenato-blue mb-3 md:mb-4 flex items-center gap-2">
                  <FileText className="text-vallenato-red w-4 h-4 md:w-5 md:h-5" />
                  {isVideo ? "Información" : "Comentario del Maestro"}
                </h3>
                <p className="text-gray-700 font-serif leading-relaxed text-base md:text-lg italic">
                   "{item.descripcion}"
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MediaModal;