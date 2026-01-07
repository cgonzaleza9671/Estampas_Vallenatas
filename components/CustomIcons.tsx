
import React from 'react';

// Icono del acordeón (se mantiene para usos secundarios)
export const AccordionPlayIcon = ({ className = "w-6 h-6", size }: { className?: string; size?: number | string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5H7C7.55 5 8 5.45 8 6V18C8 18.55 7.55 19 7 19H4C3.45 19 3 18.55 3 18V6C3 5.45 3.45 5 4 5Z" />
      <circle cx="5.5" cy="8" r="1" fill="none" />
      <circle cx="5.5" cy="12" r="1" fill="none" />
      <circle cx="5.5" cy="16" r="1" fill="none" />
      <path d="M8 6L16 6" />
      <path d="M8 18L16 18" />
      <path d="M8 8L16 8.5" opacity="0.8" />
      <path d="M16 11L8 11.5" opacity="0.8" />
      <path d="M8 14L16 14.5" opacity="0.8" />
      <path d="M16 6C16 4.89543 16.8954 4 18 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H18C16.8954 20 16 19.1046 16 18V6Z" />
      <path d="M18.5 7V17" strokeWidth="1.5" />
    </g>
  </svg>
);

export const YouTubeLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const SpotifyLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

export const AppleMusicLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 3H9v10.75c-.53-.29-1.13-.5-1.77-.5-1.78 0-3.23 1.45-3.23 3.23s1.45 3.23 3.23 3.23 3.23-1.45 3.23-3.23V7h7v5.75c-.53-.29-1.13-.5-1.77-.5-1.78 0-3.23 1.45-3.23 3.23s1.45 3.23 3.23 3.23 3.23-1.45 3.23-3.23V3z"/>
  </svg>
);
