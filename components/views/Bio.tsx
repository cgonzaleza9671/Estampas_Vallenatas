
import React, { useMemo } from 'react';
import { User, Sparkles, Award, Mic, Quote, History, Camera, Images, ChevronRight } from 'lucide-react';

const ANECDOTAS_TEXT = {
  p1: "Sin poder ocultar la nostalgia al recordar el recorrido folclórico que 'Estampas Vallenatas' protagonizó en la radio nacional, Álvaro González afirma que la mayor satisfacción fue llevarle a la población campesina y rural de Colombia un deleite espiritual con música que no habían escuchado anteriormente.",
  p2: "En cierta ocasión, programó la canción 'El accidente de Lisandro' y, casi de inmediato, recibió la llamada de un oyente conmovedido: \"Doctor González, yo pensé que ese tema no lo tenía nadie en Colombia\". Años atrás, incluso Eloy 'Chichi' Quintero, desde su rol como Cónsul en Maracaibo, se comunicó con el programa para destacar la inmensa sintonía de 'Estampas Vallenatas' en territorio venezolano.",
  p3: "De la amistad entrañable con 'El Pollo Vallenato', Luís Enrique Martínez, González Pimienta recuerda que durante la residencia del acordeonero en el sector de Fontibón, Luís Enrique salía de correduría y le dejaba instrucciones precisas a su esposa Rosa para que llamara al Doctor González, quien le solucionaría lo del arriendo (diez mil pesos de la época) mientras durara su recorrido musical. Cuando Luís Enrique regresa, va sagradamente a mi oficina a entregarme el valor de los arriendos que le había prestado a Rosa; nunca me aceptó que se los regalara."
};

const GALLERY_IMAGES = [
  "https://i.imgur.com/ISYNhQI.jpeg",
  "https://i.imgur.com/llfpnBt.jpeg",
  "https://i.imgur.com/3CtCNHj.jpeg",
  "https://i.imgur.com/pvn0ncS.jpeg",
  "https://i.imgur.com/Wujs9OO.jpeg"
];

