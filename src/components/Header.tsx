import React from 'react';
import { GovLogo } from './GovLogo';
import { Search, Calculator, Layers, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onApplyClick: () => void;
  onTrackClick: () => void;
  onCalculatorClick?: () => void;
  onTiersClick?: () => void;
  onHomeClick: () => void;
  currentStep: string;
}

export const Header: React.FC<HeaderProps> = ({
  onApplyClick,
  onTrackClick,
  onCalculatorClick,
  onTiersClick,
  onHomeClick,
  currentStep,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Green Bar */}
      <div className="bg-linear-to-r from-[#033618] via-[#064e26] to-[#012510] text-emerald-100 text-[11px] py-1.5 px-3 sm:px-6 border-b border-emerald-900/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">
              Government of Pakistan • Ministry of Finance (حکومت پاکستان)
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <span className="hidden sm:inline font-mono">Toll Free: 0800 114 400</span>
            <span className="font-urdu">Urdu / English (دو لسانی پورٹل)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <button
          onClick={onHomeClick}
          id="header-logo-btn"
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden cursor-pointer"
        >
          <GovLogo size={42} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-sans">
                MINISTRY OF FINANCE
              </span>
              <span className="text-xs sm:text-sm font-urdu font-bold text-emerald-700">
                وزارت خزانہ
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-serif-display text-[#091e38] group-hover:text-emerald-800 transition-colors leading-tight">
              Pakistan Loan Portal
            </h1>
          </div>
        </button>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={onTrackClick}
            id="track-application-header-btn"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-900 hover:bg-slate-100 rounded-md transition-colors border border-slate-200/80 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-emerald-700" />
            <span>Track Application</span>
          </button>

          {onCalculatorClick && (
            <button
              onClick={onCalculatorClick}
              id="calculator-header-btn"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-900 hover:bg-slate-100 rounded-md transition-colors border border-slate-200/80 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>Loan Calculator</span>
            </button>
          )}

          {onTiersClick && (
            <button
              onClick={onTiersClick}
              id="tiers-header-btn"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-900 hover:bg-slate-100 rounded-md transition-colors border border-slate-200/80 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Loan Tiers</span>
            </button>
          )}

          <button
            onClick={onApplyClick}
            id="header-apply-btn"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 bg-[#091e38] hover:bg-[#0e2c4f] active:bg-[#061628] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-md shadow-sm transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>APPLY</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
