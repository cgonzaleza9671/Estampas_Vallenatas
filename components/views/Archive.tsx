
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAudios, fetchVideos } from '../../services/supabaseClient.ts';
import { AudioItem, VideoItem } from '../../types.ts';
import MediaModal from '../MediaModal.tsx';
import Button from '../Button.tsx';
import { Music, Video, Loader2, AlertCircle, RefreshCw, Play, Pause, Search, LayoutGrid, List, User, Mic2, ListMusic, Calendar, ChevronDown, Award } from 'lucide-react';

interface ArchiveProps {
  initialTab?: 'audio' | 'video';
  onPlayAudio?: (audio: AudioItem, list?: AudioItem[]) => void;
  onVideoOpen?: () => void;
  currentAudioId?: number;
  isPlaying?: boolean;
}

const Archive: React.FC<ArchiveProps> = ({ initialTab = 'audio', onPlayAudio, onVideoOpen, currentAudioId, isPlaying }) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>(initialTab);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [selectedAudioAuthor, setSelectedAudioAuthor] = useState('All'); 
  const [selectedAudioSinger, setSelectedAudioSinger] = useState('All'); 
  const [selectedAudioAccordion, setSelectedAudioAccordion] = useState('All'); 
  const [selectedVideoAuthor, setSelectedVideoAuthor] = useState('All'); 
  const [selectedVideoInterpreter, setSelectedVideoInterpreter] = useState('All'); 

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
  };

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(false);
    setCurrentPage(0);
    try {
      const [fetchedAudios, fetchedVideos] = await Promise.all([
        fetchAudios(0, 24),
        fetchVideos()
      ]);
      setAudios(fetchedAudios);
      setVideos(fetchedVideos);
      setHasMore(fetchedAudios.length === 24);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreAudios = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    try {
      const moreAudios = await fetchAudios(nextPage, 24);
      if (moreAudios.length < 24) setHasMore(false);
      setAudios(prev => [...prev, ...moreAudios]);
      setCurrentPage(nextPage);
    } catch (e) {
      console.error("Error loading more audios", e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const formatDateLabel = (fullDate: string) => {
    const parts = fullDate.split(' de ');
    if (parts.length >= 3) return `${parts[1]} ${parts[2]}`;
    return fullDate;
  };

  const formatBadgeDate = (dateStr: string) => {
    return dateStr.replace(/ de /g, ' ');
  };

  const groupedAudios = useMemo(() => {
    let items = audios;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.titulo.toLowerCase().includes(query) || 
        item.cantante.toLowerCase().includes(query) ||
        item.autor.toLowerCase().includes(query)
      );
    }
    if (selectedAudioAuthor !== 'All') items = items.filter(item => item.autor === selectedAudioAuthor);
    if (selectedAudioSinger !== 'All') items = items.filter(item => item.cantante === selectedAudioSinger);
    if (selectedAudioAccordion !== 'All') items = items.filter(item => item.acordeonero === selectedAudioAccordion);

    const groups: { [key: string]: AudioItem[] } = {};
    items.forEach(item => {
      const parts = item.fecha_publicacion.split(' de ');
      const key = parts.length >= 3 ? `${parts[1]} de ${parts[2]}` : "Colección Histórica";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [audios, searchQuery, selectedAudioAuthor, selectedAudioSinger, selectedAudioAccordion]);

  const filteredVideos = useMemo<VideoItem[]>(() => {
    let items = videos;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.titulo.toLowerCase().includes(query) || 
        item.interprete.toLowerCase().includes(query) ||
        item.autor.toLowerCase().includes(query)
      );
    }
    if (selectedVideoAuthor !== 'All') items = items.filter(item => item.autor === selectedVideoAuthor);
    if (selectedVideoInterpreter !== 'All') items = items.filter(item => item.interprete === selectedVideoInterpreter);
    return items;
  }, [videos, searchQuery, selectedVideoAuthor, selectedVideoInterpreter]);

  const uniqueAudioAuthors = useMemo(() => {
    const list = Array.from(new Set(audios.map(i => i.autor).filter(Boolean))) as string[];
    return ['All', ...list.sort((a, b) => a.localeCompare(b))];
  }, [audios]);

  const uniqueAudioSingers = useMemo(() => {
    const list = Array.from(new Set(audios.map(i => i.cantante).filter(Boolean))) as string[];
    return ['All', ...list.sort((a, b) => a.localeCompare(b))];
  }, [audios]);

  const uniqueAudioAccordions = useMemo(() => {
    const list = Array.from(new Set(audios.map(i => i.acordeonero).filter(v => v && v !== "-"))) as string[];
    return ['All', ...list.sort((a, b) => a.localeCompare(b))];
  }, [audios]);

  const uniqueVideoAuthors = useMemo(() => {
    const list = Array.from(new Set(videos.map(i => i.autor).filter(Boolean))) as string[];
    return ['All', ...list.sort((a, b) => a.localeCompare(b))];
  }, [videos]);

  const uniqueVideoInterpreters = useMemo(() => {
    const list = Array.from(new Set(videos.map(i => i.interprete).filter(v => v && v !== "-"))) as string[];
    return ['All', ...list.sort((a, b) => a.localeCompare(b))];
  }, [videos]);

  return (
    <div className="min-h-screen bg-vallenato-beige pt-8 pb-32 animate-fade-in-up relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center mb-8">
          <span className="text-vallenato-red font-bold uppercase tracking-widest text-[10px] md:text-xs">Museo Digital Estampas Vallenatas</span>
          <h1 className="text-4xl md:text-6xl font-serif text-vallenato-blue mb-4 font-bold tracking-tight">La Memoria del Acordeón</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-serif italic text-base md:text-lg">Navegue por nuestro museo. Utilice los filtros para mejorar la navegabilidad</p>
        </div>

        <div className="flex justify-center mb-12">
           <div className="bg-white/40 backdrop-blur-sm p-1.5 rounded-2xl shadow-inner border border-white/50 inline-flex">
              <button onClick={() => setActiveTab('audio')} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'audio' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue hover:bg-white/50'}`}><Music size={16} /> Audios</button>
              <button onClick={() => setActiveTab('video')} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue hover:bg-white/50'}`}><Video size={16} /> Videos</button>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-museum mb-10 border border-vallenato-mustard/10 max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-center">
              <div className="col-span-1 lg:col-span-3">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard group-focus-within:text-vallenato-red transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder={toTitleCase(activeTab === 'audio' ? "Buscar por título, autor o cantante..." : "Buscar por título, autor o intérprete...")}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-sm font-sans" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                 </div>
              </div>

              {activeTab === 'audio' ? (
                <>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioAuthor} onChange={(e) => setSelectedAudioAuthor(e.target.value)}>
                        <option value="All">{toTitleCase("Todos los autores")}</option>
                        {uniqueAudioAuthors.filter(a => a !== 'All').map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioSinger} onChange={(e) => setSelectedAudioSinger(e.target.value)}>
                        <option value="All">{toTitleCase("Todos los cantantes")}</option>
                        {uniqueAudioSingers.filter(s => s !== 'All').map(s => <option key={s} value={s}>{toTitleCase(s)}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioAccordion} onChange={(e) => setSelectedAudioAccordion(e.target.value)}>
                        <option value="All">{toTitleCase("Todos los acordeoneros")}</option>
                        {uniqueAudioAccordions.filter(a => a !== 'All').map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div className="col-span-1 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedVideoAuthor} onChange={(e) => setSelectedVideoAuthor(e.target.value)}>
                        <option value="All">{toTitleCase("Todos los autores")}</option>
                        {uniqueVideoAuthors.filter(a => a !== 'All').map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}
                    </select>
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedVideoInterpreter} onChange={(e) => setSelectedVideoInterpreter(e.target.value)}>
                        <option value="All">{toTitleCase("Todos los intérpretes")}</option>
                        {uniqueVideoInterpreters.filter(i => i !== 'All').map(i => <option key={i} value={i}>{toTitleCase(i)}</option>)}
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
             <p className="font-serif italic text-xl animate-pulse">Abriendo el archivo del Magdalena Grande...</p>
           </div>
        ) : error ? (
           <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
             <AlertCircle size={64} className="text-vallenato-red mx-auto mb-6" />
             <p className="text-xl font-serif text-vallenato-blue mb-4">No pudimos conectar con la fonoteca en este momento.</p>
             <button onClick={loadInitialData} className="inline-flex items-center gap-3 bg-vallenato-blue text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-vallenato-red transition-colors shadow-lg">
               <RefreshCw size={18}/> Reintentar conexión
             </button>
           </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'audio' ? (
              <div className="space-y-12">
                
                <div className="flex justify-end items-center px-4 border-b border-vallenato-mustard/20 pb-4 gap-4">
                  <span className="text-[10px] font-bold uppercase text-vallenato-red tracking-[0.3em] opacity-80 mr-2">{toTitleCase("Modo de consulta")}</span>
                  
                  <div className="flex bg-vallenato-blue/5 rounded-2xl p-1.5 gap-1.5">
                    <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-vallenato-blue/40 hover:text-vallenato-blue hover:bg-white'}`}>
                      <LayoutGrid size={20} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-vallenato-blue text-white shadow-xl' : 'text-vallenato-blue/40 hover:text-vallenato-blue hover:bg-white'}`}>
                      <List size={20} />
                    </button>
                  </div>
                </div>

                {Object.keys(groupedAudios).length === 0 ? (
                  <div className="text-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-vallenato-mustard/20">
                    <Music size={48} className="mx-auto mb-4 text-vallenato-blue/20" />
                    <p className="font-serif italic text-gray-400">No se encontraron estampas con esos criterios...</p>
                  </div>
                ) : (
                  <>
                    {(Object.entries(groupedAudios) as [string, AudioItem[]][]).map(([groupName, items]) => (
                      <div key={groupName} className="space-y-8">
                        <div className="flex items-center gap-8">
                          <h3 className="text-vallenato-blue font-serif text-3xl md:text-4xl font-bold capitalize whitespace-nowrap tracking-tight">{toTitleCase(groupName)}</h3>
                          <div className="h-[1.5px] bg-gradient-to-r from-vallenato-mustard/60 via-vallenato-mustard/20 to-transparent flex-grow"></div>
                        </div>
                        
                        {viewMode === 'grid' ? (
                          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                              <div 
                                key={item.id} 
                                onClick={() => onPlayAudio?.(item, items)} 
                                className={`group relative min-h-[220px] bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-gold transition-all duration-500 border-2 ${currentAudioId === item.id ? 'border-vallenato-red bg-vallenato-cream' : 'border-vallenato-mustard/40 hover:border-vallenato-mustard'} cursor-pointer flex flex-col overflow-hidden`}
                              >
                                {/* Fondo Decorativo sutil */}
                                <div className="absolute top-1/2 -right-10 w-24 h-24 bg-vallenato-blue rounded-full border-4 border-vallenato-mustard/10 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all duration-700 pointer-events-none z-0"></div>

                                {/* Fecha Badge Superior */}
                                <div className="z-10 flex items-center mb-4">
                                   <div className="bg-vallenato-mustard/10 text-vallenato-mustard px-2.5 py-1 rounded-full border border-vallenato-mustard/20">
                                      <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{formatBadgeDate(item.fecha_publicacion)}</span>
                                   </div>
                                </div>

                                {/* Cuerpo Central: Título y Badges con Espaciado Equilibrado */}
                                <div className="flex-grow flex flex-col justify-center relative z-10">
                                   <h4 className="text-lg md:text-xl font-serif text-vallenato-blue font-bold group-hover:text-vallenato-red transition-colors mb-4 pr-2 leading-tight line-clamp-2">
                                     {item.titulo}
                                   </h4>
                                   
                                   <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2.5 bg-vallenato-blue/5 px-3 py-1.5 rounded-xl group-hover:bg-vallenato-blue transition-colors group-hover:text-white border border-vallenato-blue/5 w-fit max-w-full overflow-hidden">
                                         <User size={12} className="text-vallenato-mustard shrink-0" />
                                         <span className="text-[10px] font-bold uppercase tracking-wider truncate">{item.autor}</span>
                                      </div>
                                      <div className="flex items-center gap-2.5 bg-vallenato-red/5 px-3 py-1.5 rounded-xl group-hover:bg-vallenato-red transition-colors group-hover:text-white border border-vallenato-red/5 w-fit max-w-full overflow-hidden">
                                         <Mic2 size={12} className="text-vallenato-red group-hover:text-white shrink-0" />
                                         <span className="text-[10px] font-bold uppercase tracking-wider truncate">{item.cantante}</span>
                                      </div>
                                   </div>
                                </div>

                                {/* Footer: Divisor e info del acordeón */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
                                  <div className="flex flex-col">
                                     <span className="text-[7.5px] uppercase font-black text-gray-400 tracking-tighter mb-0.5">ACORDEÓN</span>
                                     <span className="text-[11px] font-bold text-vallenato-blue leading-none">{item.acordeonero}</span>
                                  </div>
                                  
                                  <div className={`p-3 rounded-full transition-all duration-500 shadow-lg ${currentAudioId === item.id && isPlaying ? 'bg-vallenato-red text-white scale-110' : 'bg-vallenato-blue text-white group-hover:scale-110 group-hover:bg-vallenato-red'}`}>
                                    {currentAudioId === item.id && isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-0.5"/>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-vallenato-mustard/10 overflow-hidden">
                             <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-6 bg-vallenato-blue/5 border-b border-vallenato-mustard/20">
                                <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">#</div>
                                <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">{toTitleCase("Canción")}</div>
                                <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">{toTitleCase("Autor")}</div>
                                <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">{toTitleCase("Voz")}</div>
                                <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">{toTitleCase("Acordeonero")}</div>
                                <div className="col-span-1 text-right text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">{toTitleCase("Mes")}</div>
                             </div>
                             
                             <div className="divide-y divide-gray-100/50">
                                {items.map((item, index) => (
                                  <div key={item.id} onClick={() => onPlayAudio?.(item, items)} className={`group grid grid-cols-1 lg:grid-cols-12 items-center gap-4 px-8 md:px-10 py-6 transition-all duration-300 cursor-pointer border-l-8 ${currentAudioId === item.id ? 'bg-vallenato-cream/60 border-vallenato-red' : 'hover:bg-vallenato-cream/30 hover:border-vallenato-mustard/50 border-transparent'}`}>
                                    <div className="col-span-1 hidden lg:flex items-center">
                                       {currentAudioId === item.id && isPlaying ? (
                                          <div className="flex gap-1 items-end h-4">
                                            <div className="w-1 bg-vallenato-red animate-[wave_0.8s_infinite_ease-in-out]"></div>
                                            <div className="w-1 bg-vallenato-red animate-[wave_1.2s_infinite_ease-in-out]"></div>
                                            <div className="w-1 bg-vallenato-red animate-[wave_1s_infinite_ease-in-out]"></div>
                                          </div>
                                       ) : (
                                          <span className="font-mono text-xs opacity-30 group-hover:opacity-100 transition-opacity">{(index + 1).toString().padStart(2, '0')}</span>
                                       )}
                                    </div>
                                    <div className="col-span-1 lg:col-span-4 flex items-center gap-6">
                                       <div className={`p-3 rounded-2xl flex-shrink-0 transition-all duration-500 shadow-md ${currentAudioId === item.id ? 'bg-vallenato-red text-white scale-110' : 'bg-vallenato-blue/5 text-vallenato-blue group-hover:bg-vallenato-blue group-hover:text-white group-hover:scale-110'}`}>
                                          {currentAudioId === item.id && isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-0.5"/>}
                                       </div>
                                       <div className="min-w-0">
                                          <h4 className={`text-base md:text-lg font-serif font-bold truncate leading-tight transition-colors ${currentAudioId === item.id ? 'text-vallenato-red' : 'text-vallenato-blue group-hover:text-vallenato-red'}`}>{item.titulo}</h4>
                                       </div>
                                    </div>
                                    <div className="hidden lg:block col-span-2">
                                       <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                          <User size={14} className="text-vallenato-mustard shrink-0" />
                                          <span className="text-[11px] font-bold uppercase tracking-tighter truncate">{item.autor}</span>
                                       </div>
                                    </div>
                                    <div className="hidden lg:block col-span-2">
                                       <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                          <Mic2 size={14} className="text-vallenato-red shrink-0" />
                                          <span className="text-[11px] font-bold uppercase tracking-tighter truncate">{item.cantante}</span>
                                       </div>
                                    </div>
                                    <div className="hidden lg:block col-span-2">
                                       <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                          <ListMusic size={14} className="text-vallenato-blue shrink-0" />
                                          <span className="text-[11px] font-bold uppercase tracking-tighter truncate">{item.acordeonero}</span>
                                       </div>
                                    </div>
                                    <div className="col-span-1 text-right hidden lg:block">
                                       <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-all">{formatDateLabel(item.fecha_publicacion)}</span>
                                    </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {hasMore && (
                      <div className="flex justify-center pt-10">
                         <Button variant="outline" onClick={loadMoreAudios} disabled={loadingMore} className="min-w-[240px] border-vallenato-mustard/30 hover:border-vallenato-mustard">
                           {loadingMore ? (
                             <span className="flex items-center gap-3"><Loader2 size={20} className="animate-spin" /> {toTitleCase("Cargando estampas...")}</span>
                           ) : (
                             <span className="flex items-center gap-3">{toTitleCase("Explorar más estampas")} <ChevronDown size={20} /></span>
                           )}
                         </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                {filteredVideos.map((item) => (
                  <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-gold transition-all duration-500 cursor-pointer group relative border border-white" onClick={() => { onVideoOpen?.(); setSelectedVideo(item); setIsModalOpen(true); }}>
                     <div className="aspect-video relative overflow-hidden bg-black">
                        {item.thumbnail_url && <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[2s]" alt={item.titulo}/>}
                        <div className="absolute inset-0 bg-gradient-to-t from-vallenato-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/20 backdrop-blur-xl p-8 rounded-full border border-white/40 shadow-2xl transform group-hover:scale-125 transition-transform duration-500">
                             <Play size={48} className="text-white fill-white" />
                           </div>
                        </div>
                     </div>
                     <div className="p-10">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="bg-vallenato-red h-1.5 w-16 rounded-full"></div>
                           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-vallenato-red">{toTitleCase("Videos")}</span>
                        </div>
                        <h3 className="text-3xl font-serif text-vallenato-blue font-bold mb-6 group-hover:text-vallenato-red transition-colors leading-tight">{item.titulo}</h3>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="flex flex-col gap-2">
                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{toTitleCase("Autor")}</span>
                              <div className="flex items-center gap-3"><User size={14} className="text-vallenato-mustard" /><span className="text-sm font-bold text-vallenato-blue truncate">{item.autor}</span></div>
                           </div>
                           <div className="flex flex-col gap-2">
                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{toTitleCase("Intérprete")}</span>
                              <div className="flex items-center gap-3"><Mic2 size={14} className="text-vallenato-red" /><span className="text-sm font-bold text-vallenato-blue truncate">{item.interprete}</span></div>
                           </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                           <div className="flex items-center gap-3 text-gray-400 font-bold"><Calendar size={18} /><span className="text-sm">{toTitleCase(`Año ${item.anio}`)}</span></div>
                           <button className="text-vallenato-blue font-bold uppercase text-[11px] tracking-widest flex items-center gap-3 group-hover:text-vallenato-red transition-colors">Ver ahora <Play size={12} fill="currentColor"/></button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <MediaModal item={selectedVideo} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <style>{`
        @keyframes wave {
          0%, 100% { height: 6px; transform: scaleY(1); }
          50% { height: 22px; transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
};

export default Archive;
