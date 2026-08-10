#!/bin/bash
sed -i '205,297c\
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-museum mb-10 border border-vallenato-mustard/10 max-w-7xl mx-auto">\
           <div className="flex flex-col gap-6">\
              <div className="relative group w-full">\
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vallenato-mustard group-focus-within:text-vallenato-red transition-colors" size={20} />\
                 <input type="text" placeholder="Buscar por título, autor..." className="w-full pl-12 pr-10 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-sm font-sans" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />\
                 {searchQuery && <button onClick={() => setSearchQuery('\''\'')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-vallenato-red"><X size={16} /></button>}\
              </div>\
              {activeTab === '\''audio'\'' ? (\
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\
                  <div className="flex flex-col gap-3">\
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioAuthor} onChange={(e) => setSelectedAudioAuthor(e.target.value)}>\
                        <option value="All">Todos los autores</option>\
                        {filterOptions.audioAuthors.map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}\
                    </select>\
                    <div className="flex flex-wrap gap-2 px-1">\
                      <span className="text-[9px] uppercase font-bold text-gray-400 self-center tracking-widest">🔥 Populares:</span>\
                      {filterOptions.topAudioAuthors.map(a => (\
                        <button key={a} onClick={() => setSelectedAudioAuthor(a)} className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${selectedAudioAuthor === a ? '\''bg-vallenato-mustard text-vallenato-blue shadow-sm'\'' : '\''bg-gray-50 text-gray-500 hover:bg-gray-100'\''}`}>{toTitleCase(a)}</button>\
                      ))}\
                    </div>\
                  </div>\
                  <div className="flex flex-col gap-3">\
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioSinger} onChange={(e) => setSelectedAudioSinger(e.target.value)}>\
                        <option value="All">Todos los cantantes</option>\
                        {filterOptions.audioSingers.map(s => <option key={s} value={s}>{toTitleCase(s)}</option>)}\
                    </select>\
                    <div className="flex flex-wrap gap-2 px-1">\
                      <span className="text-[9px] uppercase font-bold text-gray-400 self-center tracking-widest">🔥 Populares:</span>\
                      {filterOptions.topAudioSingers.map(a => (\
                        <button key={a} onClick={() => setSelectedAudioSinger(a)} className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${selectedAudioSinger === a ? '\''bg-vallenato-blue text-white shadow-sm'\'' : '\''bg-gray-50 text-gray-500 hover:bg-gray-100'\''}`}>{toTitleCase(a)}</button>\
                      ))}\
                    </div>\
                  </div>\
                  <div className="flex flex-col gap-3">\
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedAudioAccordion} onChange={(e) => setSelectedAudioAccordion(e.target.value)}>\
                        <option value="All">Todos los acordeoneros</option>\
                        {filterOptions.audioAccordions.map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}\
                    </select>\
                    <div className="flex flex-wrap gap-2 px-1">\
                      <span className="text-[9px] uppercase font-bold text-gray-400 self-center tracking-widest">🔥 Populares:</span>\
                      {filterOptions.topAudioAccordions.map(a => (\
                        <button key={a} onClick={() => setSelectedAudioAccordion(a)} className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${selectedAudioAccordion === a ? '\''bg-vallenato-red text-white shadow-sm'\'' : '\''bg-gray-50 text-gray-500 hover:bg-gray-100'\''}`}>{toTitleCase(a)}</button>\
                      ))}\
                    </div>\
                  </div>\
                </div>\
              ) : (\
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">\
                  <div className="flex flex-col gap-3">\
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedVideoAuthor} onChange={(e) => setSelectedVideoAuthor(e.target.value)}>\
                        <option value="All">Todos los autores</option>\
                        {filterOptions.videoAuthors.map(a => <option key={a} value={a}>{toTitleCase(a)}</option>)}\
                    </select>\
                    <div className="flex flex-wrap gap-2 px-1">\
                      <span className="text-[9px] uppercase font-bold text-gray-400 self-center tracking-widest">🔥 Populares:</span>\
                      {filterOptions.topVideoAuthors.map(a => (\
                        <button key={a} onClick={() => setSelectedVideoAuthor(a)} className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${selectedVideoAuthor === a ? '\''bg-vallenato-mustard text-vallenato-blue shadow-sm'\'' : '\''bg-gray-50 text-gray-500 hover:bg-gray-100'\''}`}>{toTitleCase(a)}</button>\
                      ))}\
                    </div>\
                  </div>\
                  <div className="flex flex-col gap-3">\
                    <select className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-vallenato-mustard focus:bg-white focus:outline-none transition-all text-xs font-bold tracking-tight cursor-pointer" value={selectedVideoInterpreter} onChange={(e) => setSelectedVideoInterpreter(e.target.value)}>\
                        <option value="All">Todos los intérpretes</option>\
                        {filterOptions.videoInterpreters.map(i => <option key={i} value={i}>{toTitleCase(i)}</option>)}\
                    </select>\
                    <div className="flex flex-wrap gap-2 px-1">\
                      <span className="text-[9px] uppercase font-bold text-gray-400 self-center tracking-widest">🔥 Populares:</span>\
                      {filterOptions.topVideoInterpreters.map(a => (\
                        <button key={a} onClick={() => setSelectedVideoInterpreter(a)} className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${selectedVideoInterpreter === a ? '\''bg-vallenato-blue text-white shadow-sm'\'' : '\''bg-gray-50 text-gray-500 hover:bg-gray-100'\''}`}>{toTitleCase(a)}</button>\
                      ))}\
                    </div>\
                  </div>\
                </div>\
              )}' components/views/Archive.tsx
