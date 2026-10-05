import React from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Official NoteAgents Hexagonal Control Plane Icon
 * Rendered with exact faceted isometric geometry and blue-to-cyan gradient
 */
export const NoteAgentsIcon: React.FC<{ size?: number | string; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Primary gradient: Blue to Cyan */}
        <linearGradient id="na-grad-main" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0B5FFF" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Facet gradients for 3D isometric lighting */}
        <linearGradient id="na-facet-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0047E0" />
          <stop offset="100%" stopColor="#0B5FFF" />
        </linearGradient>

        <linearGradient id="na-facet-bottom-left" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0052FF" />
          <stop offset="100%" stopColor="#0077FF" />
        </linearGradient>

        <linearGradient id="na-facet-bottom-right" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0077FF" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        <linearGradient id="na-facet-right" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="na-facet-top-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        <linearGradient id="na-facet-top-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B5FFF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="na-inner-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Hexagonal Outer Frame & 6 Isometric Facets */}
      {/* 1. Left Vertical Facet */}
      <polygon
        points="10,27 28,37.5 28,62.5 10,73"
        fill="url(#na-facet-left)"
      />

      {/* 2. Bottom-Left Facet */}
      <polygon
        points="10,73 28,62.5 50,75 50,96"
        fill="url(#na-facet-bottom-left)"
      />

      {/* 3. Bottom-Right Facet */}
      <polygon
        points="50,96 50,75 72,62.5 90,73"
        fill="url(#na-facet-bottom-right)"
      />

      {/* 4. Right Vertical Facet */}
      <polygon
        points="90,73 72,62.5 72,37.5 90,27"
        fill="url(#na-facet-right)"
      />

      {/* 5. Top-Right Facet */}
      <polygon
        points="90,27 72,37.5 50,25 50,4"
        fill="url(#na-facet-top-right)"
      />

      {/* 6. Top-Left Facet */}
      <polygon
        points="50,4 50,25 28,37.5 10,27"
        fill="url(#na-facet-top-left)"
      />

      {/* Isometric Inner Chamber Depth / Bevel Highlight */}
      <polygon
        points="28,37.5 50,25 50,50 28,62.5"
        fill="url(#na-inner-bevel)"
      />
      <polygon
        points="50,25 72,37.5 72,62.5 50,50"
        fill="#FFFFFF"
        fillOpacity="0.15"
      />

      {/* Crisp Facet Dividers */}
      <path
        d="M50,4 L50,25 M90,27 L72,37.5 M90,73 L72,62.5 M50,96 L50,75 M10,73 L28,62.5 M10,27 L28,37.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />

      {/* Inner Hexagon Outline */}
      <polygon
        points="50,25 72,37.5 72,62.5 50,75 28,62.5 28,37.5"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeOpacity="0.6"
      />

      {/* Outer Hexagon Contour */}
      <polygon
        points="50,4 90,27 90,73 50,96 10,73 10,27"
        stroke="#0B5FFF"
        strokeWidth="1"
        strokeOpacity="0.2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * App Icon 512x512 Squircle Variant (as seen in official Media Kit)
 */
export const NoteAgentsAppIcon: React.FC<{ size?: number | string; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center rounded-2xl bg-white border border-slate-200/80 shadow-md p-1.5 shrink-0 ${className}`}
    >
      <NoteAgentsIcon size="100%" />
    </div>
  );
};

/**
 * Master Logo component matching official media kit specifications:
 * - Brand Name: "Note" (Dark #0F172A) + "Agents" (Blue #0B5FFF) + "®" (Registered Trademark)
 * - Tagline: "AI Engineering Control Plane"
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  variant = 'horizontal',
  className = '',
}) => {
  const iconPixelSizes = {
    xs: 24,
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
  };

  const textSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const taglineSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  };

  const pixelSize = iconPixelSizes[size];

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <NoteAgentsIcon size={pixelSize} />
        {showText && (
          <div className="mt-3">
            <div className={`font-black tracking-tight text-slate-900 leading-none ${textSizes[size]}`}>
              Note<span className="text-[#0B5FFF]">Agents</span>
              <span className="text-[#0B5FFF] text-[0.55em] font-bold align-super ml-0.5">®</span>
            </div>
            {showTagline && (
              <p className={`mt-1 font-semibold text-slate-500 tracking-[0.14em] uppercase ${taglineSizes[size]}`}>
                AI Engineering Control Plane
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <NoteAgentsIcon size={pixelSize} />

      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight text-slate-900 leading-none ${textSizes[size]}`}>
            Note<span className="text-[#0B5FFF]">Agents</span>
            <span className="text-[#0B5FFF] text-[0.55em] font-bold align-super ml-0.5">®</span>
          </div>
          {showTagline && (
            <p className={`mt-1 font-semibold text-slate-500 tracking-[0.14em] uppercase ${taglineSizes[size]}`}>
              AI Engineering Control Plane
            </p>
          )}
        </div>
      )}
    </div>
  );
};
