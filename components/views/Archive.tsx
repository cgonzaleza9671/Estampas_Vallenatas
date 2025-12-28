import React, { useEffect, useState, useMemo } from 'react';
import { fetchAudios, fetchVideos } from '../../services/supabaseClient';
import { AudioItem, VideoItem } from '../../types';
import MediaModal from '../MediaModal';
import { Music, Video, Filter, Loader2, AlertCircle, RefreshCw, Calendar, Play, User, Search, Mic2, X, ListMusic, Tv } from 'lucide-react';
import { AccordionPlayIcon } from '../CustomIcons';

const Archive: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrimaryFilter, setSelectedPrimaryFilter] = useState('All'); // Audio: Autor, Video: Autor
  const [selectedSecondaryFilter, setSelectedSecondaryFilter] = useState('All'); // Audio: Acordeonero

  // Modal State
  const [selectedItem, setSelectedItem] = useState<AudioItem | VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [fetchedAudios, fetchedVideos] = await Promise.all([
        fetchAudios(),
        fetchVideos()
      ]);
      setAudios(fetchedAudios);
      setVideos(fetchedVideos);
    } catch (e) {
      console.error("Archive fetch error", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dynamic Filters Lists
  const uniquePrimaryList = useMemo(() => {
    let items: (AudioItem | VideoItem)[] = activeTab === 'audio' ? audios : videos;
    // Both now use 'autor'
    const list = items.map(item => item.autor).filter(Boolean);
    return ['All', ...new Set(list)];
  }, [audios, videos, activeTab]);

  const uniqueSecondaryList = useMemo(() => {
    // Accordionists for Audio only
    if (activeTab !== 'audio') return [];
    const list = audios.map(item => item.acordeonero).filter(Boolean);
    return ['All', ...new Set(list)];
  }, [audios, activeTab]);

  // Filtering Logic
  const filteredItems = useMemo(() => {
    let items: (AudioItem | VideoItem)[] = activeTab === 'audio' ? audios : videos;

    // 1. Filter by Title (Search Query)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => item.titulo.toLowerCase().includes(query));
    }

    // 2. Primary Filter: Autor (Both Audio and Video)
    if (selectedPrimaryFilter !== 'All') {
      items = items.filter(item => item.autor === selectedPrimaryFilter);
    }

    // 3. Secondary Filter: Acordeonero (Only for Audio tab)
    if (activeTab === 'audio' && selectedSecondaryFilter !== 'All') {
      items = (items as AudioItem[]).filter(item => item.acordeonero === selectedSecondaryFilter);
    }

    return items;
  }, [activeTab, audios, videos, selectedPrimaryFilter, selectedSecondaryFilter, searchQuery]);

  // Handlers
  const handleTabChange = (tab: 'audio' | 'video') => {
    setActiveTab(tab);
    // Reset filters on tab change
    setSearchQuery('');
    setSelectedPrimaryFilter('All');
    setSelectedSecondaryFilter('All');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPrimaryFilter('All');
    setSelectedSecondaryFilter('All');
  };

  const openMedia = (item: AudioItem | VideoItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const hasActiveFilters = searchQuery !== '' || selectedPrimaryFilter !== 'All' || selectedSecondaryFilter !== 'All';

  return (
    <div className="min-h-screen bg-vallenato-beige pt-8 pb-20 animate-fade-in-up">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="text-vallenato-red font-bold uppercase tracking-widest text-xs">Archivo Histórico</span>
          <h1 className="text-4xl md:text-5xl font-serif text-vallenato-blue mb-4">La Memoria del Acordeón</h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-light">
            Explore nuestra colección preservada. Utilice los filtros para navegar por la historia de la sabana.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
           <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 inline-flex">
              <button 
                onClick={() => handleTabChange('audio')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${activeTab === 'audio' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-gray-500 hover:text-vallenato-blue hover:bg-gray-50'}`}
              >
                <Music size={16} /> Audios
              </button>
              <button 
                onClick={() => handleTabChange('video')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-vallenato-blue text-white shadow-lg' : 'text-gray-500 hover:text-vallenato-blue hover:bg-gray-50'}`}
              >
                <Video size={16} /> Videos
              </button>
           </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-[2rem] p-6 shadow-museum mb-12 border border-vallenato-mustard/20 max-w-4xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Search Bar (Title) */}
              <div className={`col-span-1 ${activeTab === 'audio' ? 'md:col-span-4' : 'md:col-span-8'}`}>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard" size={20} />
                    <input 
                      type="text"
                      placeholder="Buscar por título..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-sm text-gray-700 font-sans"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
              </div>

              {/* Primary Filter (Autor) */}
              <div className="col-span-1 md:col-span-4">
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard" size={20} />
                    <select 
                      className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-sm appearance-none text-gray-700 font-sans cursor-pointer hover:bg-gray-100"
                      value={selectedPrimaryFilter}
                      onChange={(e) => setSelectedPrimaryFilter(e.target.value)}
                    >
                       <option value="All">Todos los Autores</option>
                       {uniquePrimaryList.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                 </div>
              </div>

              {/* Secondary Filter (Acordeonero - Audio Only) */}
              {activeTab === 'audio' && (
                <div className="col-span-1 md:col-span-4">
                   <div className="relative">
                      <ListMusic className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard" size={20} />
                      <select 
                        className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-sm appearance-none text-gray-700 font-sans cursor-pointer hover:bg-gray-100"
                        value={selectedSecondaryFilter}
                        onChange={(e) => setSelectedSecondaryFilter(e.target.value)}
                      >
                         <option value="All">Todos los Acordeoneros</option>
                         {uniqueSecondaryList.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                   </div>
                </div>
              )}
           </div>
           
           {/* Active Filters & Clear Button */}
           {hasActiveFilters && (
             <div className="flex justify-end mt-4 animate-fade-in-down">
               <button 
                 onClick={clearFilters}
                 className="text-xs font-bold text-vallenato-red flex items-center gap-1 hover:underline"
               >
                 <X size={14} /> Limpiar filtros
               </button>
             </div>
           )}
        </div>

        {/* Content Area */}
        {loading ? (
           <div className="flex flex-col justify-center items-center h-64 text-vallenato-blue">
              <Loader2 size={48} className="animate-spin mb-4 text-vallenato-mustard" />
              <p className="font-serif italic text-lg animate-pulse">Consultando los archivos del Magdalena Grande...</p>
           </div>
        ) : error ? (
           <div className="bg-red-50 border-l-4 border-vallenato-red p-8 rounded-r-xl max-w-2xl mx-auto flex flex-col items-center text-center">
              <AlertCircle size={48} className="text-vallenato-red mb-4" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Error de Conexión</h3>
              <p className="text-red-600 mb-6">No pudimos acceder a la base de datos de estampas. Por favor verifica tu conexión.</p>
              <button 
                onClick={loadData}
                className="bg-vallenato-red text-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-red-800 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} /> Reintentar Carga
              </button>
           </div>
        ) : filteredItems.length === 0 ? (
           <div className="text-center py-20 opacity-60">
             <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
               <Search size={48} className="text-gray-400" />
             </div>
             <p className="text-xl font-serif text-gray-500 mb-4">No se encontraron estampas con esos criterios.</p>
             <button onClick={clearFilters} className="text-vallenato-blue underline font-bold text-sm">Ver todos los archivos</button>
           </div>
        ) : (
          <div className={`grid gap-8 ${activeTab === 'audio' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-museum transition-all duration-300 border border-gray-100 flex flex-col ${activeTab === 'audio' ? 'hover:-translate-y-1' : ''} cursor-pointer`}
                onClick={() => openMedia(item)}
              >
                {activeTab === 'video' ? (
                  // Video Card Layout
                  <div className="flex flex-col h-full">
                     <div className="aspect-video relative overflow-hidden bg-black group-cursor-pointer">
                        {/* Render Thumbnail URL if available */}
                        {(item as VideoItem).thumbnail_url ? (
                          <img 
                            src={(item as VideoItem).thumbnail_url} 
                            alt={item.titulo} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          /* Fallback Placeholder */
                          <div className="w-full h-full bg-vallenato-blue flex items-center justify-center relative">
                             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                             <Video size={48} className="text-white/50" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/50 group-hover:scale-110 transition-transform shadow-xl">
                              <Play size={32} className="text-white fill-white" />
                           </div>
                        </div>
                     </div>
                     <div className="p-6 flex-grow">
                        <h3 className="text-xl font-serif text-vallenato-blue font-bold mb-2 group-hover:text-vallenato-red transition-colors">
                          {item.titulo}
                        </h3>
                        <p className="text-vallenato-mustard text-sm mb-4 font-bold flex items-center gap-2">
                           <User size={14} /> {(item as VideoItem).autor}
                        </p>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                           <Calendar size={12} />
                           <span>{(item as VideoItem).anio}</span>
                        </div>
                     </div>
                  </div>
                ) : (
                  // Audio Card Layout
                  <div className="flex flex-col h-full">
                     <div className="p-6 flex-grow relative">
                        <div className="absolute top-0 left-0 w-1 h-12 bg-vallenato-mustard rounded-br-full"></div>
                        
                        {/* Custom Icon for Estampa */}
                        <div className="absolute top-4 right-4 text-vallenato-blue/10 group-hover:text-vallenato-mustard/40 transition-colors pointer-events-none">
                            <AccordionPlayIcon className="w-12 h-12" />
                        </div>

                        <h3 className="text-xl font-serif text-vallenato-blue font-bold mb-1 leading-tight group-hover:text-vallenato-red transition-colors">
                           {item.titulo}
                        </h3>
                        <p className="text-vallenato-red text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                           <User size={10} /> {(item as AudioItem).autor}
                        </p>
                        
                        <div className="flex justify-between items-center mt-3 border-b border-gray-100 pb-3">
                           <p className="text-gray-500 text-xs flex items-center gap-1">
                              <ListMusic size={10} /> <span className="font-bold">Acordeón:</span> {(item as AudioItem).acordeonero}
                           </p>
                        </div>
                        
                        <p className="mt-3 text-gray-500 text-sm italic">
                           {(item as AudioItem).fecha_publicacion}
                        </p>
                     </div>
                     
                     {/* Action Bar (Replaces inline player) */}
                     <div className="bg-vallenato-blue p-4 flex items-center justify-between group-hover:bg-vallenato-red transition-colors duration-300">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Escuchar Audio</span>
                        <div className="bg-white/20 p-1.5 rounded-full">
                           <Play size={14} className="text-white fill-white" />
                        </div>
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      <MediaModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Archive;