const Bio: React.FC = () => {
  // Duplicamos las imágenes para el efecto de scroll infinito suave
  const infiniteImages = useMemo(() => [...GALLERY_IMAGES, ...GALLERY_IMAGES], []);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 animate-fade-in-up font-sans selection:bg-vallenato-mustard selection:text-vallenato-blue">
      
      {/* Hero Section */}
      <section className="relative bg-vallenato-blue py-4 md:py-7 overflow-hidden">
         <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-vallenato-mustard/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-vallenato-red/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
         
         <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-2xl md:text-4xl font-serif font-bold mb-1.5 tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-[#FDE68A] via-[#EAAA00] to-[#B45309] py-0.5">
              Álvaro González Pimienta
            </h1>
            <div className="h-0.5 w-10 bg-vallenato-mustard mx-auto mb-2"></div>
            <p className="text-sm md:text-base text-gray-200 font-light font-serif italic max-w-lg mx-auto leading-tight">
              "El guardián de las melodías y la memoria del Magdalena Grande"
            </p>
         </div>
      </section>

      {/* Bio Image and Quote */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group cursor-pointer">
             <div className="absolute inset-0 bg-vallenato-blue rounded-3xl transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-transparent group-hover:border-vallenato-mustard sepia-[.15] group-hover:sepia-0 transition-all duration-700">
                <img 
                  src="https://i.imgur.com/cJhXAof.jpeg" 
                  alt="Álvaro González Pimienta junto al maestro Rafael Escalona" 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/30 p-4 rounded-2xl transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                   <div className="flex items-center gap-4">
                      <div className="bg-vallenato-mustard p-2 rounded-xl text-vallenato-blue shadow-lg">
                         <Camera size={16} />
                      </div>
                      <div className="flex flex-col text-left">
                         <p className="text-white font-sans text-[10px] md:text-xs uppercase font-extrabold tracking-[0.25em] leading-tight">
                            Álvaro González <span className="text-vallenato-mustard">junto al maestro</span>
                         </p>
                         <p className="text-white font-serif text-sm md:text-lg font-bold leading-tight mt-1">
                            Rafael Escalona
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <h2 className="text-4xl font-serif text-vallenato-blue font-bold">Una vida hecha canción</h2>
             <div className="text-gray-600 text-lg leading-relaxed space-y-4 font-serif italic">
               <p>
                 Desde sus primeros años en Valledupar hasta su asentamiento en Bogotá, Álvaro González ha dedicado más de cinco décadas a documentar toda la riqueza cultural que ha vivido a través del Vallenato.
               </p>
               <p>
                 No es solo un espectador; es parte viva de la historia, compartiendo experiencias, historia y conocimiento de este género.
               </p>
             </div>
             
             <blockquote className="bg-vallenato-cream p-8 rounded-tr-[3rem] rounded-bl-[3rem] border-l-4 border-vallenato-red shadow-sm flex flex-col sm:flex-row gap-6 transition-colors">
                <div className="flex-shrink-0">
                  <Quote className="text-vallenato-mustard/40 w-12 h-12 transform -scale-x-100" />
                </div>
                <p className="text-vallenato-blue font-serif text-lg lg:text-xl leading-relaxed italic">
                  Es una satisfacción personal enorme poder presentarle el país y al mundo un panorama amplio de la música vallenata interpretada por los verdaderos juglares de la época
                </p>
             </blockquote>
          </div>
        </div>
      </section>

      {/* Merit Badges */}
      <section className="py-12 bg-gray-50 border-y border-gray-100 transition-colors">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
               <div className="bg-white p-8 rounded-2xl shadow-museum flex items-start gap-6 hover:-translate-y-1 transition-all group">
                  <div className="bg-vallenato-blue p-4 rounded-full text-white group-hover:bg-vallenato-mustard group-hover:text-vallenato-blue transition-colors flex-shrink-0">
                     <Award size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-3">11 Veces Jurado</h3>
                     <p className="text-gray-600 text-sm leading-relaxed font-light">
                       Con un criterio respetado por juglares y novatos, ha sido designado <strong className="text-vallenato-blue font-bold">11 veces como jurado</strong> en el <strong className="text-vallenato-blue font-bold">Festival de la Leyenda Vallenata</strong>.
                     </p>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-2xl shadow-museum flex items-start gap-6 hover:-translate-y-1 transition-all group">
                  <div className="bg-vallenato-blue p-4 rounded-full text-white group-hover:bg-vallenato-red group-hover:text-white transition-colors flex-shrink-0">
                     <Mic size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-3">Voz Autorizada</h3>
                     <p className="text-gray-600 text-sm leading-relaxed font-light">
                        <strong className="text-vallenato-blue font-bold">Creador y director</strong> del programa radial <strong className="text-vallenato-blue font-bold">"Estampas Vallenatas"</strong>, referente obligado para la preservación cultural.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Galería de Retratos de una Época Dorada */}
      <section className="py-24 bg-vallenato-beige overflow-hidden relative">
         <div className="container mx-auto px-6 mb-12 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-vallenato-mustard/20 px-4 py-1.5 rounded-full mb-6 border border-vallenato-mustard/30">
               <Images className="text-vallenato-mustard w-4 h-4" />
               <span className="text-vallenato-mustard text-[10px] font-black uppercase tracking-[0.25em]">Crónica Visual</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-vallenato-blue font-bold mb-4">Retratos de una Época Dorada</h2>
            <p className="text-gray-600 font-serif italic text-lg max-w-2xl mx-auto">
               Instantes capturados que narran la historia de un folclor inmarcesible y los encuentros que forjaron la leyenda.
            </p>
         </div>

         {/* Contenedor del Scroll Infinito */}
         <div className="relative group">
            {/* Gradientes laterales para suavizar bordes */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-vallenato-beige to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-vallenato-beige to-transparent z-20 pointer-events-none"></div>

            <div className="flex w-full overflow-hidden">
               <div className="flex animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] py-4">
                  {infiniteImages.map((img, idx) => (
                     <div 
                        key={idx} 
                        className="flex-shrink-0 px-4 group/item"
                     >
                        {/* Marco Dinámico Multicapa - Bordes más pequeños y circulares */}
                        <div className="relative p-1 md:p-1.5 bg-gradient-to-r from-vallenato-blue via-vallenato-red to-vallenato-mustard bg-[length:200%_auto] animate-border-flow shadow-gold rounded-[3.5rem] transition-all duration-700 group-hover/item:scale-[1.05]">
                           
                           {/* Marco de "Pan de Oro" Metálico Interno - Bordes proporcionales */}
                           <div className="relative p-1 md:p-2 bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] shadow-inner overflow-hidden rounded-[3.2rem]">
                              
                              {/* Brillo Metálico Animado */}
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>

                              <div className="relative w-[300px] md:w-[450px] aspect-[4/3] overflow-hidden bg-black shadow-2xl rounded-[3rem]">
                                 <img 
                                    src={img} 
                                    alt={`Momento histórico ${idx + 1}`}
                                    className="w-full h-full object-cover filter sepia-[0.3] group-hover/item:sepia-0 transition-all duration-700 cursor-crosshair"
                                    loading="lazy"
                                 />
                                 <div className="absolute inset-0 bg-black/20 group-hover/item:bg-transparent transition-colors"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white transition-colors">
         <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-serif text-vallenato-blue mb-8">Nuestra Misión Cultural</h2>
            <p className="text-xl text-gray-600 font-light mb-12 leading-relaxed italic">
              Preservar la esencia pura de los cuatro aires tradicionales: Paseo, Merengue, Son y Puya. 
              Luchar contra el olvido mediante la documentación rigurosa y la difusión tecnológica.
            </p>
            
            <div className="relative inline-block rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:border-vallenato-mustard hover:shadow-[0_0_40px_rgba(234,170,0,0.5)] transition-all duration-500 sepia-[.15] group cursor-pointer mx-auto">
               <img 
                 src="https://i.imgur.com/hDuEleJ.jpeg" 
                 alt="Álvaro González Pimienta junto al gran Luis Enrique Martínez" 
                 className="max-w-full md:max-w-3xl h-auto object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                 loading="lazy"
               />
               <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/30 p-4 rounded-2xl transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-4">
                     <div className="bg-vallenato-red p-2 rounded-xl text-white shadow-lg">
                        <Camera size={16} />
                     </div>
                     <div className="flex flex-col text-left">
                         <p className="text-white font-sans text-[10px] md:text-xs uppercase font-extrabold tracking-[0.25em] leading-tight">
                            Álvaro González <span className="text-vallenato-red">junto al gran</span>
                         </p>
                         <p className="text-white font-serif text-sm md:text-lg font-bold leading-tight mt-1">
                            Luis Enrique Martínez
                         </p>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Anecdotes Section */}
      <section className="bg-white pb-24 border-b-8 border-vallenato-red transition-colors">
         <div className="container mx-auto px-6">
            <div className="bg-gray-50 max-w-5xl mx-auto p-10 md:p-16 rounded-3xl shadow-inner relative overflow-hidden transition-colors">
               <History className="absolute top-10 right-10 text-gray-200 w-32 h-32 -z-0 opacity-50" />
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-1 border-r border-gray-200 pr-8">
                     <span className="text-vallenato-red font-bold uppercase tracking-widest text-xs mb-2 block">El Legado</span>
                     <h3 className="text-3xl font-serif text-gray-900 mb-4">Anécdotas de una vida Vallenata</h3>
                     <p className="text-sm text-gray-500 italic leading-relaxed">
                        Extracto de entrevista para la revista del 42° Festival de la Leyenda Vallenata.
                     </p>
                  </div>
                  <div className="md:col-span-2 prose prose-lg text-gray-700 font-serif leading-relaxed space-y-6 italic">
                     <p>{ANECDOTAS_TEXT.p1}</p>
                     <p>{ANECDOTAS_TEXT.p2}</p>
                     <p>{ANECDOTAS_TEXT.p3}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes border-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-border-flow {
          animation: border-flow 4s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Bio;
