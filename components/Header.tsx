
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'La memoria del acordeón', path: '/la-memoria-del-acordeon' },
    { label: 'Relatos legendarios', path: '/relatos-legendarios' },
    { label: 'El viaje del vallenato', path: '/el-viaje-del-vallenato' },
    { label: 'Acerca del autor', path: '/acerca-del-autor' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-vallenato-blue/95 backdrop-blur-md shadow-museum border-b-4 border-vallenato-mustard transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group" 
          onClick={() => handleNav('/')}
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

        <div className="hidden lg:flex items-center justify-end flex-1 pl-10">
          <nav className="flex items-center justify-end gap-2 lg:gap-4 xl:gap-6 w-full">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <div key={item.path} className="relative flex flex-col items-center">
                  <button
                    onClick={() => handleNav(item.path)}
                    className={`relative z-10 px-3 lg:px-4 py-2 rounded-full text-[10px] lg:text-xs xl:text-sm font-sans font-semibold uppercase tracking-[0.14em] text-center leading-tight transition-colors duration-300 ${
                      active
                        ? 'text-vallenato-blue font-bold'
                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeHeaderIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-vallenato-mustard to-amber-400 rounded-full -z-10 shadow-md"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {item.label}
                  </button>
                </div>
              );
            })}
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
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`
                  w-full py-3.5 px-4 rounded-xl text-sm md:text-base font-sans font-semibold uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-between group
                  ${
                    isActive(item.path)
                      ? 'bg-vallenato-mustard text-vallenato-blue shadow-md' 
                      : 'text-white hover:bg-white/10'
                  }
                `}
              >
                <div className="flex flex-col items-start">
                  <span>{item.label}</span>
                </div>
                {isActive(item.path) && (
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
