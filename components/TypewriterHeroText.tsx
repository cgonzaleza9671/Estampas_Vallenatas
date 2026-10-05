import React, { useState, useEffect } from 'react';

interface TypewriterHeroTextProps {
  loop?: boolean;
}

export const TypewriterHeroText: React.FC<TypewriterHeroTextProps> = ({ loop = false }) => {
  const line1Full = "Hemos llegado ya a";
  const line2Full = "+120 CANCIONES";
  const line3Full = "joyas de nuestra memoria vallenata";

  const [phase, setPhase] = useState<'line1' | 'line2' | 'line3' | 'done'>('line1');
  const [line1Count, setLine1Count] = useState(0);
  const [line2Count, setLine2Count] = useState(0);
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
          setPhase('line2');
        }, 280);
      }
    } else if (phase === 'line2') {
      if (line2Count < line2Full.length) {
        timeoutId = setTimeout(() => {
          setLine2Count((prev) => prev + 1);
        }, 85);
      } else {
        timeoutId = setTimeout(() => {
          setPhase('line3');
        }, 360);
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
        setLine2Count(0);
        setLine3Count(0);
        setPhase('line1');
      }, 6000);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, line1Count, line2Count, line3Count, loop, line1Full.length, line2Full.length, line3Full.length]);

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

      {/* Línea 2: "+120 CANCIONES" con resplandor y degradado dorado intactos */}
      <div className="relative group min-h-[3.8rem] md:min-h-[5.5rem] flex items-center justify-center">
        <div
          className={`absolute inset-0 bg-vallenato-mustard blur-2xl rounded-full transition-opacity duration-700 ${
            line2Count > 0 ? 'opacity-30 group-hover:opacity-50 animate-pulse' : 'opacity-0'
          }`}
        />

        <div className="relative text-5xl md:text-7xl font-serif font-black tracking-tight leading-none px-4 flex items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-[#FFD700] to-[#EAAA00] drop-shadow-[0_2px_15px_rgba(234,170,0,0.6)]">
            {line2Count > 0 && <span className="text-[0.5em] align-middle mr-1">+</span>}
            {line2Count > 1 ? line2Full.slice(1, line2Count) : ''}
          </span>
          {phase === 'line2' && (
            <span
              className={`inline-block ml-1.5 w-1 md:w-2 h-9 md:h-14 bg-gradient-to-b from-[#FFD700] to-[#EAAA00] rounded-sm shadow-[0_0_12px_rgba(234,170,0,0.85)] transition-opacity duration-150 ${
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
