import React from 'react';

export const AccordionPlayIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Line Art / Outline Style based on reference */}
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Bass Box (Left) */}
      <path d="M4 5H7C7.55 5 8 5.45 8 6V18C8 18.55 7.55 19 7 19H4C3.45 19 3 18.55 3 18V6C3 5.45 3.45 5 4 5Z" />
      {/* Bass Buttons */}
      <circle cx="5.5" cy="8" r="1" fill="none" />
      <circle cx="5.5" cy="12" r="1" fill="none" />
      <circle cx="5.5" cy="16" r="1" fill="none" />

      {/* Bellows (Center) - Angled Lines for depth */}
      <path d="M8 6L16 6" />
      <path d="M8 18L16 18" />
      
      {/* Bellow Folds */}
      <path d="M8 8L16 8.5" opacity="0.8" />
      <path d="M16 11L8 11.5" opacity="0.8" />
      <path d="M8 14L16 14.5" opacity="0.8" />
      
      {/* Keyboard Box (Right) - Curved top */}
      <path d="M16 6C16 4.89543 16.8954 4 18 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H18C16.8954 20 16 19.1046 16 18V6Z" />
      
      {/* Keyboard Grill / Buttons hint */}
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
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.842 16.594c-.266.365-.774.453-1.139.186-3.13-2.124-7.238-2.587-12.008-1.426-.479.117-.957-.184-1.074-.663-.117-.478.184-.956.662-1.073 5.375-1.272 9.945-.732 13.565 1.705.422.285.508.908.22 1.271h-.226zm1.61-3.61c-.34.464-.99.59-1.455.25-3.66-2.613-9.198-3.085-13.486-1.748-.567.166-1.159-.166-1.325-.733-.166-.566.166-1.159.733-1.325 4.908-1.555 11.02-1.002 15.283 1.996.48.342.607 1.007.25 1.48v.08zm.136-3.702c-4.38-2.696-11.602-2.943-15.783-1.67-.665.204-1.366-.157-1.57-.822-.204-.666.157-1.367.822-1.571 4.814-1.48 12.75-1.173 17.778 1.914.606.362.795 1.152.433 1.758-.337.585-1.096.764-1.68.39z"/>
    <path d="M7.5 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
    <path d="M16.5 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
    <path d="M9 16.5V9.66c0-.52.56-.87 1.03-.64l5 2.5a.72.72 0 0 1 .37.64V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);