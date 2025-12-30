import React, { useState, useRef, useEffect } from 'react';
import { saveQuestion } from '../../services/supabaseClient';
import { getGeminiResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import Button from '../Button';
import { Send, User, Sparkles, Award, Mic, Quote, History, Loader2 } from 'lucide-react';

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

    // Initial user message to state
    const currentQuestion = questionInput;
    const userMsg: ChatMessage = { sender: 'user', text: currentQuestion, timestamp: new Date() };
    setMessages([userMsg]);
    
    // Clear input to prevent double submission, keep user data
    setQuestionInput('');

    try {
      // 1. Critical: Save to Supabase DB first
      await saveQuestion({
        nombre_apellido: userData.name,
        ciudad: userData.city,
        pregunta: currentQuestion
      });

      // 2. Call Gemini AI
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
    <div className="min-h-screen bg-white animate-fade-in-up font-sans selection:bg-vallenato-mustard selection:text-vallenato-blue">
      
      {/* A. HERO SECTION (Editorial) */}
      <section className="relative bg-vallenato-blue py-24 overflow-hidden">
         {/* Decorative Background Elements */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vallenato-mustard/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-vallenato-red/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
         
         <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 tracking-tight drop-shadow-lg">
              Álvaro González Pimienta
            </h1>
            <div className="h-1 w-24 bg-vallenato-mustard mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-gray-200 font-light font-serif italic max-w-3xl mx-auto">
              "El guardián de las melodías y la memoria del Magdalena Grande"
            </p>
         </div>
      </section>

      {/* B. BIOGRAPHY (Split Layout) */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image with Antique Effect */}
          <div className="relative group">
             <div className="absolute inset-0 bg-vallenato-blue rounded-3xl transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white sepia-[.15] group-hover:sepia-0 transition-all duration-700">
                <img 
                  src="https://i.imgur.com/cJhXAof.jpeg" 
                  alt="Álvaro González Pimienta junto al maestro Rafael Escalona" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                   <p className="text-white font-sans text-xs uppercase tracking-widest text-center">
                     Álvaro González Pimienta junto al maestro Rafael Escalona
                   </p>
                </div>
             </div>
          </div>

          {/* Right: Editorial Text */}
          <div className="space-y-8">
             <h2 className="text-4xl font-serif text-vallenato-blue font-bold">Una vida hecha canción</h2>
             <div className="text-gray-600 text-lg leading-relaxed space-y-4">
               <p>
                 Desde sus primeros años en Valledupar hasta su asentamiento en Bogotá, Álvaro González ha dedicado más de cinco décadas a documentar toda la riqueza cultural que ha vivido a través del Vallenato.
               </p>
               <p>
                 No es solo un espectador; es parte viva de la historia, compartiendo parrandas y secretos con los fundadores del género.
               </p>
             </div>
             
             {/* Fixed Overlapping Quote by using Flexbox */}
             <blockquote className="bg-vallenato-cream p-8 rounded-tr-[3rem] rounded-bl-[3rem] border-l-4 border-vallenato-red shadow-sm flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Quote className="text-vallenato-mustard/40 w-12 h-12 transform -scale-x-100" />
                </div>
                <p className="text-vallenato-blue font-serif italic text-lg lg:text-xl leading-relaxed">
                  "Es una satisfacción personal enorme poder presentarle el país y al mundo un panorama amplio de la música vallenata interpretada por los verdaderos juglares de la época"
                </p>
             </blockquote>
          </div>
        </div>
      </section>

      {/* C. CREDENTIALS (Bento Grid) */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
               {/* Card 1 */}
               <div className="bg-white p-8 rounded-2xl shadow-museum flex items-start gap-6 hover:-translate-y-1 transition-transform duration-300 group">
                  <div className="bg-vallenato-blue p-4 rounded-full text-white group-hover:bg-vallenato-mustard group-hover:text-vallenato-blue transition-colors flex-shrink-0">
                     <Award size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-3">11 Veces Jurado</h3>
                     <p className="text-gray-600 text-sm leading-relaxed font-light">
                       Con un criterio respetado por juglares y novatos, ha sido designado <strong className="text-vallenato-blue font-bold">11 veces como jurado</strong> en el <strong className="text-vallenato-blue font-bold">Festival de la Leyenda Vallenata</strong> en distintas categorías (piquería, canción inédita, rey vallenato, rey de reyes y rey vallenato profesional).
                     </p>
                  </div>
               </div>

               {/* Card 2 */}
               <div className="bg-white p-8 rounded-2xl shadow-museum flex items-start gap-6 hover:-translate-y-1 transition-transform duration-300 group">
                  <div className="bg-vallenato-blue p-4 rounded-full text-white group-hover:bg-vallenato-red group-hover:text-white transition-colors flex-shrink-0">
                     <Mic size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-serif text-vallenato-blue font-bold mb-3">Voz Autorizada</h3>
                     <p className="text-gray-600 text-sm leading-relaxed font-light">
                        <strong className="text-vallenato-blue font-bold">Creador y director</strong> del programa <strong className="text-vallenato-blue font-bold">"Estampas Vallenatas"</strong>, una plataforma radial líder que se convirtió en referencia obligada para la <strong className="text-vallenato-blue font-bold">preservación cultural</strong>.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* E. VISION & MISSION */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-serif text-vallenato-blue mb-8">Nuestra Misión Cultural</h2>
            <p className="text-xl text-gray-600 font-light mb-12 leading-relaxed">
              Preservar la esencia pura de los cuatro aires tradicionales: Paseo, Merengue, Son y Puya. 
              Luchar contra el olvido mediante la documentación rigurosa y la difusión tecnológica, 
              asegurando que las futuras generaciones conozcan la raíz del sentimiento vallenato.
            </p>
            
            {/* Secondary Image with Golden Frame Hover Effect */}
            <div className="relative inline-block rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:border-vallenato-mustard hover:shadow-[0_0_40px_rgba(234,170,0,0.5)] transition-all duration-500 sepia-[.15] group cursor-pointer mx-auto">
               <img 
                 src="https://i.imgur.com/hDuEleJ.jpeg" 
                 alt="Álvaro González Pimienta junto al gran Luis Enrique Martínez" 
                 className="max-w-full md:max-w-3xl h-auto object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                  <p className="text-white font-sans text-xs uppercase tracking-widest text-center">
                    Álvaro González Pimienta junto al gran Luis Enrique Martínez
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* F. ANECDOTE & LEGACY */}
      <section className="bg-white pb-24 border-b-8 border-vallenato-red">
         <div className="container mx-auto px-6">
            <div className="bg-gray-50 max-w-5xl mx-auto p-10 md:p-16 rounded-3xl shadow-inner relative overflow-hidden">
               <History className="absolute top-10 right-10 text-gray-200 w-32 h-32 -z-0 opacity-50" />
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-1 border-r border-gray-200 pr-8">
                     <span className="text-vallenato-red font-bold uppercase tracking-widest text-xs mb-2 block">El Legado</span>
                     <h3 className="text-3xl font-serif text-gray-900 mb-4">Anécdotas de una vida Vallenata</h3>
                     <p className="text-sm text-gray-500 italic leading-relaxed">
                        Extracto de entrevista realizada para la revista del cuadragésimo segundo Festival de la Leyenda Vallenata
                     </p>
                  </div>
                  <div className="md:col-span-2 prose prose-lg text-gray-700 font-serif leading-relaxed space-y-4">
                     <p>
                        Sin poder ocultar la nostalgia al recordar el recorrido folclórico que 'Estampas Vallenatas' protagonizó en la radio nacional, Álvaro González afirma que la mayor satisfacción fue llevarle a la población campesina y rural de Colombia un deleite espiritual con música que no habían escuchado anteriormente.
                     </p>
                     <p>
                        En cierta ocasión, programó la canción 'El accidente de Lisandro' y, casi de inmediato, recibió la llamada de un oyente conmovido: "Doctor González, yo pensé que ese tema no lo tenía nadie en Colombia". Años atrás, incluso Eloy 'Chichi' Quintero, desde su rol como Cónsul en Maracaibo, se comunicó con el programa para destacar la inmensa sintonía de 'Estampas Vallenatas' en territorio venezolano.
                     </p>
                     <p>
                        "De la amistad entrañable con 'El Pollo Vallenato', Luís Enrique Martínez, González Pimienta recuerda que durante la residencia del acordeonero en el sector de Fontibón, Luís Enrique salía de correduría y le dejaba instrucciones precisas a su esposa Rosa para que llamara al Doctor González, quien le solucionaría lo del arriendo (diez mil pesos de la época) mientras durara su recorrido musical. Cuando Luís Enrique regresaba, iba sagradamente a mi oficina a entregarme el valor de los arriendos que le había prestado a Rosa; nunca me aceptó que se los regalara"
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* D. AI MODULE: "Pregúntale al Maestro" (MOVED TO BOTTOM) */}
      <section className="py-24 container mx-auto px-6 max-w-5xl">
         <div className="bg-vallenato-cream rounded-[2.5rem] shadow-2xl border border-vallenato-mustard/20 overflow-hidden relative">
            {/* Header of AI Card */}
            <div className="bg-vallenato-blue p-8 md:p-10 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-vallenato-mustard p-3 rounded-full mb-4 shadow-lg animate-pulse">
                     <Sparkles className="text-vallenato-blue w-6 h-6" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Pregúntale al Maestro</h2>
                  {/* Removed Subtitle as requested */}
               </div>
            </div>

            <div className="p-8 md:p-12">
              {!interactionStarted ? (
                /* STEP 1: CONSULTATION FORM */
                <form onSubmit={handleConsultation} className="max-w-2xl mx-auto space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase text-vallenato-blue tracking-widest ml-1">Tu Nombre</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Ej: Gabriel García"
                           className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-vallenato-mustard focus:ring-2 focus:ring-vallenato-mustard/20 focus:outline-none transition-all"
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
                           className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-vallenato-mustard focus:ring-2 focus:ring-vallenato-mustard/20 focus:outline-none transition-all"
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
                        className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-vallenato-mustard focus:ring-2 focus:ring-vallenato-mustard/20 focus:outline-none transition-all resize-none"
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                      />
                   </div>

                   <Button type="submit" fullWidth disabled={loading} className="mt-4">
                      {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Conectando...</span> : 'Enviar Consulta'}
                   </Button>
                   <p className="text-center text-xs text-gray-400 mt-4">
                     * Tus datos se guardan para mejorar la experiencia del museo.
                   </p>
                </form>
              ) : (
                /* STEP 2: CHAT INTERFACE */
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
                              <p className="font-serif">{msg.text}</p>
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
                   
                   {/* Follow up input */}
                   <form onSubmit={handleConsultation} className="relative">
                      <input 
                         type="text" 
                         className="w-full p-4 pr-14 rounded-full border border-gray-300 focus:border-vallenato-blue focus:ring-2 focus:ring-vallenato-blue/20 outline-none shadow-sm"
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
                   <button 
                     onClick={() => { setInteractionStarted(false); setMessages([]); setQuestionInput(''); }}
                     className="text-xs text-center text-gray-400 mt-4 hover:text-vallenato-blue underline"
                   >
                     Nueva consulta (Reiniciar formulario)
                   </button>
                </div>
              )}
            </div>
         </div>
      </section>

    </div>
  );
};

export default Bio;