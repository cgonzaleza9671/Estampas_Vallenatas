
import React, { useState } from 'react';
import { ViewState } from '../types';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', value: ViewState.HOME },
    { label: 'La Memoria del Acordeón', value: ViewState.ARCHIVE },
    { label: 'Relatos Legendarios', value: ViewState.TALES },
    { label: 'Acerca del autor', value: ViewState.BIO },
  ];

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-vallenato-blue/95 backdrop-blur-md shadow-museum border-b-4 border-vallenato-mustard transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group" 
          onClick={() => handleNav(ViewState.HOME)}
        >
          <div className="flex items-center justify-center gap-1.5 px-[5px] py-[2px] bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors min-w-[65px]">
             <div className="flex gap-[2.5px] ml-1">
                <div className="w-1.5 h-8 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
                <div className="w-1.5 h-8 bg-vallenato-mustard transform -skew-x-12 rounded-sm shadow-sm"></div>
                <div className="w-1.5 h-8 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
             </div>
             <div className="bg-vallenato-blue w-5 h-9 rounded-md border border-white/20 flex flex-col items-center justify-between py-1.5 shadow-inner">
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
             </div>
          </div>

          <div className="flex flex-col -space-y-1.5 select-none">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">Estampas</h1>
            <span className="text-base md:text-lg font-sans font-light text-white tracking-[0.05em] drop-shadow-sm">Vallenatas</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                className={`text-xs xl:text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                  currentView === item.value 
                    ? 'text-vallenato-mustard border-b-2 border-vallenato-mustard pb-1' 
                    : 'text-gray-200 hover:text-white pb-1 border-b-2 border-transparent hover:border-white/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:hidden flex items-center">
          <button 
            className="text-white hover:text-vallenato-mustard transition-colors p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full px-4 pt-2 lg:hidden animate-fade-in-down z-50">
          <div className="bg-vallenato-blue/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                className={`
                  w-full py-4 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between group
                  ${
                    currentView === item.value 
                      ? 'bg-vallenato-mustard text-vallenato-blue shadow-md' 
                      : 'text-white hover:bg-white/10'
                  }
                `}
              >
                {item.label}
                {currentView === item.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-vallenato-blue" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
