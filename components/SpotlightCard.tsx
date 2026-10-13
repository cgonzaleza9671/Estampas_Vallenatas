import React, { useRef, useState } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string; // CSS color string, defaults to warm gold/amber
  spotlightSize?: number;  // Radius in px, defaults to 350
  spotlightOpacity?: number; // 0 to 1, defaults to 0.14
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = '234, 170, 0', // RGB of vallenato-mustard
  spotlightSize = 380,
  spotlightOpacity = 0.14,
  onMouseMove,
  onMouseLeave,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
    cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
    if (!isHovered) setIsHovered(true);
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group ${className}`}
      {...rest}
    >
      {/* Halo Spotlight con gradiente radial que sigue el cursor */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ease-out hidden sm:block"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(${spotlightColor}, ${spotlightOpacity}), transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Sutil micro-borde iluminado que acompaña el reflejo */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-500 hidden sm:block"
        style={{
          opacity: isHovered ? 1 : 0,
          padding: '1px',
          background: `radial-gradient(${spotlightSize * 0.75}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(${spotlightColor}, ${spotlightOpacity * 1.8}), transparent 60%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
};

export default SpotlightCard;
