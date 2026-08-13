import React from 'react';
import logoSvg from '../../logo.svg';

interface GovLogoProps {
  className?: string;
  size?: number;
}

export const GovLogo: React.FC<GovLogoProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-white text-[#007236] p-1 shadow-xs border border-emerald-700/20 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoSvg}
        alt="Government of Pakistan Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
