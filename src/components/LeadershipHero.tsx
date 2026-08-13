import React from 'react';
import { ArrowRight, CheckCircle2, Award } from 'lucide-react';

interface LeadershipHeroProps {
  onStartApplication: () => void;
  onTrackApplication: () => void;
}

export const LeadershipHero: React.FC<LeadershipHeroProps> = ({
  onStartApplication,
  onTrackApplication
}) => {
  return (
    <div className="bg-[#0b1c33] text-white min-h-[calc(100vh-60px)] pb-12">
      <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-4 pt-6">
        
        {/* Top Hero Banner CTA */}
        <div className="bg-gradient-to-r from-[#0e5e38] to-[#127a4a] rounded-xl p-5 mb-8 shadow-lg text-white border border-emerald-500/30">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
              Government Scheme 2026
            </span>
            <span className="text-xs font-serif text-emerald-100">وزارت خزانہ</span>
          </div>
          <h1 className="text-2xl font-serif font-bold leading-tight mb-2">
            Pakistan Loan Portal - آسان قرضہ اسکیم
          </h1>
          <p className="text-xs text-emerald-100 leading-relaxed mb-4">
            Get instant assistance from PKR 100,000 up to PKR 30,000,000 through government verified channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onStartApplication}
              id="hero-start-apply-btn"
              className="flex-1 bg-white text-[#0b1c33] hover:bg-emerald-50 active:bg-emerald-100 font-bold text-sm py-3 px-5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>APPLY FOR LOAN NOW</span>
              <ArrowRight className="w-4 h-4 text-[#0e5e38] group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onTrackApplication}
              id="hero-track-btn"
              className="bg-black/30 hover:bg-black/40 text-white font-semibold text-xs py-3 px-4 rounded-lg border border-white/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Track Application</span>
            </button>
          </div>
        </div>


        {/* Key Features & Eligibility Highlights */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Key Scheme Highlights & Benefits</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Loan Range:</strong> PKR 100,000 (1 Lakh) up to PKR 30,000,000 (3 Crore)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Processing Tax Fee:</strong> Minimal security verification tax of Rs. 75</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Fast Verification:</strong> 2-Factor OTP verification & 48-hour approval turnaround</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>All Banks Supported:</strong> HBL, UBL, Meezan, NBP, Allied, Alfalah & all microfinance banks</span>
            </li>
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={onStartApplication}
            id="hero-bottom-apply-btn"
            className="w-full bg-[#0f2848] hover:bg-[#163a66] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg border border-slate-700 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>Proceed to Loan Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
