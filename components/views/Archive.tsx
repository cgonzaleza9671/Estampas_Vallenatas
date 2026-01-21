
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAudios, fetchVideos } from '../../services/supabaseClient.ts';
import { AudioItem, VideoItem } from '../../types.ts';
import MediaModal from '../MediaModal.tsx';
import Button from '../Button.tsx';
import { Music, Video, Loader2, AlertCircle, RefreshCw, Play, Pause, Search, LayoutGrid, List, User, Mic2, ListMusic, Calendar, ChevronDown } from 'lucide-react';

interface ArchiveProps {
  initialTab?: 'audio' | 'video';
  onPlayAudio?: (audio: AudioItem, list?: AudioItem[]) => void;
  onVideoOpen?: () => void;
  currentAudioId?: number;
  isPlaying?: boolean;
}

const AUDIO_LIMIT = 15;
const VIDEO_LIMIT = 4;

const Archive: React.FC<ArchiveProps> = ({ initialTab = 'audio', onPlayAudio, onVideoOpen, currentAudioId, isPlaying }) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>(initialTab);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [audioPage, setAudioPage] = useState(0);
  const [videoPage, setVideoPage] = useState(0);
  const [hasMoreAudios, setHasMoreAudios] = useState(true);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [fetchedAudios, fetchedVideos] = await Promise.all([
        fetchAudios(0, AUDIO_LIMIT),
        fetchVideos(0, VIDEO_LIMIT)
      ]);
      setAudios(fetchedAudios);
      setVideos(fetchedVideos);
      setHasMoreAudios(fetchedAudios.length === AUDIO_LIMIT);
      setHasMoreVideos(fetchedVideos.length === VIDEO_LIMIT);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      if (activeTab === 'audio') {
        const nextPage = audioPage + 1;
        const moreAudios = await fetchAudios(nextPage, AUDIO_LIMIT);
        if (moreAudios.length < AUDIO_LIMIT) setHasMoreAudios(false);
        setAudios(prev => [...prev, ...moreAudios]);
        setAudioPage(nextPage);
      } else {
        const nextPage = videoPage + 1;
        const moreVideos = await fetchVideos(nextPage, VIDEO_LIMIT);
        if (moreVideos.length < VIDEO_LIMIT) setHasMoreVideos(false);
        setVideos(prev => [...prev, ...moreVideos]);
        setVideoPage(nextPage);
      }
    } catch (e) {
      console.error("Error cargando más contenido", e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const filteredAudios = useMemo(() => {
    if (!searchQuery.trim()) return audios;
    const query = searchQuery.toLowerCase();
    return audios.filter(item => 
      item.titulo.toLowerCase().includes(query) || 
      item.cantante.toLowerCase().includes(query) ||
      item.autor.toLowerCase().includes(query)
    );
  }, [audios, searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const query = searchQuery.toLowerCase();
    return videos.filter(item => 
      item.titulo.toLowerCase().includes(query) || 
      item.interprete.toLowerCase().includes(query) ||
      item.autor.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  const showMoreBtn = activeTab === 'audio' ? hasMoreAudios : hasMoreVideos;

  return (
    <div className="min-h-screen bg-vallenato-beige pt-8 pb-32 animate-fade-in-up">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center mb-12">
          <span className="text-vallenato-red font-bold uppercase tracking-widest text-xs">Archivo Vivo</span>
          <h1 className="text-4xl md:text-6xl font-serif text-vallenato-blue mb-4 font-bold tracking-tight">La Memoria del Acordeón</h1>
        </div>

        <div className="flex justify-center mb-12">
           <div className="bg-white/40 backdrop-blur-sm p-1.5 rounded-2xl shadow-inner border border-white/50 inline-flex">
              <button onClick={() => setActiveTab('audio')} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'audio' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue'}`}><Music size={16} /> Audios</button>
              <button onClick={() => setActiveTab('video')} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue'}`}><Video size={16} /> Videos</button>
           </div>
        </div>

        <div className="max-w-xl mx-auto mb-10">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard group-focus-within:text-vallenato-red transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por título, autor o intérprete..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-vallenato-mustard focus:outline-none transition-all text-sm shadow-md" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center h-80 text-vallenato-blue">
             <Loader2 size={64} className="animate-spin text-vallenato-mustard mb-6" />
             <p className="font-serif italic text-xl">Abriendo la fonoteca...</p>
           </div>
        ) : error ? (
           <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
             <AlertCircle size={64} className="text-vallenato-red mx-auto mb-6" />
             <p className="text-xl font-serif text-vallenato-blue mb-4">No pudimos conectar con la fonoteca.</p>
             <button onClick={loadInitialData} className="inline-flex items-center gap-3 bg-vallenato-blue text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-vallenato-red transition-colors">
               <RefreshCw size={18}/> Reintentar
             </button>
           </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'audio' ? (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAudios.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => onPlayAudio?.(item, audios)} 
                    className={`group relative min-h-[220px] bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-gold transition-all duration-500 border-2 ${currentAudioId === item.id ? 'border-vallenato-red bg-vallenato-cream' : 'border-vallenato-mustard/40 hover:border-vallenato-mustard'} cursor-pointer flex flex-col overflow-hidden`}
                  >
                    <div className="z-10 flex items-center mb-4">
                        <div className="bg-vallenato-mustard/10 text-vallenato-mustard px-2.5 py-1 rounded-full border border-vallenato-mustard/20">
                          <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{item.fecha_publicacion}</span>
                        </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-center relative z-10">
                        <h4 className="text-lg md:text-xl font-serif text-vallenato-blue font-bold group-hover:text-vallenato-red transition-colors mb-4 pr-2 leading-tight line-clamp-2">{item.titulo}</h4>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2.5 bg-vallenato-blue/5 px-3 py-1.5 rounded-xl group-hover:bg-vallenato-blue transition-colors group-hover:text-white border border-vallenato-blue/5 w-fit max-w-full overflow-hidden">
                              <User size={12} className="text-vallenato-mustard shrink-0" />
                              <span className="text-[10px] font-bold uppercase tracking-wider truncate">{item.autor}</span>
                          </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
                      <div className="flex flex-col">
                          <span className="text-[7.5px] uppercase font-black text-gray-400 tracking-tighter mb-0.5">ACORDEÓN</span>
                          <span className="text-[11px] font-bold text-vallenato-blue leading-none">{item.acordeonero}</span>
                      </div>
                      <div className={`p-3 rounded-full transition-all duration-500 shadow-lg ${currentAudioId === item.id && isPlaying ? 'bg-vallenato-red text-white' : 'bg-vallenato-blue text-white group-hover:bg-vallenato-red'}`}>{currentAudioId === item.id && isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-0.5"/>}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                {filteredVideos.map((item) => (
                  <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-gold transition-all duration-500 cursor-pointer group relative border border-white" onClick={() => { onVideoOpen?.(); setSelectedVideo(item); setIsModalOpen(true); }}>
                     <div className="aspect-video relative overflow-hidden bg-black">
                        {item.thumbnail_url && <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[2s]" alt={item.titulo} loading="lazy" />}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/20 backdrop-blur-xl p-8 rounded-full border border-white/40 shadow-2xl transform group-hover:scale-125 transition-transform duration-500">
                             <Play size={48} className="text-white fill-white" />
                           </div>
                        </div>
                     </div>
                     <div className="p-10">
                        <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-4 group-hover:text-vallenato-red transition-colors leading-tight">{item.titulo}</h3>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3 text-gray-400 font-bold">
                             <Calendar size={18} />
                             <span className="text-sm">{item.fecha_publicacion}</span>
                           </div>
                           <button className="text-vallenato-blue font-bold uppercase text-[11px] tracking-widest flex items-center gap-3 group-hover:text-vallenato-red transition-colors">Ver ahora <Play size={12} fill="currentColor"/></button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {showMoreBtn && !loading && (
              <div className="flex justify-center pt-16">
                 <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore} className="min-w-[240px] border-vallenato-mustard/30 hover:border-vallenato-mustard">
                   {loadingMore ? (
                     <span className="flex items-center gap-3"><Loader2 size={20} className="animate-spin" /> Cargando...</span>
                   ) : (
                     <span className="flex items-center gap-3">Explorar más estampas <ChevronDown size={20} /></span>
                   )}
                 </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <MediaModal item={selectedVideo} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Archive;
