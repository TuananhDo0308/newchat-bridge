import React from 'react';
import brandLogoLight from '../assets/brand-logo-light.png';
import brandLogoDark from '../assets/brand-logo-dark.png';

export function BrandLogo({
  className = 'h-7',
  isDark = false,
}: {
  className?: string;
  isDark?: boolean;
}) {
  return (
    <img
      src={isDark ? brandLogoDark : brandLogoLight}
      alt="chatbridge"
      className={`w-auto object-contain select-none pointer-events-none ${className}`}
    />
  );
}

export function LogoIcon({
  className = 'w-9 h-9',
  withShadow = true,
}: {
  className?: string;
  withShadow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {withShadow && (
          <filter id="chatbridge-shadow-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="28" stdDeviation="24" floodColor="#F26716" floodOpacity="0.4" />
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        )}
      </defs>

      <g filter={withShadow ? 'url(#chatbridge-shadow-filter)' : undefined}>
        {/* Top Segment */}
        <path
          fill="#F26716"
          d="
            M 255,101 
            H 745 
            A 130,130 0 0 1 875,231 
            V 283 
            A 13,13 0 0 1 862,296 
            H 138 
            A 13,13 0 0 1 125,283 
            V 231 
            A 130,130 0 0 1 255,101 
            Z"
        />

        {/* Middle Segment */}
        <path
          fill="#F26716"
          d="
            M 138,402 
            H 862 
            A 13,13 0 0 1 875,415 
            V 616 
            A 13,13 0 0 1 856,627 
            Q 500,432 144,627 
            A 13,13 0 0 1 125,616 
            V 415 
            A 13,13 0 0 1 138,402 
            Z"
        />

        {/* Bottom Segment */}
        <path
          fill="#F26716"
          d="
            M 131,743 
            Q 500,536 869,743 
            A 13,13 0 0 1 875,754 
            A 130,130 0 0 1 745,884 
            H 255 
            A 130,130 0 0 1 125,754 
            A 13,13 0 0 1 131,743 
            Z"
        />
      </g>
    </svg>
  );
}

export function LogoText({ className = 'h-7' }: { className?: string }) {
  return (
    <span className={`font-extrabold text-[#26272B] tracking-tight text-xl font-['Plus_Jakarta_Sans',sans-serif] ${className}`}>
      chatbridge
    </span>
  );
}

export function LogoFull({ className = 'h-8', isDark = false }: { className?: string; isDark?: boolean }) {
  return (
    <BrandLogo className={className} isDark={isDark} />
  );
}
