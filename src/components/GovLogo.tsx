import React from 'react';

interface GovLogoProps {
  className?: string;
  size?: number;
}

export const GovLogo: React.FC<GovLogoProps> = ({ className = '', size = 44 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#034423] text-white shadow-sm border border-emerald-500/30 overflow-hidden shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        {/* Outer concentric rings */}
        <circle cx="50" cy="50" r="46" stroke="#C5A059" strokeWidth="2.5" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="42" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="39" fill="#01411C" />

        {/* Top Urdu Arc */}
        <path id="textPathTop" d="M 22,50 A 28,28 0 0,1 78,50" fill="none" />
        <text fill="#FFFFFF" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          <textPath href="#textPathTop" startOffset="50%">
            حکومت پاکستان
          </textPath>
        </text>

        {/* Bottom English Arc */}
        <path id="textPathBottom" d="M 78,50 A 28,28 0 0,1 22,50" fill="none" />
        <text fill="#C5A059" fontSize="4.8" fontWeight="600" letterSpacing="0.5" textAnchor="middle">
          <textPath href="#textPathBottom" startOffset="50%">
            GOVERNMENT OF PAKISTAN
          </textPath>
        </text>

        {/* Shield outline */}
        <path
          d="M38 34 H62 V48 C62 58 50 64 50 64 C50 64 38 58 38 48 Z"
          fill="#013115"
          stroke="#C5A059"
          strokeWidth="1.5"
        />
        <line x1="50" y1="34" x2="50" y2="64" stroke="#C5A059" strokeWidth="1" />
        <line x1="38" y1="46" x2="62" y2="46" stroke="#C5A059" strokeWidth="1" />

        {/* Star & Crescent */}
        <path d="M51 24 A4 4 0 1 1 45 28 A3.2 3.2 0 1 0 50 25.5 Z" fill="#FFFFFF" />
        <polygon
          points="52,24 53,26 55,26 53.5,27.2 54,29 52.5,28 51,29 51.5,27.2 50,26 52,26"
          fill="#FFFFFF"
        />

        {/* Four Quarters inside shield (Cotton, Wheat, Tea, Jute) */}
        <path d="M43 38 C43 36 45 36 45 42" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M42 39 C44 38 46 40 45 42" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="56" cy="40" r="2.2" fill="#FFFFFF" opacity="0.9" />
        <path d="M42 53 C44 50 46 54 44 56" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M54 53 C56 50 58 54 56 56" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />

        {/* Floral Wreath */}
        <path
          d="M 32 44 C 32 60 42 69 50 72 C 58 69 68 60 68 44"
          stroke="#C5A059"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Scroll Motto at base */}
        <rect x="33" y="70" width="34" height="6" rx="2" fill="#C5A059" />
        <text x="50" y="74.5" fill="#013115" fontSize="3.8" fontWeight="bold" textAnchor="middle">
          ایمان • اتحاد • نظم
        </text>
      </svg>
    </div>
  );
};
