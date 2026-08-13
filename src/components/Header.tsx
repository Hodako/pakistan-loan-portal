import React from 'react';
import { GovLogo } from './GovLogo';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onApplyClick: () => void;
  onTrackClick: () => void;
  onHomeClick: () => void;
  currentStep: string;
}

export const Header: React.FC<HeaderProps> = ({
  onApplyClick,
  onTrackClick,
  onHomeClick,
  currentStep
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-2.5 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo and Portal Title */}
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-3 text-left group focus:outline-hidden"
          id="header-logo-btn"
        >
          <GovLogo size={42} />
          <div>
            <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase font-sans">
              MINISTRY OF FINANCE
            </span>
            <span className="block text-lg sm:text-xl font-bold font-serif text-[#0b1c33] group-hover:text-[#0e5e38] transition-colors leading-tight">
              Pakistan Loan Portal
            </span>
          </div>
        </button>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onTrackClick}
            id="track-application-header-btn"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0b1c33] bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors border border-slate-200/80"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Track Application</span>
          </button>

          <button
            onClick={onApplyClick}
            id="apply-now-header-btn"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#0f2848] hover:bg-[#163a66] active:bg-[#0b1c33] px-4 py-2 rounded-md shadow-xs transition-all tracking-wide"
          >
            <span>APPLY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
