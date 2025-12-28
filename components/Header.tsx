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
    { label: 'Acerca del autor', value: ViewState.BIO },
    { label: 'El Vallenato cerca a ti', value: ViewState.LOCATIONS },
  ];

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-vallenato-blue/95 backdrop-blur-md shadow-museum border-b-4 border-vallenato-mustard">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Area */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => handleNav(ViewState.HOME)}
        >
          {/* Graphic Isotype */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
             {/* Chevrons/Lines (Red-Yellow-Red) */}
             <div className="flex gap-[3px]">
                <div className="w-1.5 h-8 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
                <div className="w-1.5 h-8 bg-vallenato-mustard transform -skew-x-12 rounded-sm shadow-sm"></div>
                <div className="w-1.5 h-8 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
             </div>
             
             {/* Accordion Bar (Blue with dots) */}
             <div className="bg-vallenato-blue w-6 h-10 rounded-md border border-white/20 flex flex-col items-center justify-between py-2 shadow-inner">
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
             </div>
          </div>

          {/* Text Logo */}
          <div className="flex flex-col -space-y-1.5 select-none">
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Estampas</h1>
            <span className="text-lg font-sans font-light text-white tracking-[0.05em] drop-shadow-sm">Vallenatas</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-8">
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

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white hover:text-vallenato-mustard transition-colors p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Modern Floating Card) */}
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
                {/* Visual indicator dot for active state */}
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