import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const OFFICIAL_LOGO_URL = '/assets/gudbazaar_logo_transparent.png';

export const GudbazaarLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
}) => {
  const isLight = variant === 'light';

  // Sizing mapping with responsive mobile scale
  const heightClass =
    size === 'sm'
      ? 'h-8 sm:h-9 md:h-10'
      : size === 'lg'
      ? 'h-12 sm:h-14 md:h-16'
      : 'h-8.5 sm:h-10 md:h-12';

  if (isLight) {
    // For dark background sections (e.g. deep jaggery brown footer)
    return (
      <div className={`inline-flex items-center bg-[#FFF9EF] px-3.5 py-1.5 rounded-xl border border-[#E9DDC9] shadow-xs select-none ${className}`}>
        <img
          src={OFFICIAL_LOGO_URL}
          alt="Gudbazaar - Pure Jaggery"
          className={`${heightClass} w-auto object-contain`}
          loading="eager"
        />
      </div>
    );
  }

  // Standard logo with dark mode adaptive container for high contrast
  return (
    <div className={`inline-flex items-center select-none dark:bg-[#FFF9EF] dark:px-2 dark:py-1 dark:rounded-xl dark:shadow-xs transition-colors ${className}`}>
      <img
        src={OFFICIAL_LOGO_URL}
        alt="Gudbazaar - Pure Jaggery"
        className={`${heightClass} w-auto object-contain transition-transform group-hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
};

export const LogoLink: React.FC<LogoProps> = (props) => {
  return (
    <Link
      to="/"
      className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47752F] rounded-lg transition-opacity hover:opacity-95"
      aria-label="Gudbazaar - Home"
    >
      <GudbazaarLogo {...props} />
    </Link>
  );
};
