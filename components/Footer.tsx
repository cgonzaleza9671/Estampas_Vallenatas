import React from 'react';
import { Music, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-vallenato-blue text-white border-t-8 border-vallenato-red pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             {/* Matching Header Logo Style for Consistency */}
             <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10">
                 {/* Chevrons */}
                 <div className="flex gap-[2px]">
                    <div className="w-1 h-6 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
                    <div className="w-1 h-6 bg-vallenato-mustard transform -skew-x-12 rounded-sm shadow-sm"></div>
                    <div className="w-1 h-6 bg-vallenato-red transform -skew-x-12 rounded-sm shadow-sm"></div>
                 </div>
                 {/* Accordion Bar */}
                 <div className="bg-vallenato-blue w-4 h-8 rounded-md border border-white/20 flex flex-col items-center justify-between py-1.5 shadow-inner">
                    <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                    <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                    <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                 </div>
             </div>
             
             <div>
                <h2 className="text-xl font-serif leading-none">Estampas</h2>
                <span className="text-sm font-sans font-light text-white tracking-[0.05em]">Vallenatas</span>
             </div>
          </div>
          <p className="text-gray-300 font-sans font-light leading-relaxed">
            Un archivo vivo dedicado a preservar la esencia del folclor vallenato tradicional. 
            Salvaguardando la memoria de nuestros juglares para las futuras generaciones.
          </p>
        </div>

        {/* Links Column */}
        <div className="md:pl-10">
          <h3 className="text-vallenato-mustard font-serif text-xl mb-6">Navegación</h3>
          <ul className="space-y-3 font-sans text-sm tracking-wide">
            <li><a href="#" className="hover:text-vallenato-mustard transition-colors">Inicio</a></li>
            <li><a href="#" className="hover:text-vallenato-mustard transition-colors">La Memoria del Acordeón</a></li>
            <li><a href="#" className="hover:text-vallenato-mustard transition-colors">Acerca del autor</a></li>
            <li><a href="#" className="hover:text-vallenato-mustard transition-colors">El Vallenato cerca a ti</a></li>
          </ul>
        </div>

        {/* Contact Column */}
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