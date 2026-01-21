
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-vallenato-blue text-white border-t-8 border-vallenato-red pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
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
          <p className="text-gray-300 font-sans font-light leading-relaxed">
            Un archivo vivo dedicado a preservar la esencia del folclor vallenato tradicional. 
            Salvaguardando la memoria de nuestros juglares para las futuras generaciones.
          </p>
        </div>

        <div className="md:pl-10">
          <h3 className="text-vallenato-mustard font-serif text-xl mb-6">Navegación</h3>
          <ul className="space-y-3 font-sans text-sm tracking-wide">
            <li>
              <button onClick={(e) => handleNav(e, '/')} className="hover:text-vallenato-mustard transition-colors text-left uppercase tracking-widest font-bold text-xs">Inicio</button>
            </li>
            <li>
              <button onClick={(e) => handleNav(e, '/la-memoria-del-acordeon')} className="hover:text-vallenato-mustard transition-colors text-left uppercase tracking-widest font-bold text-xs">La Memoria del Acordeón</button>
            </li>
            <li>
              <button onClick={(e) => handleNav(e, '/relatos-legendarios')} className="hover:text-vallenato-mustard transition-colors text-left uppercase tracking-widest font-bold text-xs">Relatos Legendarios</button>
            </li>
            <li>
              <button onClick={(e) => handleNav(e, '/acerca-del-autor')} className="hover:text-vallenato-mustard transition-colors text-left uppercase tracking-widest font-bold text-xs">Acerca del autor</button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-vallenato-mustard font-serif text-xl mb-6">Contacto</h3>
          <div className="space-y-4 font-sans text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="text-vallenato-red shrink-0 mt-1" size={18} />
              <div>
                <p className="font-bold text-gray-200">Camilo González Abusaid</p>
                <p className="text-gray-400">Madrid, España</p>
                <a href="mailto:c.gonzaleza9671@gmail.com" className="text-vallenato-mustard hover:underline">c.gonzaleza9671@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-vallenato-red shrink-0 mt-1" size={18} />
              <div>
                <p className="font-bold text-gray-200">Álvaro González Pimienta</p>
                <p className="text-gray-400">Bogotá, Colombia</p>
                <a href="mailto:alvarogonzalez1945@hotmail.com" className="text-vallenato-mustard hover:underline">alvarogonzalez1945@hotmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-xs font-sans uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Estampas Vallenatas. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
