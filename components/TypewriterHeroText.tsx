import React, { useState, useEffect } from 'react';

interface TypewriterHeroTextProps {
  loop?: boolean;
}

export const TypewriterHeroText: React.FC<TypewriterHeroTextProps> = ({ loop = false }) => {
  const line1Full = "Hemos llegado ya a";
  const line2aFull = "+120 canciones";
  const line2bFull = "y +10 relatos legendarios";
  const line3Full = "joyas de nuestra memoria vallenata";

  const [phase, setPhase] = useState<'line1' | 'line2a' | 'line2b' | 'line3' | 'done'>('line1');
  const [line1Count, setLine1Count] = useState(0);
  const [line2aCount, setLine2aCount] = useState(0);
  const [line2bCount, setLine2bCount] = useState(0);
  const [line3Count, setLine3Count] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Parpadeo suave del cursor de escritura
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 450);
    return () => clearInterval(cursorInterval);
  }, []);

  // Secuencia de máquina de escribir por fases
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (phase === 'line1') {
      if (line1Count < line1Full.length) {
        timeoutId = setTimeout(() => {
          setLine1Count((prev) => prev + 1);
        }, 58);
      } else {
        timeoutId = setTimeout(() => {
          setPhase('line2a');
        }, 280);
      }
    } else if (phase === 'line2a') {
      if (line2aCount < line2aFull.length) {
        timeoutId = setTimeout(() => {
          setLine2aCount((prev) => prev + 1);
        }, 75);
      } else {
        timeoutId = setTimeout(() => {
          setPhase('line2b');
        }, 260);
      }
    } else if (phase === 'line2b') {
      if (line2bCount < line2bFull.length) {
        timeoutId = setTimeout(() => {
          setLine2bCount((prev) => prev + 1);
        }, 62);
      } else {
        timeoutId = setTimeout(() => {
          setPhase('line3');
        }, 320);
      }
    } else if (phase === 'line3') {
      if (line3Count < line3Full.length) {
        timeoutId = setTimeout(() => {
          setLine3Count((prev) => prev + 1);
        }, 45);
      } else {
        timeoutId = setTimeout(() => {
          setPhase('done');
        }, 3000);
      }
    } else if (phase === 'done' && loop) {
      timeoutId = setTimeout(() => {
        setLine1Count(0);
        setLine2aCount(0);
        setLine2bCount(0);
        setLine3Count(0);
        setPhase('line1');
      }, 6000);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, line1Count, line2aCount, line2bCount, line3Count, loop, line1Full.length, line2aFull.length, line2bFull.length, line3Full.length]);

  // Renderiza la línea 2a con el '+' estilizado
  const renderLine2a = (count: number) => {
    if (count <= 0) return null;
    const slice = line2aFull.slice(0, count);
    return (
      <>
        <span className="text-[0.55em] align-middle mr-1 select-none font-bold">+</span>
        <span>{slice.slice(1)}</span>
      </>
    );
  };

  // Renderiza la línea 2b con el conector 'y' y el '+' estilizado
  const renderLine2b = (count: number) => {
    if (count <= 0) return null;
    const slice = line2bFull.slice(0, count);
    const plusIdx = slice.indexOf('+');
    if (plusIdx === -1) {
      return <span>{slice}</span>;
    }
    const beforePlus = slice.slice(0, plusIdx);
    const afterPlus = slice.slice(plusIdx + 1);
    return (
      <>
        <span>{beforePlus}</span>
        <span className="text-[0.55em] align-middle mr-1 select-none font-bold">+</span>
        <span>{afterPlus}</span>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center my-6 md:my-8 animate-fade-in-up select-none">
      {/* Línea 1: "Hemos llegado ya a" */}
      <p className="min-h-[1.5rem] flex items-center justify-center text-gray-200 font-sans text-xs md:text-sm uppercase tracking-[0.3em] mb-2 font-medium drop-shadow-md">
        <span>{line1Full.slice(0, line1Count)}</span>
        {phase === 'line1' && (
          <span
            className={`inline-block ml-1 w-1.5 h-3.5 bg-vallenato-mustard rounded-xs transition-opacity duration-150 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </p>

      {/* Bloque central en dos líneas escalonadas de gran impacto con resplandor dorado */}
      <div className="relative group flex flex-col items-center justify-center my-1 md:my-2 w-full">
        <div
          className={`absolute inset-0 bg-vallenato-mustard blur-3xl rounded-full transition-opacity duration-700 pointer-events-none ${
            line2aCount > 0 ? 'opacity-35 group-hover:opacity-50 animate-pulse' : 'opacity-0'
          }`}
        />

        {/* Línea 2a: "+120 canciones" */}
        <div className="relative min-h-[2.4rem] sm:min-h-[3rem] md:min-h-[3.8rem] flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none px-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-[#FFD700] to-[#EAAA00] drop-shadow-[0_2px_15px_rgba(234,170,0,0.6)]">
            {renderLine2a(line2aCount)}
          </span>
          {phase === 'line2a' && (
            <span
              className={`inline-block ml-1 md:ml-1.5 w-1 md:w-1.5 h-6 sm:h-7 md:h-10 bg-gradient-to-b from-[#FFD700] to-[#EAAA00] rounded-sm shadow-[0_0_12px_rgba(234,170,0,0.85)] transition-opacity duration-150 align-middle ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* Línea 2b: "y +10 relatos legendarios" */}
        <div className="relative min-h-[1.9rem] sm:min-h-[2.2rem] md:min-h-[2.9rem] flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-extrabold tracking-tight leading-tight px-4 mt-1 sm:mt-1.5 md:mt-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-[#FFE066] to-[#EAAA00] drop-shadow-[0_2px_12px_rgba(234,170,0,0.5)]">
            {renderLine2b(line2bCount)}
          </span>
          {phase === 'line2b' && (
            <span
              className={`inline-block ml-1 md:ml-1.5 w-1 md:w-1.5 h-4 sm:h-5 md:h-7 bg-gradient-to-b from-[#FFD700] to-[#EAAA00] rounded-sm shadow-[0_0_12px_rgba(234,170,0,0.85)] transition-opacity duration-150 align-middle ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      </div>

      {/* Línea 3: "joyas de nuestra memoria vallenata" */}
      <p className="min-h-[2.5rem] md:min-h-[3.5rem] flex items-center justify-center text-vallenato-mustard font-calligraphy text-2xl md:text-4xl mt-3 md:mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span>{line3Full.slice(0, line3Count)}</span>
        {phase === 'line3' && (
          <span
            className={`inline-block ml-1.5 w-1 h-6 md:h-8 bg-vallenato-mustard/90 rounded-xs transition-opacity duration-150 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </p>
    </div>
  );
};

export default TypewriterHeroText;
