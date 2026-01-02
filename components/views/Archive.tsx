
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAudios, fetchVideos } from '../../services/supabaseClient';
import { AudioItem, VideoItem } from '../../types';
import MediaModal from '../MediaModal';
import { Music, Video, Loader2, AlertCircle, RefreshCw, Play, Pause, Search, LayoutGrid, List, User, Mic2, ListMusic, Calendar } from 'lucide-react';
import { SombreroVueltiaoIcon } from '../CustomIcons';

interface ArchiveProps {
  initialTab?: 'audio' | 'video';
  onPlayAudio?: (audio: AudioItem) => void;
  currentAudioId?: number;
  isPlaying?: boolean;
}

const Archive: React.FC<ArchiveProps> = ({ initialTab = 'audio', onPlayAudio, currentAudioId, isPlaying }) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>(initialTab);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio Filters
  const [selectedAudioAuthor, setSelectedAudioAuthor] = useState('All'); 
  const [selectedAudioSinger, setSelectedAudioSinger] = useState('All'); 
  const [selectedAudioAccordion, setSelectedAudioAccordion] = useState('All'); 
  
  // Video Filters
  const [selectedVideoAuthor, setSelectedVideoAuthor] = useState('All'); 
  const [selectedVideoInterpreter, setSelectedVideoInterpreter] = useState('All'); 

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [fetchedAudios, fetchedVideos] = await Promise.all([fetchAudios(), fetchVideos()]);
      setAudios(fetchedAudios);
      setVideos(fetchedVideos);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const formatDateLabel = (fullDate: string) => {
    const parts = fullDate.split(' de ');
    if (parts.length >= 3) return `${parts[1]} ${parts[2]}`;
    return fullDate;
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
    if (selectedAudioAuthor !== 'All') {
      items = items.filter(item => item.autor === selectedAudioAuthor);
    }
    if (selectedAudioSinger !== 'All') {
      items = items.filter(item => item.cantante === selectedAudioSinger);
    }
    if (selectedAudioAccordion !== 'All') {
      items = items.filter(item => item.acordeonero === selectedAudioAccordion);
    }
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
        item.interprete.toLowerCase().includes(query)
      );
    }
    if (selectedVideoAuthor !== 'All') {
      items = items.filter(item => item.autor === selectedVideoAuthor);
    }
    if (selectedVideoInterpreter !== 'All') {
      items = items.filter(item => item.interprete === selectedVideoInterpreter);
    }
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
        
        {/* Header Archive */}
        <div className="text-center mb-10">
          <span className="text-vallenato-red font-bold uppercase tracking-widest text-[10px] md:text-xs">Museo Digital Estampas Vallenatas</span>
          <h1 className="text-4xl md:text-6xl font-serif text-vallenato-blue mb-4 font-bold tracking-tight">La Memoria del Acordeón</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-serif italic text-base md:text-lg">"Navegue por el índice histórico de nuestra música tradicional"</p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-10">
           <div className="bg-white/40 backdrop-blur-sm p-1.5 rounded-2xl shadow-inner border border-white/50 inline-flex">
              <button onClick={() => setActiveTab('audio')} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'audio' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue hover:bg-white/50'}`}><Music size={16} /> Audios</button>
              <button onClick={() => setActiveTab('video')} className={`px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-vallenato-blue text-white shadow-xl scale-105' : 'text-vallenato-blue/60 hover:text-vallenato-blue hover:bg-white/50'}`}><Video size={16} /> Videos</button>
           </div>
        </div>

        {/* Filtros Modernos */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-museum mb-12 border border-vallenato-mustard/10 max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-center">
              
              <div className="col-span-1 lg:col-span-4">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard group-focus-within:text-vallenato-red transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Buscar por título, autor o intérprete..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-sm font-sans" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                 </div>
              </div>

              {activeTab === 'audio' ? (
                <>
                  <div className="col-span-1 lg:col-span-2">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold uppercase tracking-tighter cursor-pointer" value={selectedAudioAuthor} onChange={(e) => setSelectedAudioAuthor(e.target.value)}>
                        <option value="All">Autor</option>
                        {uniqueAudioAuthors.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold uppercase tracking-tighter cursor-pointer" value={selectedAudioSinger} onChange={(e) => setSelectedAudioSinger(e.target.value)}>
                        <option value="All">Cantante</option>
                        {uniqueAudioSingers.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold uppercase tracking-tighter cursor-pointer" value={selectedAudioAccordion} onChange={(e) => setSelectedAudioAccordion(e.target.value)}>
                        <option value="All">Acordeonero</option>
                        {uniqueAudioAccordions.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div className="col-span-1 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold uppercase tracking-tighter cursor-pointer" value={selectedVideoAuthor} onChange={(e) => setSelectedVideoAuthor(e.target.value)}>
                        <option value="All">Autor</option>
                        {uniqueVideoAuthors.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold uppercase tracking-tighter cursor-pointer" value={selectedVideoInterpreter} onChange={(e) => setSelectedVideoInterpreter(e.target.value)}>
                        <option value="All">Intérprete</option>
                        {uniqueVideoInterpreters.filter(i => i !== 'All').map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
              )}
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center h-80 text-vallenato-blue">
             <div className="relative">
                <Loader2 size={64} className="animate-spin text-vallenato-mustard mb-6" />
                <SombreroVueltiaoIcon size={24} className="absolute inset-0 m-auto text-vallenato-red" />
             </div>
             <p className="font-serif italic text-xl animate-pulse">Abriendo el archivo del Magdalena Grande...</p>
           </div>
        ) : error ? (
           <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
             <AlertCircle size={64} className="text-vallenato-red mx-auto mb-6" />
             <p className="text-xl font-serif text-vallenato-blue mb-4">No pudimos conectar con la fonoteca en este momento.</p>
             <button onClick={loadData} className="inline-flex items-center gap-3 bg-vallenato-blue text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-vallenato-red transition-colors shadow-lg">
               <RefreshCw size={18}/> Reintentar conexión
             </button>
           </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'audio' ? (
              <div className="space-y-16">
                
                {/* Visualizer Controls */}
                <div className="flex justify-between items-end px-4 border-b border-vallenato-mustard/20 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-vallenato-red tracking-[0.3em]">Modo de consulta</span>
                    <h2 className="text-vallenato-blue font-serif text-2xl font-bold">Fonoteca Histórica</h2>
                  </div>
                  
                  <div className="flex bg-vallenato-blue/5 rounded-xl p-1 gap-1">
                    <div className="relative group">
                      <button 
                        onClick={() => setViewMode('grid')} 
                        className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-vallenato-blue/40 hover:text-vallenato-blue hover:bg-white'}`}
                      >
                        <LayoutGrid size={20} />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-vallenato-blue text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl pointer-events-none border border-white/10">
                        Vista de cuadrícula
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-vallenato-blue"></div>
                      </div>
                    </div>

                    <div className="relative group">
                      <button 
                        onClick={() => setViewMode('list')} 
                        className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-vallenato-blue/40 hover:text-vallenato-blue hover:bg-white'}`}
                      >
                        <List size={20} />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-vallenato-blue text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl pointer-events-none border border-white/10">
                        Vista en listado
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-vallenato-blue"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {Object.keys(groupedAudios).length === 0 ? (
                  <div className="text-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-vallenato-mustard/20">
                    <Music size={48} className="mx-auto mb-4 text-vallenato-blue/20" />
                    <p className="font-serif italic text-gray-400">No se encontraron estampas con esos criterios...</p>
                  </div>
                ) : (
                  (Object.entries(groupedAudios) as [string, AudioItem[]][]).map(([groupName, items]) => (
                    <div key={groupName} className="space-y-8">
                      <div className="flex items-center gap-6">
                        <h3 className="text-vallenato-blue font-serif text-2xl md:text-3xl font-bold capitalize whitespace-nowrap">{groupName}</h3>
                        <div className="h-[1px] bg-gradient-to-r from-vallenato-mustard/40 to-transparent flex-grow"></div>
                      </div>
                      
                      {viewMode === 'grid' ? (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                          {items.map((item) => (
                            <div key={item.id} onClick={() => onPlayAudio?.(item)} className={`group bg-white rounded-[2rem] p-7 shadow-sm hover:shadow-museum transition-all duration-500 border-2 ${currentAudioId === item.id ? 'border-vallenato-red bg-vallenato-cream' : 'border-transparent hover:border-vallenato-mustard/30'} cursor-pointer flex flex-col relative overflow-hidden`}>
                              {currentAudioId === item.id && isPlaying && <div className="absolute top-0 right-0 p-4"><div className="flex gap-0.5 items-end h-4"><div className="w-1 bg-vallenato-red animate-[wave_1s_infinite_ease-in-out]"></div><div className="w-1 bg-vallenato-red animate-[wave_1.2s_infinite_ease-in-out]"></div><div className="w-1 bg-vallenato-red animate-[wave_0.8s_infinite_ease-in-out]"></div></div></div>}
                              <div className="flex justify-between items-start mb-6"><div className="bg-vallenato-blue/5 p-3 rounded-2xl text-vallenato-blue group-hover:bg-vallenato-blue group-hover:text-white transition-colors"><Music size={24} /></div><SombreroVueltiaoIcon size={44} className="text-vallenato-blue/10 group-hover:text-vallenato-mustard transition-colors" /></div>
                              <h4 className="text-xl font-serif text-vallenato-blue font-bold group-hover:text-vallenato-red transition-colors mb-3 leading-tight">{item.titulo}</h4>
                              <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2"><User size={12} className="text-vallenato-mustard" /><span className="text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/70">{item.autor}</span></div>
                                <div className="flex items-center gap-2"><Mic2 size={12} className="text-vallenato-red" /><span className="text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/70">{item.cantante}</span></div>
                              </div>
                              <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex flex-col"><span className="text-[8px] uppercase font-bold text-gray-400">Acordeonero</span><span className="text-[11px] font-bold text-vallenato-blue">{item.acordeonero}</span></div>
                                <div className={`p-3 rounded-full transition-all duration-300 ${currentAudioId === item.id && isPlaying ? 'bg-vallenato-red text-white scale-110 shadow-lg' : 'bg-vallenato-blue text-white hover:scale-110 hover:bg-vallenato-red'}`}>{currentAudioId === item.id && isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-0.5"/>}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* RE-DISEÑO DE LISTA TIPO FONOTECA EDITORIAL MODERNA */
                        <div className="bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-vallenato-mustard/10 overflow-hidden">
                           {/* Header de columnas actualizado */}
                           <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 bg-vallenato-blue/5 border-b border-vallenato-mustard/20">
                              <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">#</div>
                              <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">Canción</div>
                              <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">Autor</div>
                              <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">Voz</div>
                              <div className="col-span-2 text-[10px) font-bold uppercase tracking-widest text-vallenato-blue/40">Acordeonero</div>
                              <div className="col-span-1 text-right text-[10px] font-bold uppercase tracking-widest text-vallenato-blue/40">Mes</div>
                           </div>
                           
                           <div className="divide-y divide-gray-100/50">
                              {items.map((item, index) => (
                                <div 
                                  key={item.id} 
                                  onClick={() => onPlayAudio?.(item)} 
                                  className={`group grid grid-cols-1 lg:grid-cols-12 items-center gap-4 px-6 md:px-8 py-5 transition-all duration-300 cursor-pointer border-l-8 ${currentAudioId === item.id ? 'bg-vallenato-cream/60 border-vallenato-red' : 'hover:bg-vallenato-cream/30 hover:border-vallenato-mustard/50 border-transparent'}`}
                                >
                                  {/* Visual Status / Number */}
                                  <div className="col-span-1 hidden lg:flex items-center">
                                     {currentAudioId === item.id && isPlaying ? (
                                        <div className="flex gap-0.5 items-end h-3">
                                          <div className="w-1 bg-vallenato-red animate-[wave_0.8s_infinite_ease-in-out]"></div>
                                          <div className="w-1 bg-vallenato-red animate-[wave_1.2s_infinite_ease-in-out]"></div>
                                          <div className="w-1 bg-vallenato-red animate-[wave_1s_infinite_ease-in-out]"></div>
                                        </div>
                                     ) : (
                                        <span className="font-mono text-xs opacity-30 group-hover:opacity-100 transition-opacity">{(index + 1).toString().padStart(2, '0')}</span>
                                     )}
                                  </div>
                                  
                                  <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
                                     <div className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 ${currentAudioId === item.id ? 'bg-vallenato-red text-white rotate-0' : 'bg-vallenato-blue/5 text-vallenato-blue group-hover:bg-vallenato-blue group-hover:text-white -rotate-3 group-hover:rotate-0'}`}>
                                        {currentAudioId === item.id && isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-0.5"/>}
                                     </div>
                                     <div className="min-w-0">
                                        <h4 className={`text-sm md:text-base font-serif font-bold truncate leading-tight transition-colors ${currentAudioId === item.id ? 'text-vallenato-red' : 'text-vallenato-blue group-hover:text-vallenato-red'}`}>{item.titulo}</h4>
                                        <div className="lg:hidden flex items-center gap-3 mt-1 opacity-60">
                                           <span className="text-[9px] font-bold uppercase tracking-tighter truncate max-w-[80px]">{item.autor}</span>
                                           <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                                           <span className="text-[9px] font-bold uppercase tracking-tighter truncate max-w-[80px]">{item.cantante}</span>
                                        </div>
                                     </div>
                                  </div>

                                  {/* Desktop Metadatos - Clean & Spaced */}
                                  <div className="hidden lg:block col-span-2">
                                     <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <User size={12} className="text-vallenato-mustard shrink-0" />
                                        <span className="text-[11px] font-bold uppercase tracking-tighter truncate">{item.autor}</span>
                                     </div>
                                  </div>
                                  <div className="hidden lg:block col-span-2">
                                     <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <Mic2 size={12} className="text-vallenato-red shrink-0" />
                                        <span className="text-[11px] font-bold uppercase tracking-tighter truncate">{item.cantante}</span>
                                     </div>
                                  </div>
                                  <div className="hidden lg:block col-span-2">
                                     <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <ListMusic size={12} className="text-vallenato-blue shrink-0" />
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
                  ))
                )}
              </div>
            ) : (
              <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
                {filteredVideos.map((item) => (
                  <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-museum transition-all duration-500 cursor-pointer group relative border border-white" onClick={() => { setSelectedVideo(item); setIsModalOpen(true); }}>
                     <div className="aspect-video relative overflow-hidden bg-black">
                        {item.thumbnail_url && <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[2s]" alt={item.titulo}/>}
                        <div className="absolute inset-0 bg-gradient-to-t from-vallenato-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/40 shadow-2xl transform group-hover:scale-125 transition-transform duration-500">
                             <Play size={40} className="text-white fill-white" />
                           </div>
                        </div>
                     </div>
                     <div className="p-8">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="bg-vallenato-red h-1 w-12 rounded-full"></div>
                           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-vallenato-red">Archivo Fílmico</span>
                        </div>
                        <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-4 group-hover:text-vallenato-red transition-colors">{item.titulo}</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Autor</span>
                              <div className="flex items-center gap-2"><User size={12} className="text-vallenato-mustard" /><span className="text-xs font-bold text-vallenato-blue truncate">{item.autor}</span></div>
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Intérprete</span>
                              <div className="flex items-center gap-2"><Mic2 size={12} className="text-vallenato-red" /><span className="text-xs font-bold text-vallenato-blue truncate">{item.interprete}</span></div>
                           </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-gray-400"><Calendar size={14} /><span className="text-xs font-bold">Año {item.anio}</span></div>
                           <button className="text-vallenato-blue font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 group-hover:text-vallenato-red transition-colors">Ver ahora <Play size={10} fill="currentColor"/></button>
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
      
      {/* Wave animation style refinement */}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 4px; transform: scaleY(1); }
          50% { height: 16px; transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Archive;
