import React from 'react';
import brandLogoLight from '../assets/brand-logo-light.png';
import brandLogoDark from '../assets/brand-logo-dark.png';
import brandIconLight from '../assets/brand-icon-light.png';
import brandIconDark from '../assets/brand-icon-dark.png';
import brandTextLight from '../assets/brand-text-light.png';
import brandTextDark from '../assets/brand-text-dark.png';
import { useAppStore } from '../store/useAppStore.js';

export function BrandLogo({
  className = 'h-7',
  isDark: propIsDark,
}: {
  className?: string;
  isDark?: boolean;
}) {
  const theme = useAppStore((s) => s.theme);
  const isDark =
    propIsDark !== undefined
      ? propIsDark
      : theme === 'dark' ||
        (theme === 'system' &&
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

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
  isDark: propIsDark,
}: {
  className?: string;
  withShadow?: boolean;
  isDark?: boolean;
}) {
  const theme = useAppStore((s) => s.theme);
  const isDark =
    propIsDark !== undefined
      ? propIsDark
      : theme === 'dark' ||
        (theme === 'system' &&
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <img
      src={isDark ? brandIconDark : brandIconLight}
      alt="chatbridge icon"
      className={`object-contain select-none pointer-events-none ${className}`}
    />
  );
}

export function LogoText({
  className = 'h-6',
  isDark: propIsDark,
}: {
  className?: string;
  isDark?: boolean;
}) {
  const theme = useAppStore((s) => s.theme);
  const isDark =
    propIsDark !== undefined
      ? propIsDark
      : theme === 'dark' ||
        (theme === 'system' &&
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <img
      src={isDark ? brandTextDark : brandTextLight}
      alt="chatbridge"
      className={`w-auto object-contain select-none pointer-events-none ${className}`}
    />
  );
}

export function LogoFull({
  className = 'h-8',
  isDark,
}: {
  className?: string;
  isDark?: boolean;
}) {
  return <BrandLogo className={className} isDark={isDark} />;
}
