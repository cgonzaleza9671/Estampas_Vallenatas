
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAudios, fetchVideos } from '../../services/supabaseClient';
import { AudioItem, VideoItem } from '../../types';
import MediaModal from '../MediaModal';
import { Music, Video, Loader2, AlertCircle, RefreshCw, Play, Pause, Search, LayoutGrid, List, User, Mic2 } from 'lucide-react';
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

  const formatDateWithoutYear = (fullDate: string) => {
    const parts = fullDate.split(' de ');
    return parts.length >= 2 ? `${parts[0]} de ${parts[1]}` : fullDate;
  };

  const groupedAudios = useMemo(() => {
    let items = audios;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.titulo.toLowerCase().includes(query) || 
        item.cantante.toLowerCase().includes(query)
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
      const key = parts.length >= 3 ? `${parts[1]} de ${parts[2]}` : "Archivo Histórico";
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
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-vallenato-red font-bold uppercase tracking-widest text-xs">Archivo Histórico</span>
          <h1 className="text-4xl md:text-5xl font-serif text-vallenato-blue mb-4">La Memoria del Acordeón</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-light">Explore nuestra colección preservada. Utilice los filtros para navegar.</p>
        </div>

        <div className="flex justify-center mb-8">
           <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 inline-flex">
              <button onClick={() => setActiveTab('audio')} className={`px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${activeTab === 'audio' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-gray-500 hover:text-vallenato-blue hover:bg-gray-50'}`}><Music size={16} /> Audios</button>
              <button onClick={() => setActiveTab('video')} className={`px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-gray-500 hover:text-vallenato-blue hover:bg-gray-50'}`}><Video size={16} /> Videos</button>
           </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-[2rem] p-6 shadow-museum mb-12 border border-vallenato-mustard/20 max-w-6xl mx-auto">
           <div className={`grid grid-cols-1 gap-4 items-center ${activeTab === 'audio' ? 'md:grid-cols-2 lg:grid-cols-12' : 'md:grid-cols-3 lg:grid-cols-12'}`}>
              
              {/* Buscador */}
              <div className="col-span-1 lg:col-span-3">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard" size={18} />
                    <input 
                      type="text" 
                      placeholder={activeTab === 'audio' ? "Filtrar por título o intérprete" : "Buscar por título o intérprete"}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-sans" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                 </div>
              </div>

              {activeTab === 'audio' ? (
                <>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-sans cursor-pointer" value={selectedAudioAuthor} onChange={(e) => setSelectedAudioAuthor(e.target.value)}>
                        <option value="All">Filtrar por Autor</option>
                        {uniqueAudioAuthors.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-sans cursor-pointer" value={selectedAudioSinger} onChange={(e) => setSelectedAudioSinger(e.target.value)}>
                        <option value="All">Filtrar por Cantante</option>
                        {uniqueAudioSingers.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-sans cursor-pointer" value={selectedAudioAccordion} onChange={(e) => setSelectedAudioAccordion(e.target.value)}>
                        <option value="All">Filtrar por Acordeonero</option>
                        {uniqueAudioAccordions.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-1 lg:col-span-4 lg:col-start-4">
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-sans cursor-pointer" value={selectedVideoAuthor} onChange={(e) => setSelectedVideoAuthor(e.target.value)}>
                        <option value="All">Filtrar por Autor</option>
                        {uniqueVideoAuthors.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 lg:col-span-5">
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-sans cursor-pointer" value={selectedVideoInterpreter} onChange={(e) => setSelectedVideoInterpreter(e.target.value)}>
                        <option value="All">Filtrar por Intérprete</option>
                        {uniqueVideoInterpreters.filter(i => i !== 'All').map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </>
              )}
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center h-64 text-vallenato-blue"><Loader2 size={48} className="animate-spin mb-4 text-vallenato-mustard" /><p className="font-serif italic text-lg animate-pulse">Consultando los archivos del Magdalena Grande...</p></div>
        ) : error ? (
           <div className="text-center p-8"><AlertCircle size={48} className="text-vallenato-red mx-auto mb-4" /><p className="text-red-600">No pudimos conectar con el archivo. Intente de nuevo.</p><button onClick={loadData} className="mt-4 flex items-center gap-2 mx-auto text-vallenato-blue font-bold uppercase text-xs tracking-widest"><RefreshCw size={14}/> Reintentar</button></div>
        ) : (
          <>
            {activeTab === 'audio' ? (
              <div className="space-y-12">
                <div className="flex justify-between items-center px-4">
                  <span className="text-xs font-bold uppercase text-vallenato-blue/60 tracking-widest">Organización cronológica</span>
                  <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-vallenato-mustard text-vallenato-blue shadow-inner' : 'text-gray-400 hover:text-vallenato-blue'}`}><LayoutGrid size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-vallenato-mustard text-vallenato-blue shadow-inner' : 'text-gray-400 hover:text-vallenato-blue'}`}><List size={18} /></button>
                  </div>
                </div>

                {Object.keys(groupedAudios).length === 0 ? (
                  <div className="text-center py-20 text-gray-400 font-serif">No se encontraron resultados.</div>
                ) : (
                  (Object.entries(groupedAudios) as [string, AudioItem[]][]).map(([groupName, items]) => (
                    <div key={groupName} className="space-y-6">
                      <div className="flex items-center gap-4"><div className="h-px bg-vallenato-mustard/30 flex-grow"></div><h3 className="text-vallenato-blue font-serif text-xl md:text-2xl font-bold capitalize px-4 bg-vallenato-beige z-10">{groupName}</h3><div className="h-px bg-vallenato-mustard/30 flex-grow"></div></div>
                      
                      {viewMode === 'grid' ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                          {items.map((item) => (
                            <div key={item.id} onClick={() => onPlayAudio?.(item)} className={`group bg-white rounded-2xl p-6 shadow-sm hover:shadow-museum transition-all duration-300 border-l-4 ${currentAudioId === item.id ? 'border-vallenato-red bg-vallenato-cream/50' : 'border-vallenato-mustard hover:border-vallenato-red'} cursor-pointer flex flex-col`}>
                              <div className="flex justify-between items-start mb-4"><div className="bg-vallenato-beige p-2 rounded-xl text-vallenato-blue"><Music size={20} /></div><div className="text-vallenato-blue/20"><SombreroVueltiaoIcon size={40} /></div></div>
                              <h4 className="text-lg font-serif text-vallenato-blue font-bold group-hover:text-vallenato-red transition-colors truncate">{item.titulo}</h4>
                              <div className="space-y-1.5 mt-1.5 mb-4">
                                <p className="text-vallenato-red text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0"><User size={10} className="shrink-0" /> {item.autor}</p>
                                <p className="text-vallenato-blue/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0"><Mic2 size={10} className="shrink-0" /> {item.cantante}</p>
                              </div>
                              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Acordeón: {item.acordeonero}</span>
                                <div className={`p-2 rounded-full transition-all ${currentAudioId === item.id && isPlaying ? 'bg-vallenato-red text-white' : 'bg-vallenato-blue text-white group-hover:bg-vallenato-red'}`}>{currentAudioId === item.id && isPlaying ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                          {items.map((item) => (
                            <div key={item.id} onClick={() => onPlayAudio?.(item)} className={`flex items-center p-4 hover:bg-vallenato-cream transition-colors cursor-pointer group ${currentAudioId === item.id ? 'bg-vallenato-cream' : ''}`}>
                              <div className={`p-3 rounded-full mr-4 ${currentAudioId === item.id ? 'bg-vallenato-red text-white' : 'bg-gray-100 text-vallenato-blue group-hover:bg-vallenato-mustard'}`}>{currentAudioId === item.id && isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}</div>
                              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div><h4 className="text-sm md:text-base font-serif font-bold text-vallenato-blue group-hover:text-vallenato-red truncate">{item.titulo}</h4></div>
                                <div className="hidden md:flex flex-col"><span className="text-[9px] text-gray-400 uppercase font-bold">Autor</span><span className="text-xs text-gray-700 truncate">{item.autor}</span></div>
                                <div className="hidden md:flex flex-col"><span className="text-[9px] text-gray-400 uppercase font-bold">Voz</span><span className="text-xs text-gray-700 truncate">{item.cantante}</span></div>
                                <div className="hidden md:flex flex-col"><span className="text-[9px] text-gray-400 uppercase font-bold">Acordeón</span><span className="text-xs text-gray-700 truncate">{item.acordeonero}</span></div>
                              </div>
                              <div className="ml-4 text-xs font-mono text-gray-400 hidden sm:block whitespace-nowrap">{formatDateWithoutYear(item.fecha_publicacion)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                {filteredVideos.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-museum transition-all cursor-pointer group" onClick={() => { setSelectedVideo(item); setIsModalOpen(true); }}>
                     <div className="aspect-video relative overflow-hidden bg-black">
                        {item.thumbnail_url && <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt={item.titulo}/>}
                        <div className="absolute inset-0 flex items-center justify-center"><div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/50"><Play size={32} className="text-white fill-white" /></div></div>
                     </div>
                     <div className="p-6">
                        <h3 className="text-xl font-serif text-vallenato-blue font-bold">{item.titulo}</h3>
                        <div className="flex flex-col gap-1.5 mt-3">
                           <p className="text-vallenato-mustard text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shrink-0"><User size={12} className="shrink-0" /> Autor: {item.autor}</p>
                           <p className="text-vallenato-red text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shrink-0"><Mic2 size={12} className="shrink-0" /> Intérprete: {item.interprete}</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <MediaModal item={selectedVideo} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Archive;
