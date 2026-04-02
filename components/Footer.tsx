import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Youtube, Instagram, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-vallenato-blue text-white border-t-8 border-vallenato-red pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Columna 1: Identidad */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center gap-1 px-[4px] py-[1px] bg-white/5 rounded-lg border border-white/10 min-w-[46px]">
                 <div className="flex gap-[1.5px] ml-0.5">
                    <div className="w-1 h-6 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
                    <div className="w-1 h-6 bg-vallenato-mustard transform -skew-x-12 rounded-sm shadow-sm"></div>
                    <div className="w-1 h-6 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
                 </div>
                 <div className="bg-vallenato-blue w-3.5 h-7 rounded-md border border-white/20 flex flex-col items-center justify-between py-1.5 shadow-inner">
                    <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                    <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                    <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                 </div>
             </div>
             
             <div className="cursor-pointer" onClick={(e) => handleNav(e, '/')}>
                <h2 className="text-xl font-serif leading-none">Estampas</h2>
                <span className="text-sm font-sans font-light text-white tracking-[0.05em]">Vallenatas</span>
             </div>
          </div>
          <p className="text-gray-300 font-sans font-light text-sm leading-relaxed">
            Un archivo vivo dedicado a preservar la esencia del folclor vallenato tradicional. 
            Salvaguardando la memoria de nuestros juglares para las futuras generaciones.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div className="lg:pl-8">
          <h3 className="text-vallenato-mustard font-serif text-xl mb-6">Navegación</h3>
          <ul className="space-y-4 font-sans text-xs tracking-widest font-bold uppercase">
            <li>
              <button onClick={(e) => handleNav(e, '/')} className="hover:text-vallenato-mustard transition-colors text-left flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-vallenato-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Inicio
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav(e, '/la-memoria-del-acordeon')} className="hover:text-vallenato-mustard transition-colors text-left flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-vallenato-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                La Memoria del Acordeón
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav(e, '/relatos-legendarios')} className="hover:text-vallenato-mustard transition-colors text-left flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-vallenato-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Relatos Legendarios
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav(e, '/impacto-global')} className="hover:text-vallenato-mustard transition-colors text-left flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-vallenato-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Impacto Global
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav(e, '/acerca-del-autor')} className="hover:text-vallenato-mustard transition-colors text-left flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-vallenato-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Acerca del autor
              </button>
            </li>
          </ul>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div className="lg:pl-4">
          <h3 className="text-vallenato-mustard font-serif text-xl mb-6">Redes Sociales</h3>
          <ul className="space-y-5">
            <li>
              <a 
                href="https://www.youtube.com/@EstampasVallenatasColombia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 group transition-all"
              >
                <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-vallenato-red transition-colors shadow-lg border border-white/10 group-hover:border-vallenato-red/50">
                  <Youtube size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-vallenato-red">YouTube</span>
                  <span className="text-sm font-semibold font-sans text-white group-hover:text-vallenato-mustard">Canal Oficial de Videos</span>
                </div>
              </a>
            </li>
            <li>
              <a 
                href="https://www.instagram.com/estampasvallenatas.co?igsh=MTdudjJvcTVsNG02Yw%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 group transition-all"
              >
                <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 transition-colors shadow-lg border border-white/10">
                  <Instagram size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-vallenato-mustard">Instagram</span>
                  <span className="text-sm font-semibold font-sans text-white group-hover:text-vallenato-mustard">@estampasvallenatas.co</span>
                </div>
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <h3 className="text-vallenato-mustard font-serif text-xl mb-6">Contacto</h3>
          <div className="space-y-6 font-sans text-sm">
            <div className="flex items-start gap-3 group">
              <div className="bg-vallenato-red/20 p-2 rounded-lg text-vallenato-red group-hover:bg-vallenato-red group-hover:text-white transition-colors">
                <MapPin size={16} />
              </div>
              <div>
                <p className="font-bold text-gray-200 text-xs uppercase tracking-wider">Camilo González Abusaid</p>
                <p className="text-gray-400 text-xs">Madrid, España</p>
                <a href="mailto:c.gonzaleza9671@gmail.com" className="text-vallenato-mustard text-xs hover:underline mt-1 block">c.gonzaleza9671@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="bg-vallenato-red/20 p-2 rounded-lg text-vallenato-red group-hover:bg-vallenato-red group-hover:text-white transition-colors">
                <MapPin size={16} />
              </div>
              <div>
                <p className="font-bold text-gray-200 text-xs uppercase tracking-wider">Álvaro González Pimienta</p>
                <p className="text-gray-400 text-xs">Bogotá, Colombia</p>
                <a href="mailto:alvarogonzalez1945@hotmail.com" className="text-vallenato-mustard text-xs hover:underline mt-1 block">alvarogonzalez1945@hotmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-[10px] font-sans uppercase tracking-[0.3em]">
        &copy; {new Date().getFullYear()} Estampas Vallenatas. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;