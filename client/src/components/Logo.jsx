import React from 'react';

export default function Logo({ size = 'default', showTagline = false, className = '' }) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconSize = isSmall ? 'w-7 h-7' : isLarge ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Original NexLearn Abstract Graduation Cap & Open Book SVG */}
      <div className={`relative flex items-center justify-center ${iconSize} rounded-xl bg-gradient-to-br from-[#102A43] via-[#1E3A8A] to-[#2563EB] shadow-md shadow-blue-900/15 flex-shrink-0`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Graduation Cap / Diamond Crest */}
          <path
            d="M16 4.5L5 10.5L16 16.5L27 10.5L16 4.5Z"
            fill="#FFFFFF"
          />
          {/* Open Book Wings & Cap Underlay */}
          <path
            d="M9 13.5V19.5C9 22 12.1 24.5 16 24.5C19.9 24.5 23 22 23 19.5V13.5L16 17.5L9 13.5Z"
            fill="#14B8A6"
          />
          {/* Tassel cord and bead */}
          <path
            d="M26 11V18"
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="26" cy="18.5" r="1.5" fill="#FBBF24" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span className={`${textSize} font-black text-[#102A43]`}>
            Nex<span className="text-[#2563EB]">Learn</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] ml-0.5 mb-1" />
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase mt-0.5">
            Learn Today. Lead Tomorrow.
          </span>
        )}
      </div>
    </div>
  );
}
