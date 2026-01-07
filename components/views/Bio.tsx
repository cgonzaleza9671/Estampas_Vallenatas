
import React, { useState, useRef, useEffect } from 'react';
import { saveQuestion } from '../../services/supabaseClient';
import { getGeminiResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import Button from '../Button';
import { Send, User, Sparkles, Award, Mic, Quote, History, Loader2, Camera } from 'lucide-react';

const Bio: React.FC = () => {
  // AI State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questionInput, setQuestionInput] = useState('');
  const [userData, setUserData] = useState({ name: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [interactionStarted, setInteractionStarted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || !userData.name || !userData.city) return;

    setLoading(true);
    setInteractionStarted(true);

    const currentQuestion = questionInput;
    const userMsg: ChatMessage = { sender: 'user', text: currentQuestion, timestamp: new Date() };
    setMessages([userMsg]);
    
    setQuestionInput('');

    try {
      await saveQuestion({
        nombre_apellido: userData.name,
        ciudad: userData.city,
        pregunta: currentQuestion
      });

      const aiResponseText = await getGeminiResponse(currentQuestion, userData.name, userData.city);
      
      const aiMsg: ChatMessage = { sender: 'ai', text: aiResponseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error("Error en consulta:", error);
      const errorMsg: ChatMessage = { sender: 'ai', text: "Disculpa compañero, hubo una interferencia en la señal. Intenta de nuevo.", timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 animate-fade-in-up font-sans selection:bg-vallenato-mustard selection:text-vallenato-blue">
      
      <section className="relative bg-vallenato-blue py-24 overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vallenato-mustard/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-vallenato-red/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
         
         <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-[#FDE68A] via-[#EAAA00] to-[#B45309] py-2">
              Álvaro González Pimienta
            </h1>
            <div className="h-1 w-24 bg-vallenato-mustard mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-gray-200 font-light font-serif italic max-w-3xl mx-auto">
              "El guardián de las melodías y la memoria del Magdalena Grande"
            </p>
         </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group cursor-pointer">
             <div className="absolute inset-0 bg-vallenato-blue rounded-3xl transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-transparent group-hover:border-vallenato-mustard sepia-[.15] group-hover:sepia-0 transition-all duration-700">
                <img 
                  src="https://i.imgur.com/cJhXAof.jpeg" 
                  alt="Álvaro González Pimienta junto al maestro Rafael Escalona" 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/30 p-4 rounded-2xl transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                   <div className="flex items-center gap-4">
                      <div className="bg-vallenato-mustard p-2 rounded-xl text-vallenato-blue shadow-lg">
                         <Camera size={16} />
                      </div>
                      <div className="flex flex-col">
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
                 No es solo un espectador; es parte viva de la historia, compartiendo parrandas y secretos con los fundadores del género.
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
                        <strong className="text-vallenato-blue font-bold">Creador y director</strong> del programa <strong className="text-vallenato-blue font-bold">"Estampas Vallenatas"</strong>, referente obligado para la preservación cultural.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

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

      <section className="bg-white pb-24 border-b-8 border-vallenato-red transition-colors">
         <div className="container mx-auto px-6">
            <div className="bg-gray-50 max-w-5xl mx-auto p-10 md:p-16 rounded-3xl shadow-inner relative overflow-hidden transition-colors">
               <History className="absolute top-10 right-10 text-gray-200 w-32 h-32 -z-0 opacity-50" />
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-1 border-r border-gray-200 pr-8">
                     <span className="text-vallenato-red font-bold uppercase tracking-widest text-xs mb-2 block">El Legado</span>
                     <h3 className="text-3xl font-serif text-gray-900 mb-4">Anécdotas de una vida Vallenata</h3>
                     <p className="text-sm text-gray-500 italic leading-relaxed">
                        Extracto de entrevista para el 42° Festival de la Leyenda Vallenata.
                     </p>
                  </div>
                  <div className="md:col-span-2 prose prose-lg text-gray-700 font-serif leading-relaxed space-y-4 italic">
                     <p>
                        Sin poder ocultar la nostalgia al recordar el recorrido folclórico que 'Estampas Vallenatas' protagonizó en la radio nacional...
                     </p>
                     <p>
                        En cierta ocasión, programó la canción 'El accidente de Lisandro' y, casi de inmediato, recibió la llamada de un oyente conmovido...
                     </p>
                     <p>
                        "De la amistad entrañable con 'El Pollo Vallenato', Luís Enrique Martínez, González Pimienta recuerda..."
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <section className="py-24 container mx-auto px-6 max-w-5xl">
         <div className="bg-vallenato-cream rounded-[2.5rem] shadow-2xl border border-vallenato-mustard/20 overflow-hidden relative transition-colors">
            <div className="bg-vallenato-blue p-8 md:p-10 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-vallenato-mustard p-3 rounded-full mb-4 shadow-lg animate-pulse">
                     <Sparkles className="text-vallenato-blue w-6 h-6" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Pregúntale al Maestro</h2>
               </div>
            </div>

            <div className="p-8 md:p-12">
              {!interactionStarted ? (
                <form onSubmit={handleConsultation} className="max-w-2xl mx-auto space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase text-vallenato-blue tracking-widest ml-1">Tu Nombre</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Ej: Gabriel García"
                           className="w-full p-4 rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-vallenato-mustard transition-all outline-none"
                           value={userData.name}
                           onChange={(e) => setUserData({...userData, name: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase text-vallenato-blue tracking-widest ml-1">Tu Ciudad</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Ej: Barranquilla"
                           className="w-full p-4 rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-vallenato-mustard transition-all outline-none"
                           value={userData.city}
                           onChange={(e) => setUserData({...userData, city: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-vallenato-blue tracking-widest ml-1">Tu Pregunta sobre el Folclor</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Maestro, cuénteme la historia detrás de la casa en el aire..."
                        className="w-full p-4 rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-vallenato-mustard transition-all outline-none resize-none"
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                      />
                   </div>

                   <Button type="submit" fullWidth disabled={loading} className="mt-4">
                      {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Conectando...</span> : 'Enviar Consulta'}
                   </Button>
                </form>
              ) : (
                <div className="flex flex-col h-[500px]">
                   <div className="flex-1 overflow-y-auto pr-4 space-y-6 mb-6 custom-scrollbar">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] p-6 rounded-2xl text-lg leading-relaxed shadow-sm ${
                              msg.sender === 'user' 
                                ? 'bg-white text-gray-800 border border-gray-100 rounded-br-none' 
                                : 'bg-vallenato-blue text-white rounded-bl-none'
                           }`}>
                              {msg.sender === 'ai' && (
                                <div className="flex items-center gap-2 mb-2 border-b border-white/20 pb-2">
                                   <div className="w-6 h-6 rounded-full bg-vallenato-mustard flex items-center justify-center">
                                      <User size={14} className="text-vallenato-blue" />
                                   </div>
                                   <span className="text-xs font-bold uppercase tracking-widest text-vallenato-mustard">Respuesta del Maestro</span>
                                </div>
                              )}
                              <p className="font-serif italic">{msg.text}</p>
                           </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                           <div className="bg-vallenato-blue p-6 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                              <span className="text-white font-serif text-sm">Pensando respuesta...</span>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-vallenato-mustard rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-vallenato-mustard rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-vallenato-mustard rounded-full animate-bounce delay-150"></div>
                              </div>
                           </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                   </div>
                   
                   <form onSubmit={handleConsultation} className="relative">
                      <input 
                         type="text" 
                         className="w-full p-4 pr-14 rounded-full border border-gray-300 bg-white text-gray-800 focus:border-vallenato-blue outline-none shadow-sm"
                         placeholder="Haz otra pregunta..."
                         value={questionInput}
                         onChange={(e) => setQuestionInput(e.target.value)}
                         disabled={loading}
                      />
                      <button 
                        type="submit"
                        disabled={loading || !questionInput.trim()}
                        className="absolute right-2 top-2 p-2 bg-vallenato-red text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                         <Send size={20} />
                      </button>
                   </form>
                </div>
              )}
            </div>
         </div>
      </section>

    </div>
  );
};

export default Bio;
