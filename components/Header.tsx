import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, LayoutGroup } from 'motion/react';

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
    <header className="sticky top-0 z-50 bg-vallenato-blue/85 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex justify-between items-center">
        {/* Logo Estampas Vallenatas - Compacto y estilizado */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => handleNav('/')}
        >
          <div className="flex items-center justify-center gap-1 px-1.5 py-1 bg-white/[0.04] rounded-lg border border-white/10 group-hover:border-vallenato-mustard/40 transition-colors">
            <div className="flex gap-[2px] ml-0.5">
              <div className="w-1 h-5 bg-vallenato-red transform -skew-x-12 rounded-[1px] shadow-sm"></div>
              <div className="w-1 h-5 bg-vallenato-mustard transform -skew-x-12 rounded-[1px] shadow-sm"></div>
              <div className="w-1 h-5 bg-vallenato-red transform -skew-x-12 rounded-[1px] shadow-sm"></div>
            </div>
            <div className="bg-vallenato-blue w-3.5 h-6 rounded border border-white/20 flex flex-col items-center justify-between py-1 shadow-inner">
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 select-none">
            <h1 className="text-lg md:text-xl font-serif font-bold text-white tracking-wide group-hover:text-amber-200 transition-colors">
              Estampas
            </h1>
            <span className="text-xs md:text-sm font-sans font-normal text-white/60 tracking-wider">
              Vallenatas
            </span>
          </div>
        </div>

        {/* Menú de Navegación Estilo Linear con Caligrafía Serif y transición elástica compartida */}
        <div className="hidden lg:flex items-center justify-end flex-1 pl-8">
          <LayoutGroup id="header-nav-group">
            <nav className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.07] backdrop-blur-md shadow-inner">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <div key={item.path} className="relative flex items-center">
                    <button
                      type="button"
                      onClick={() => handleNav(item.path)}
                      className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] md:text-sm font-serif font-medium tracking-normal transition-colors duration-200 ${
                        active
                          ? 'text-amber-200 font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="activeHeaderPill"
                          className="absolute inset-0 bg-white/[0.1] border border-white/[0.12] rounded-full -z-10 shadow-sm"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="flex items-center gap-1.5">
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-vallenato-mustard shadow-[0_0_8px_rgba(234,170,0,0.8)]" />
                        )}
                        {item.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </LayoutGroup>
        </div>

        {/* Botón Móvil */}
        <div className="lg:hidden flex items-center">
          <button 
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable Estilo Linear con Caligrafía Serif */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full px-4 pt-2 pb-4 lg:hidden animate-fade-in-down z-50">
          <div className="bg-vallenato-blue/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-2xl p-2 flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`
                    w-full py-2.5 px-3.5 rounded-xl text-sm font-serif font-medium transition-all duration-200 flex items-center justify-between
                    ${
                      active
                        ? 'bg-white/[0.1] text-amber-200 border border-white/[0.12] font-semibold' 
                        : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-vallenato-mustard shadow-[0_0_6px_rgba(234,170,0,0.8)]" />
                    )}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
