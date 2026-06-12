
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchAudios, fetchVideos, fetchAudioFilters, fetchVideoFilters } from '../../services/supabaseClient.ts';
import { AudioItem, VideoItem } from '../../types.ts';
import MediaModal from '../MediaModal.tsx';
import Button from '../Button.tsx';
import { Music, Video, Loader2, AlertCircle, RefreshCw, Play, Pause, Search, LayoutGrid, List, User, Mic2, ListMusic, Calendar, ChevronDown, X, ExternalLink, Youtube, Info, Disc, Headphones } from 'lucide-react';

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
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAudioAuthor, setSelectedAudioAuthor] = useState('All'); 
  const [selectedAudioSinger, setSelectedAudioSinger] = useState('All'); 
  const [selectedAudioAccordion, setSelectedAudioAccordion] = useState('All'); 
  const [selectedVideoAuthor, setSelectedVideoAuthor] = useState('All'); 
  const [selectedVideoInterpreter, setSelectedVideoInterpreter] = useState('All'); 

  // Opciones de filtros
  const [filterOptions, setFilterOptions] = useState<{
    audioAuthors: string[];
    audioSingers: string[];
    audioAccordions: string[];
    videoAuthors: string[];
    videoInterpreters: string[];
  }>({
    audioAuthors: [],
    audioSingers: [],
    audioAccordions: [],
    videoAuthors: [],
    videoInterpreters: []
  });

  // Paginación
  const [audioPage, setAudioPage] = useState(0);
  const [videoPage, setVideoPage] = useState(0);
  const [hasMoreAudios, setHasMoreAudios] = useState(true);
  const [hasMoreVideos, setHasMoreVideos] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [audioFilters, videoFilters] = await Promise.all([
          fetchAudioFilters(),
          fetchVideoFilters()
        ]);
        setFilterOptions({
          audioAuthors: audioFilters.authors,
          audioSingers: audioFilters.singers,
          audioAccordions: audioFilters.accordions,
          videoAuthors: videoFilters.authors,
          videoInterpreters: videoFilters.interpreters
        });
      } catch (e) {
        console.error("Error loading filters", e);
      }
    };
    loadFilters();
  }, []);

  const loadData = useCallback(async (isReset: boolean) => {
    if (isReset) {
      setLoading(true);
      setError(false);
    } else {
      setLoadingMore(true);
    }

    try {
      if (activeTab === 'audio') {
        const page = isReset ? 0 : audioPage + 1;
        const fetched = await fetchAudios(page, AUDIO_LIMIT, {
          search: debouncedSearch,
          author: selectedAudioAuthor,
          singer: selectedAudioSinger,
          accordion: selectedAudioAccordion
        });
        setAudios(prev => isReset ? fetched : [...prev, ...fetched]);
        setHasMoreAudios(fetched.length === AUDIO_LIMIT);
        setAudioPage(page);
      } else {
        if (isReset) {
          const fetched = await fetchVideos(0, VIDEO_LIMIT, { search: debouncedSearch, author: selectedVideoAuthor, interpreter: selectedVideoInterpreter });
          setVideos(fetched);
          setHasMoreVideos(false);
          setVideoPage(0);
        }
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab, debouncedSearch, selectedAudioAuthor, selectedAudioSinger, selectedAudioAccordion, selectedVideoAuthor, selectedVideoInterpreter, audioPage, videoPage]);

  useEffect(() => {
    loadData(true);
  }, [activeTab, debouncedSearch, selectedAudioAuthor, selectedAudioSinger, selectedAudioAccordion, selectedVideoAuthor, selectedVideoInterpreter]);

  // Actualizar contador localmente cuando se emite el evento global para evitar un refetch completo
  useEffect(() => {
    const handleIncremented = (e: any) => {
      const { id } = e.detail;
      setAudios(prev => prev.map(a => a.id === id ? { ...a, reproducciones: (a.reproducciones || 0) + 1 } : a));
    };
    window.addEventListener('audioPlayIncremented', handleIncremented);
    return () => window.removeEventListener('audioPlayIncremented', handleIncremented);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && !loading && activeTab === 'audio') loadData(false);
  };

  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
  };

  const formatPlays = (num: number = 0) => {
    if (num < 1000) return num;
    if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
    return (num / 1000000).toFixed(1) + 'M';
  };

  const groupedAudios = useMemo(() => {
    const groups: { [key: string]: AudioItem[] } = {};
    audios.forEach(item => {
      const parts = item.fecha_publicacion.split(' de ');
      const key = parts.length >= 3 ? `${parts[1]} de ${parts[2]}` : "última estampa";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [audios]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedAudioAuthor('All');
    setSelectedAudioSinger('All');
    setSelectedAudioAccordion('All');
    setSelectedVideoAuthor('All');
    setSelectedVideoInterpreter('All');
  };

  return (
    <div className="min-h-screen bg-vallenato-beige pt-8 pb-32 animate-fade-in-up">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-vallenato-red font-bold uppercase tracking-widest text-[10px] md:text-xs">Museo Digital Estampas Vallenatas</span>
          <h1 className="text-4xl md:text-6xl font-serif text-vallenato-blue mb-4 font-bold tracking-tight">La Memoria del Acordeón</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-serif italic text-base md:text-lg">Explore la fonoteca más completa del folclor vallenato tradicional.</p>
        </div>

        <div className="flex justify-center mb-12">
           <div className="bg-white/40 backdrop-blur-sm p-1.5 rounded-2xl shadow-inner border border-white/50 inline-flex">
              <button onClick={() => { setActiveTab('audio'); resetFilters(); }} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'audio' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue hover:bg-white/50'}`}><Music size={16} /> Audios</button>
              <button onClick={() => { setActiveTab('video'); resetFilters(); }} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue hover:bg-white/50'}`}><Video size={16} /> Videos</button>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-museum mb-10 border border-vallenato-mustard/10 max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-center">
              <div className="col-span-1 lg:col-span-3">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard group-focus-within:text-vallenato-red transition-colors" size={20} />
                    <input type="text" placeholder="Buscar por título, autor..." className="w-full pl-12 pr-10 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-sm font-sans" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-vallenato-red"><X size={16} /></button>}
                 </div>
              </div>
              {activeTab === 'audio' ? (
                <>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioAuthor} onChange={(e) => setSelectedAudioAuthor(e.target.value)}>
                        <option value="All">Todos los autores</option>
                        {filterOptions.audioAuthors.map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioSinger} onChange={(e) => setSelectedAudioSinger(e.target.value)}>
                        <option value="All">Todos los cantantes</option>
                        {filterOptions.audioSingers.map(s => <option key={s} value={s}>{toTitleCase(s)}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioAccordion} onChange={(e) => setSelectedAudioAccordion(e.target.value)}>
                        <option value="All">Todos los acordeoneros</option>
                        {filterOptions.audioAccordions.map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div className="col-span-1 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedVideoAuthor} onChange={(e) => setSelectedVideoAuthor(e.target.value)}>
                        <option value="All">Todos los autores</option>
                        {filterOptions.videoAuthors.map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}
                    </select>
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedVideoInterpreter} onChange={(e) => setSelectedVideoInterpreter(e.target.value)}>
                        <option value="All">Todos los intérpretes</option>
                        {filterOptions.videoInterpreters.map(i => <option key={i} value={i}>{toTitleCase(i)}</option>)}
                    </select>
                </div>
              )}
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center h-80 text-vallenato-blue">
             <div className="relative">
                <Loader2 size={64} className="animate-spin text-vallenato-mustard mb-6" />
                <Music size={24} className="absolute inset-0 m-auto text-vallenato-red" />
             </div>
             <p className="font-serif italic text-xl animate-pulse">Consultando el archivo del Maestro...</p>
           </div>
        ) : error ? (
           <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
             <AlertCircle size={64} className="text-vallenato-red mx-auto mb-6" />
             <p className="text-xl font-serif text-vallenato-blue mb-4">No pudimos conectar con la fonoteca en este momento.</p>
             <button onClick={() => loadData(true)} className="inline-flex items-center gap-3 bg-vallenato-blue text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-vallenato-red transition-colors shadow-lg"><RefreshCw size={18}/> Reintentar conexión</button>
           </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'audio' ? (
              <div className="space-y-12">
                <div className="flex justify-end items-center px-4 border-b border-vallenato-mustard/20 pb-4 gap-4">
                  <div className="flex bg-vallenato-blue/5 rounded-2xl p-1.5 gap-1.5">
                    <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-vallenato-blue/40 hover:text-vallenato-blue hover:bg-white'}`}><LayoutGrid size={20} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-vallenato-blue text-white shadow-xl' : 'text-vallenato-blue/40 hover:text-vallenato-blue hover:bg-white'}`}><List size={20} /></button>
                  </div>
                </div>

                {audios.length === 0 ? (
                  <div className="text-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-vallenato-mustard/20">
                    <Music size={48} className="mx-auto mb-4 text-vallenato-blue/20" />
                    <p className="font-serif italic text-gray-400">No se encontraron estampas con esos criterios...</p>
                    <button onClick={resetFilters} className="mt-4 text-vallenato-red font-bold text-xs uppercase tracking-widest hover:underline">Limpiar filtros</button>
                  </div>
                ) : (
                  <>
                    {Object.entries(groupedAudios).map(([groupName, items]: [string, any]) => (
                      <div key={groupName} className="space-y-8">
                        <div className="flex items-center gap-8">
                          <h3 className="text-vallenato-blue font-serif text-3xl md:text-4xl font-bold capitalize whitespace-nowrap tracking-tight">{toTitleCase(groupName)}</h3>
                          <div className="h-[1.5px] bg-gradient-to-r from-vallenato-mustard/60 via-vallenato-mustard/20 to-transparent flex-grow"></div>
                        </div>
                        
                        {viewMode === 'grid' ? (
                          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {(items as AudioItem[]).map((item) => {
                              const isActive = currentAudioId === item.id;
                              return (
                                <div key={item.id} onClick={() => onPlayAudio?.(item, audios)} className={`group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 border-2 ${isActive ? 'border-vallenato-red bg-vallenato-cream shadow-gold' : 'border-white hover:border-vallenato-mustard shadow-museum hover:-translate-y-2'} cursor-pointer`}>
                                  <div className="h-28 bg-vallenato-blue/5 relative overflow-hidden flex items-center justify-center">
                                     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                     <Disc className={`text-vallenato-mustard/20 w-32 h-32 absolute -right-8 -top-8 transform rotate-12 transition-transform duration-1000 ${isActive && isPlaying ? 'animate-[spin_10s_linear_infinite]' : 'group-hover:rotate-45'}`} />
                                     <div className="absolute top-4 left-4 z-10">
                                        {item.numero && (
                                          <div className="bg-vallenato-red text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-vallenato-red/20 shadow-md">
                                             <span className="text-[10px] font-black uppercase tracking-widest text-white">#{item.numero}</span>
                                          </div>
                                        )}
                                     </div>
                                     <div className="absolute top-4 right-6 z-10 flex gap-2">
                                        {(item.reproducciones || 0) > 0 && (
                                          <div className="bg-vallenato-blue/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-vallenato-blue/10 flex items-center gap-1.5">
                                            <Headphones size={10} className="text-vallenato-blue" />
                                            <span className="text-[8px] font-black text-vallenato-blue/60">{formatPlays(item.reproducciones)}</span>
                                          </div>
                                        )}
                                        <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-vallenato-mustard/20 shadow-sm">
                                           <span className="text-[8px] font-black uppercase tracking-[0.1em] text-vallenato-blue/60">{item.fecha_publicacion}</span>
                                        </div>
                                     </div>
                                     <div className={`p-4 rounded-full transition-all duration-500 shadow-2xl relative z-0 ${isActive && isPlaying ? 'bg-vallenato-red text-white scale-110' : 'bg-vallenato-blue text-white group-hover:bg-vallenato-red group-hover:scale-110'}`}>
                                       {isActive && isPlaying ? <Pause size={28} fill="currentColor"/> : <Play size={28} fill="currentColor" className="ml-1"/>}
                                     </div>
                                  </div>
                                  <div className="p-8 flex flex-col flex-grow">
                                     <h4 className={`text-xl md:text-2xl font-serif font-bold mb-6 leading-tight transition-colors line-clamp-2 ${isActive ? 'text-vallenato-red' : 'text-vallenato-blue group-hover:text-vallenato-red'}`}>{item.titulo}</h4>
                                     <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-xl bg-vallenato-mustard/10 flex items-center justify-center text-vallenato-mustard"><User size={14} /></div>
                                           <div className="flex flex-col"><span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Autor</span><span className="text-[11px] font-bold text-vallenato-blue/80 uppercase tracking-wider truncate">{item.autor}</span></div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-xl bg-vallenato-red/10 flex items-center justify-center text-vallenato-red"><Mic2 size={14} /></div>
                                           <div className="flex flex-col"><span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Voz Principal</span><span className="text-[11px] font-bold text-vallenato-blue/80 uppercase tracking-wider truncate">{item.cantante}</span></div>
                                        </div>
                                     </div>
                                     <div className="mt-auto pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-between group/acordeon">
                                           <div className="flex flex-col">
                                              <span className="text-[8px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1.5">Maestro del Acordeón</span>
                                              <span className="text-sm md:text-base font-serif font-bold text-vallenato-blue leading-tight group-hover/acordeon:text-vallenato-red transition-colors">{item.acordeonero}</span>
                                           </div>
                                           <ListMusic size={20} className="text-vallenato-mustard/30 group-hover/acordeon:text-vallenato-mustard transition-colors" />
                                        </div>
                                     </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-5">
                             {(items as AudioItem[]).map((item, index) => {
                               const isActive = currentAudioId === item.id;
                               return (
                                 <div key={item.id} onClick={() => onPlayAudio?.(item, audios)} className={`group relative overflow-hidden flex flex-col md:flex-row items-center gap-4 md:gap-10 px-8 py-6 rounded-[2.5rem] transition-all duration-500 cursor-pointer border-2 ${isActive ? 'bg-vallenato-cream/90 border-vallenato-red shadow-gold scale-[1.01] z-10' : 'bg-white/70 backdrop-blur-xl border-transparent hover:border-vallenato-mustard/40 hover:bg-white hover:shadow-xl hover:-translate-y-1'}`}>
                                    <div className="flex-shrink-0 relative">
                                       <div className={`p-4 rounded-[1.5rem] transition-all duration-700 shadow-lg ${isActive ? 'bg-vallenato-red text-white' : 'bg-vallenato-blue/5 text-vallenato-blue group-hover:bg-vallenato-blue group-hover:text-white group-hover:rotate-[360deg]'}`}>
                                          {isActive && isPlaying ? (
                                             <div className="flex gap-1 items-end h-6 w-6 justify-center">
                                               <div className="w-1.5 bg-white rounded-full animate-[wave_0.8s_infinite_ease-in-out]"></div>
                                               <div className="w-1.5 bg-white rounded-full animate-[wave_1.2s_infinite_ease-in-out]"></div>
                                               <div className="w-1.5 bg-white rounded-full animate-[wave_1s_infinite_ease-in-out]"></div>
                                             </div>
                                          ) : <Play size={24} fill="currentColor" className="ml-1"/>}
                                       </div>
                                       {isActive && isPlaying && <Disc size={14} className="absolute -top-1 -right-1 text-vallenato-mustard animate-spin" />}
                                    </div>
                                    <div className="flex-grow min-w-0 grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-0">
                                       <div className="md:col-span-5 min-w-0 pr-4 flex flex-col md:flex-row md:items-center gap-3">
                                          {item.numero && (
                                            <div className="hidden md:flex flex-shrink-0 bg-vallenato-red/10 px-2 py-1 rounded-md border border-vallenato-red/20">
                                              <span className="text-[10px] font-black uppercase tracking-widest text-vallenato-red">#{item.numero}</span>
                                            </div>
                                          )}
                                          <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                              {item.numero && (
                                                <div className="md:hidden flex-shrink-0 bg-vallenato-red/10 px-2 py-0.5 rounded-md border border-vallenato-red/20">
                                                  <span className="text-[9px] font-black uppercase tracking-widest text-vallenato-red">#{item.numero}</span>
                                                </div>
                                              )}
                                              <h4 className={`text-lg md:text-xl font-serif font-bold truncate transition-colors ${isActive ? 'text-vallenato-red' : 'text-vallenato-blue group-hover:text-vallenato-red'}`}>{item.titulo}</h4>
                                              {(item.reproducciones || 0) > 0 && (
                                                <span className="flex items-center gap-1 text-[9px] font-black text-gray-300 group-hover:text-vallenato-mustard transition-colors"><Headphones size={10} /> {formatPlays(item.reproducciones)}</span>
                                              )}
                                            </div>
                                            <p className="text-[10px] font-serif italic text-gray-400 mt-1">{item.fecha_publicacion}</p>
                                          </div>
                                       </div>
                                       <div className="md:col-span-2 border-l border-gray-100 md:pl-6">
                                          <div className="flex flex-col"><span className="text-[7.5px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Autor</span><span className="text-[10px] md:text-[11px] font-bold text-vallenato-blue/80 truncate uppercase tracking-wider">{item.autor}</span></div>
                                       </div>
                                       <div className="md:col-span-2 border-l border-gray-100 md:pl-6">
                                          <div className="flex flex-col"><span className="text-[7.5px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Voz</span><span className="text-[10px] md:text-[11px] font-bold text-vallenato-blue/80 truncate uppercase tracking-wider">{item.cantante}</span></div>
                                       </div>
                                       <div className="md:col-span-3 border-l border-gray-100 md:pl-6">
                                          <div className="flex flex-col"><span className="text-[7.5px] font-black text-vallenato-red uppercase tracking-[0.2em] mb-1">Acordeón</span><span className="text-xs md:text-sm font-serif font-bold text-vallenato-blue group-hover:text-vallenato-red transition-colors truncate">{item.acordeonero}</span></div>
                                       </div>
                                    </div>
                                    <div className="absolute top-1/2 -translate-y-1/2 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hidden lg:block">
                                       <div className="bg-vallenato-mustard/10 p-2.5 rounded-2xl text-vallenato-mustard shadow-sm border border-vallenato-mustard/20"><Info size={18} /></div>
                                    </div>
                                 </div>
                               );
                             })}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-16">
                <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                  {videos.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-vallenato-mustard/20">
                      <Video size={48} className="mx-auto mb-4 text-vallenato-blue/20" />
                      <p className="font-serif italic text-gray-400">No se encontraron videos con esos criterios...</p>
                      <button onClick={resetFilters} className="mt-4 text-vallenato-red font-bold text-xs uppercase tracking-widest hover:underline">Limpiar filtros</button>
                    </div>
                  ) : (
                    videos.map((item) => (
                      <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-gold transition-all duration-500 cursor-pointer group relative border border-white" onClick={() => { onVideoOpen?.(); setSelectedVideo(item); setIsModalOpen(true); }}>
                        <div className="aspect-video relative overflow-hidden bg-black">
                            {item.thumbnail_url && <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[2s]" alt={item.titulo} loading="lazy" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-vallenato-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-4 left-4 z-10 opacity-100 transition-opacity duration-500">
                              {item.numero && (
                                <div className="bg-vallenato-red text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-vallenato-red/20 shadow-md">
                                   <span className="text-[10px] font-black uppercase tracking-widest text-white">#{item.numero}</span>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/20 backdrop-blur-xl p-8 rounded-full border border-white/40 shadow-2xl transform group-hover:scale-125 transition-transform duration-500"><Play size={48} className="text-white fill-white" /></div>
                            </div>
                        </div>
                        <div className="p-10">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="bg-vallenato-red h-1.5 w-16 rounded-full"></div>
                              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-vallenato-red">Estampas Vallenatas</span>
                            </div>
                            <h3 className="text-3xl font-serif text-vallenato-blue font-bold mb-6 group-hover:text-vallenato-red transition-colors leading-tight">{item.titulo}</h3>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="flex flex-col gap-2">
                                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Autor</span>
                                  <div className="flex items-center gap-3"><User size={14} className="text-vallenato-mustard" /><span className="text-sm font-bold text-vallenato-blue truncate">{item.autor}</span></div>
                              </div>
                              <div className="flex flex-col gap-2">
                                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Intérprete</span>
                                  <div className="flex items-center gap-3"><Mic2 size={14} className="text-vallenato-red" /><span className="text-sm font-bold text-vallenato-blue truncate">{item.interprete}</span></div>
                              </div>
                            </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="relative overflow-hidden bg-vallenato-dark rounded-[3rem] p-8 md:p-16 shadow-2xl group/youtube">
                   <div className="absolute inset-0 opacity-20 group-hover/youtube:opacity-30 transition-opacity duration-700"><img src="https://i.imgur.com/wIBYz82.jpeg" className="w-full h-full object-cover scale-110 group-hover/youtube:scale-125 transition-transform duration-10000" alt="Estampas Vallenatas Canal" /></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-vallenato-dark via-vallenato-dark/90 to-transparent"></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                      <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-vallenato-mustard/30 overflow-hidden shadow-2xl flex-shrink-0 group-hover/youtube:border-vallenato-red/50 transition-colors"><img src="https://i.imgur.com/wIBYz82.jpeg" className="w-full h-full object-cover" alt="Avatar Canal" /></div>
                      <div className="flex-grow text-center md:text-left">
                         <div className="inline-flex items-center gap-2 bg-vallenato-red/20 px-4 py-1.5 rounded-full mb-6 border border-vallenato-red/30"><Youtube size={14} className="text-vallenato-red" /><span className="text-vallenato-red text-[10px] font-black uppercase tracking-[0.2em]">Archivo audiovisual completo</span></div>
                         <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">¿Quiere ver más videos? <br className="hidden md:block" /> <span className="text-vallenato-mustard">Explore nuestro canal oficial de YouTube</span></h2>
                         <a href="https://www.youtube.com/@EstampasVallenatasColombia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-vallenato-red hover:bg-white text-white hover:text-vallenato-blue px-10 py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-xl hover:shadow-red-500/20 group/btn">Visitar canal de YouTube <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></a>
                      </div>
                   </div>
                </div>
              </div>
            )}
            {activeTab === 'audio' && hasMoreAudios && !loading && (
              <div className="flex justify-center pt-16">
                 <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore} className="min-w-[240px] border-vallenato-mustard/30 hover:border-vallenato-mustard">
                   {loadingMore ? <span className="flex items-center gap-3"><Loader2 size={20} className="animate-spin" /> Cargando más...</span> : <span className="flex items-center gap-3">Explorar más estampas <ChevronDown size={20} /></span>}
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
