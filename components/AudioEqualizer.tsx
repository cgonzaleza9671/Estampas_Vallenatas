import React from 'react';

interface AudioEqualizerProps {
  isPlaying?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string; // tailwind bg color, e.g. 'bg-vallenato-mustard'
  className?: string;
}

export const AudioEqualizer: React.FC<AudioEqualizerProps> = ({
  isPlaying = true,
  size = 'md',
  color = 'bg-vallenato-mustard',
  className = '',
}) => {
  // Dimensiones por tamaño
  const sizeConfig = {
    xs: { container: 'h-3 gap-[1.5px]', bar: 'w-[2px] rounded-full', heights: ['h-2', 'h-3', 'h-1.5', 'h-2.5'] },
    sm: { container: 'h-4 gap-[2px]', bar: 'w-[2.5px] rounded-full', heights: ['h-3', 'h-4', 'h-2', 'h-3.5'] },
    md: { container: 'h-5 gap-[2.5px]', bar: 'w-[3px] rounded-full', heights: ['h-3.5', 'h-5', 'h-2.5', 'h-4'] },
    lg: { container: 'h-6 gap-[3px]', bar: 'w-[3.5px] rounded-full', heights: ['h-4', 'h-6', 'h-3', 'h-5'] },
  }[size];

  if (!isPlaying) {
    return (
      <div className={`flex items-end ${sizeConfig.container} ${className}`} aria-label="Audio en pausa">
        <span className={`inline-block ${sizeConfig.bar} h-[3px] ${color} opacity-40 transition-all duration-300`} />
        <span className={`inline-block ${sizeConfig.bar} h-[5px] ${color} opacity-40 transition-all duration-300`} />
        <span className={`inline-block ${sizeConfig.bar} h-[3px] ${color} opacity-40 transition-all duration-300`} />
        <span className={`inline-block ${sizeConfig.bar} h-[4px] ${color} opacity-40 transition-all duration-300`} />
      </div>
    );
  }

  return (
    <div className={`flex items-end ${sizeConfig.container} ${className}`} aria-label="Audio reproduciéndose">
      <span
        className={`inline-block ${sizeConfig.bar} ${color} animate-audio-bar-1 origin-bottom shadow-[0_0_8px_rgba(234,170,0,0.5)]`}
        style={{ minHeight: '3px' }}
      />
      <span
        className={`inline-block ${sizeConfig.bar} ${color} animate-audio-bar-2 origin-bottom shadow-[0_0_8px_rgba(234,170,0,0.5)]`}
        style={{ minHeight: '3px' }}
      />
      <span
        className={`inline-block ${sizeConfig.bar} ${color} animate-audio-bar-3 origin-bottom shadow-[0_0_8px_rgba(234,170,0,0.5)]`}
        style={{ minHeight: '3px' }}
      />
      <span
        className={`inline-block ${sizeConfig.bar} ${color} animate-audio-bar-4 origin-bottom shadow-[0_0_8px_rgba(234,170,0,0.5)]`}
        style={{ minHeight: '3px' }}
      />
    </div>
  );
};

export default AudioEqualizer;
